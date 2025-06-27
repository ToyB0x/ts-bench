import { Command, Option } from "@commander-js/extra-typings";
import { migrateDb } from "@ts-bench/db";
import { simpleGit } from "simple-git";
import {
  listCachedPackagesByTurboTypeCheck,
  listCommits,
  runPreprpareCommands,
} from "./libs";
import { runBench } from "./runBench";

export const makeAnalyzeCommand = () => {
  const analyze = new Command("analyze");
  analyze.description("analyze related commands.");

  analyze
    .command("tsc", { isDefault: true })
    .description("check tsc performance")
    .action(async () => {
      const enableForceMigrationConflict = true;
      await migrateDb(enableForceMigrationConflict);
      await runBench().catch(console.error);
    });

  analyze
    .command("span")
    .description("check tsc performance with multiple commits range")
    // option: specify span type (days or commits)
    .addOption(
      new Option("-t, --type <type>", "type of span (days or commits)")
        .choices(["days", "commits"])
        .default("commits"),
    )
    // option: specify span size (e.g., 10, 100, 1000)
    .addOption(
      new Option(
        "-s, --size <size>",
        "size of span (e.g., 10, 100, 1000)",
      ).default(30),
    )
    // option: specify skip commits (e.g., 0, 5, 10)
    .addOption(
      new Option(
        "-k, --skip <skip>",
        "number of commits to skip each scan (default: 0)",
      ).default(0),
    )
    // option: specify setup commands (dependencies install, build monorepo, ...)
    .addOption(
      new Option(
        "-p, --prepare-commands <commands...>",
        "prepare / setup commands to run before analyze",
      ).default(["pnpm install --reporter=silent", "pnpm build"] as string[]),
    )

    // TODO: enable this in the future
    // option: specify commands for detect affected packages
    // .addOption(
    //   new Option(
    //     "-d, --detect-affected-commands <commands...>",
    //     "commands to run for detect affected packages",
    //   ).default("turbo run typecheck --dry-run"),
    // )

    // NOTE: cache check は　実際にTurboでtypecheck コマンドを実行したログがファイルとして出力された前と後しか比べられない
    // (そのために毎回cache checkを実行するのは大変 / 数回に1度だけ実行するとそこそこ効果はあるかもしれない？)
    // Turbo管理の管理下になるようにコマンドによるpackage.jsonやturbo.jsonの自動modifyまたは、マニュアルに記載して手動変更してもらうことで高速化はできる？
    // mode: handle by turbo cache のようなモードオプションをつける
    // 1日間隔などのキャッシュが近い場合は効果があるが、1ヶ月ごとなどだとキャッシュが古くなっていて再利用割合が減ってあまり意味がなさそうなことには注意
    // 本来はパッケージ単位のtrace fileがどのcommitで生成されたかを記録しておいた上で、現在のcommitでは依存パッケージや依存ファイルが変更されていないかを確認して、キャッシュを再利用するのが理想的な実装 (ただしパッケージのワークスペースやtsのproject referenceを見なければならないとしたらかなり高度なので、高速化対応は後回しとする)

    // option: enable turbo cache (hard coded commands)
    // TODO: refactor this to pass commands as option (eg, typecheck, type-check, check-type, tsc, etc)
    .addOption(
      new Option(
        "-c, --enable-turbo-cache-by-typecheck <boolean>",
        "enable turbo cache by exist typecheck command (default: false)",
      ).default(false),
    )

    // option: specify working directory for prepare commands
    .addOption(
      new Option(
        "-w, --working-dir <dir>",
        "working directory for prepare commands (default: current directory)",
      ).default("."),
    )
    // specify timeout in minutes
    .addOption(
      new Option(
        "-m, --timeout <minutes>",
        "timeout in minutes (default: 180)",
      ).default(180),
    )
    .action(async (options) => {
      // console.info({ options });
      const restoreBranch = await simpleGit().revparse([
        "--abbrev-ref",
        "HEAD",
      ]);

      const enableForceMigrationConflict = true;
      await migrateDb(enableForceMigrationConflict);

      // list commits
      const commits = await listCommits();
      const recentCommits = commits.slice(0, Number(options.size)).reverse(); // reverse to start from the oldest commit (キャッシュは古いものから生き残るはずなので、キャッシュの利用順序を古い時系列から扱うようにする)

      // check out to each commit
      let count = 0;
      let errorCount = 0;
      for (const commit of recentCommits) {
        count += 1;
        console.info(`${commit.hash} ( ${count}/ ${recentCommits.length})`);
        await simpleGit().checkout(commit.hash);
        try {
          await runPreprpareCommands(
            options.prepareCommands,
            options.workingDir,
          );

          const cachedPackages: string[] =
            options.enableTurboCacheByTypecheck.toString().toLowerCase() ===
            "false"
              ? []
              : listCachedPackagesByTurboTypeCheck(options.workingDir);

          // NOTE: if enable cached mode, it will wait all affected packages scan in same git commit
          // eg: speed up case
          // eg, cpu 4 / all package 12 / affected 4: 3x faster than no cache (cpu cycle count decrease to 1/3)
          // eg, cpu 4 / all package 12 / affected 5: 2x faster than no cache (cpu cycle count decrease to 1/2)
          // eg, cpu 4 / all package  4 / affected 1:  same speed as no cache (cpu cycle count never change)
          const enableShowTable = false;
          await runBench(enableShowTable, cachedPackages);
        } catch (error) {
          errorCount += 1;
          console.error(
            `Error running benchmark for commit ${commit.hash}:`,
            error,
          );
          if (errorCount >= 3) {
            console.error("Too many errors, stopping the analysis.");
            break;
          }
        }
      }

      // restore to the latest commit
      console.info("Restoring to the latest commit...");
      await simpleGit().checkout("HEAD");
      await simpleGit().checkout(restoreBranch);
      await runPreprpareCommands(options.prepareCommands, options.workingDir);
    });

  return analyze;
};
