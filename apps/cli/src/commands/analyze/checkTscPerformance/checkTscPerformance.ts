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
  // Step 2: run tsc for each package, and store result to sqlite (with multicore support)
  // Step 3: analyze the result and output to stdout
};
