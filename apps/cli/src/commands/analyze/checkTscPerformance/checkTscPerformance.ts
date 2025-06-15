import { listPackages } from "../libs";

export const checkTscPerformance = async () => {
  console.log("Running tsc performance check...");

  // Step 1: list packages in the git repository
  const packages = await listPackages();
  console.log(`Found ${packages.length} packages.`);
  console.log("Packages:", packages);

  /**
   * NOTE: マルチコア対応
   * モノレポ内で各パッケージの tsc --noEmit にかかる時間を、CPUコア数を考慮しつつCIで正確に計測したい場合は child_process が最も適切
   * - child_process (exec / spawn): 適切。tsc は外部コマンドなので、exec や spawn を使って直接呼び出すのが最も自然。プロセスの生成・実行・終了を直接制御。
   * - worker_threads: 不適切。ワーカースレッドは、Node.jsプロセス内でCPU負荷の高い計算処理を並列化するためのもの。外部コマンド (tsc) を実行するためにワーカースレッドを起動するのは、余計なオーバーヘッドがかかるだけでメリットがない。
   * - cluster: 不適切。cluster は、HTTPサーバーのようなネットワークサービスをマルチコアでスケールさせるためのモジュール。一度きりのコマンド実行には向いていない。
   */
  // Step 2: run tsc for each package, and return results (with multicore support)

  // TODO: 以下のスニペットを参考にSTEP2を実装する
  // const { exec } = require('child_process');
  // const { promisify } = require('util');
  // const os = require('os');
  // const path = require('path');
  // const glob = require('glob'); // パッケージを探すためにglobなどを使う
  //
  // const execPromise = promisify(exec);
  //
  // async function measureTscTimes() {
  //   const numCPUs = os.cpus().length;
  //   console.log(`Available CPUs: ${numCPUs}`);
  //
  //   // 1. モノレポ内のパッケージ一覧を取得
  //   const packageJsonPaths = glob.sync('packages/*/package.json');
  //   const packages = packageJsonPaths.map(p => path.dirname(p));
  //
  //   const results = {};
  //
  //   // 2. タスクプールを実装
  //   const taskQueue = [...packages];
  //   const runningTasks = new Set();
  //
  //   const runTask = async (packageDir) => {
  //     const packageName = path.basename(packageDir);
  //     console.log(`[START] ${packageName}`);
  //
  //     // 3. 高精度なタイマーで時間を計測
  //     const startTime = process.hrtime.bigint();
  //
  //     try {
  //       // 4. tscコマンドを実行
  //       await execPromise('npx tsc --noEmit', { cwd: packageDir });
  //       const endTime = process.hrtime.bigint();
  //       const durationMs = Number(endTime - startTime) / 1_000_000;
  //       results[packageName] = { status: 'success', durationMs };
  //       console.log(`[SUCCESS] ${packageName} in ${durationMs.toFixed(2)}ms`);
  //     } catch (error) {
  //       const endTime = process.hrtime.bigint();
  //       const durationMs = Number(endTime - startTime) / 1_000_000;
  //       results[packageName] = { status: 'failure', durationMs, error: error.stderr };
  //       console.error(`[FAILURE] ${packageName} in ${durationMs.toFixed(2)}ms`);
  //     } finally {
  //       runningTasks.delete(packageDir);
  //       // 次のタスクを開始
  //       if (taskQueue.length > 0) {
  //         const nextTaskDir = taskQueue.shift();
  //         runningTasks.add(nextTaskDir);
  //         runTask(nextTaskDir);
  //       }
  //     }
  //   };
  //
  //   // 5. CPUコア数までタスクを並列実行
  //   const initialTasks = taskQueue.splice(0, numCPUs);
  //   initialTasks.forEach(dir => {
  //     runningTasks.add(dir);
  //     runTask(dir);
  //   });
  //
  //   // 全てのタスクが完了するのを待つ
  //   await new Promise(resolve => {
  //     const interval = setInterval(() => {
  //       if (runningTasks.size === 0) {
  //         clearInterval(interval);
  //         resolve();
  //       }
  //     }, 100);
  //   });
  //
  //   console.log('\n--- All tasks completed ---');
  //   console.table(results);
  // }
  //
  // measureTscTimes();
  //

  // Step 3: analyze the result and output to stdout
  // Step 4: write result to sqlite (with multicore support)
};
