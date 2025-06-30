import { writeFileSync } from "node:fs";
import { GoogleGenAI } from "@google/genai";
import { db, eq, type resultTbl, scanTbl } from "@ts-bench/db";
import { simpleGit } from "simple-git";
import type { TablemarkOptions } from "tablemark";
import tablemark from "tablemark";
import { version } from "../../../../package.json";
import { printSimpleTable } from "./printSimpleTable";

type ReportContent = {
  title: string; // "## :zap: Tsc benchmark";
  text: string | null; // null content will be filtered out
};

// type Report = {
//   summary: ReportContent;
//   contents: ReportContent[];
// };

export const generateReportMarkdown = async (
  cpuModelAndSpeeds: string[],
  maxConcurrency: number,
  totalCPUs: number,
  // TODO: pass option with CLI (currently always true)
  enableAiReport = true,
) => {
  const recentScans = await db.query.scanTbl.findMany({
    limit: 2,
    orderBy: (scan, { desc }) => desc(scan.commitDate),
    with: {
      results: true,
    },
  });

  const [currentScan, prevScan] = recentScans;
  if (!currentScan) {
    throw Error("No current scan results found to show table.");
  }

  const tableRows = currentScan.results
    .sort((a, b) =>
      a.isSuccess && b.isSuccess && a.traceNumType && b.traceNumType
        ? b.traceNumType - a.traceNumType
        : b.package.localeCompare(a.package),
    )
    .map((r) =>
      r.isSuccess
        ? {
            package: r.package,
            types: `${r.types}${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.types || 0, r.types || 0)}`,
            instantiations: `${r.instantiations}${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.instantiations || 0, r.instantiations || 0)}`,
            // traceTypes: `${r.traceNumType}${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.traceNumType || 0, r.traceNumType || 0)}`,
            traceTypesSize: `${r.traceFileSizeType}${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.traceFileSizeType || 0, r.traceFileSizeType || 0)}`,
            totalTime: `${r.totalTime}s${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.totalTime || 0, r.totalTime || 0)}`,
            memoryUsed: `${r.memoryUsed}K${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.memoryUsed || 0, r.memoryUsed || 0)}`,
            // analyzeHotSpotMs: `${r.analyzeHotSpotMs}ms${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.analyzeHotSpotMs || 0, r.analyzeHotSpotMs || 0)}`,
            assignabilityCacheSize: `${r.assignabilityCacheSize}K${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.assignabilityCacheSize || 0, r.assignabilityCacheSize || 0)}`,
            identityCacheSize: `${r.identityCacheSize}K${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.identityCacheSize || 0, r.identityCacheSize || 0)}`,
            subtypeCacheSize: `${r.subtypeCacheSize}K${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.subtypeCacheSize || 0, r.subtypeCacheSize || 0)}`,
            strictSubtypeCacheSize: `${r.strictSubtypeCacheSize}K${calcDiff(!prevScan ? 0 : prevScan.results.find((prev) => prev.package === r.package)?.strictSubtypeCacheSize || 0, r.strictSubtypeCacheSize || 0)}`,
          }
        : {
            package: r.package,
            types: "Error",
            instantiations: "",
            // traceTypes: "Error",
            traceTypesSize: "",
            totalTime: "",
            memoryUsed: "",
            // analyzeHotSpotMs: "",
            assignabilityCacheSize: "",
            identityCacheSize: "",
            subtypeCacheSize: "",
            strictSubtypeCacheSize: "",
          },
    );

  // Helper function to generate metric summary
  const generateMetricSummary = (
    currentResults: typeof currentScan.results,
    prevResults: NonNullable<typeof prevScan>["results"] | undefined,
    metric: keyof typeof resultTbl.$inferSelect,
  ) => {
    const currentTotal = calculateTotal(currentResults, metric);
    const prevTotal = prevResults ? calculateTotal(prevResults, metric) : 0;
    return `${currentTotal}${calcDiff(prevTotal, currentTotal)}`;
  };

  // summary row for all packages (Total)
  const totalSummaryRow = {
    // 増減のあったパッケージ数
    typesChangePackages: `+${tableRows.filter((r) => r.types.includes("+")).length} -${tableRows.filter((r) => r.types.includes("-")).length}`,
    types: generateMetricSummary(
      currentScan.results,
      prevScan?.results,
      "types",
    ),
    instantiations: generateMetricSummary(
      currentScan.results,
      prevScan?.results,
      "instantiations",
    ),
    traceTypesSize: generateMetricSummary(
      currentScan.results,
      prevScan?.results,
      "traceNumType",
    ),
    totalTime: generateMetricSummary(
      currentScan.results,
      prevScan?.results,
      "totalTime",
    ),
    memoryUsed: generateMetricSummary(
      currentScan.results,
      prevScan?.results,
      "memoryUsed",
    ),
    analyzeHotSpotMs:
      calculateTotal(currentScan.results, "analyzeHotSpotMs") +
      `${calcDiff(
        !prevScan ? 0 : calculateTotal(prevScan.results, "analyzeHotSpotMs"),
        calculateTotal(currentScan.results, "analyzeHotSpotMs"),
      )}`,
    assignabilityCacheSize:
      calculateTotal(currentScan.results, "assignabilityCacheSize") +
      `${calcDiff(
        !prevScan
          ? 0
          : calculateTotal(prevScan.results, "assignabilityCacheSize"),
        calculateTotal(currentScan.results, "assignabilityCacheSize"),
      )}`,
    identityCacheSize:
      calculateTotal(currentScan.results, "identityCacheSize") +
      `${calcDiff(
        !prevScan ? 0 : calculateTotal(prevScan.results, "identityCacheSize"),
        calculateTotal(currentScan.results, "identityCacheSize"),
      )}`,
    subtypeCacheSize:
      calculateTotal(currentScan.results, "subtypeCacheSize") +
      `${calcDiff(
        !prevScan ? 0 : calculateTotal(prevScan.results, "subtypeCacheSize"),
        calculateTotal(currentScan.results, "subtypeCacheSize"),
      )}`,
    strictSubtypeCacheSize:
      calculateTotal(currentScan.results, "strictSubtypeCacheSize") +
      `${calcDiff(
        !prevScan
          ? 0
          : calculateTotal(prevScan.results, "strictSubtypeCacheSize"),
        calculateTotal(currentScan.results, "strictSubtypeCacheSize"),
      )}`,
  };

  const tables = {
    plus: tableRows
      .filter((r) => r.types !== "Error")
      .filter((r) => r.types.includes("+") || r.instantiations.includes("+")),
    minus: tableRows
      .filter((r) => r.types !== "Error")
      .filter((r) => r.types.includes("-") || r.instantiations.includes("-")),
    cacheChanges: tableRows
      .filter((r) => r.types !== "Error")
      .filter(
        (r) =>
          r.assignabilityCacheSize.includes("+") ||
          r.assignabilityCacheSize.includes("-") ||
          r.identityCacheSize.includes("+") ||
          r.identityCacheSize.includes("-") ||
          r.subtypeCacheSize.includes("+") ||
          r.subtypeCacheSize.includes("-") ||
          r.strictSubtypeCacheSize.includes("+") ||
          r.strictSubtypeCacheSize.includes("-"),
      ),
    noChange: tableRows
      .filter((r) => r.types !== "Error")
      .filter(
        (r) =>
          !r.types.includes("+") &&
          !r.types.includes("-") &&
          !r.instantiations.includes("+") &&
          !r.instantiations.includes("-"),
      ),
    error: tableRows.filter((r) => r.types === "Error"),
  };

  const tablemarkOptions = {
    columns: [
      { align: "left" }, // package
      { align: "right" }, // types
      { align: "right" }, // instantiations
      // { align: "right" }, // traceTypes
      { align: "right" }, // traceTypesSize
      { align: "right" }, // totalTime
      { align: "right" }, // memoryUsed
      { align: "right" }, // analyzeHotSpotMs
      { align: "right" }, // assignabilityCacheSize
      { align: "right" }, // identityCacheSize
      { align: "right" }, // subtypeCacheSize
      { align: "right" }, // strictSubtypeCacheSize
      { align: "left" }, // error
    ],
  } satisfies TablemarkOptions;

  const currentSummary = {
    totalTimes: currentScan.results.reduce((total, current) => {
      return total + (current.totalTime || 0);
    }, 0),
    // numSuccessPackage: currentScan.results.filter((r) => r.isSuccess).length,
    successPackagesNames: currentScan.results
      .filter((r) => r.isSuccess)
      .map((r) => r.package),
  };

  const prevSummary = {
    totalTimes: prevScan
      ? prevScan.results.reduce((total, current) => {
          return total + (current.totalTime || 0);
        }, 0)
      : 0,
    // numSuccessPackage: prevScan
    //   ? prevScan.results.filter((r) => r.isSuccess).length
    //   : 0,
    successPackagesNames: prevScan
      ? prevScan.results.filter((r) => r.isSuccess).map((r) => r.package)
      : [],
  };

  const diffSummary = {
    totalTimes: `${currentSummary.totalTimes - prevSummary.totalTimes}s ${calcDiff(prevSummary.totalTimes, currentSummary.totalTimes)}`,
    // numSuccessPackage: `${currentSummary.numSuccessPackage - prevSummary.numSuccessPackage}`,
    diffPackageNames: {
      added: currentSummary.successPackagesNames.filter(
        (pkg) => !prevSummary.successPackagesNames.includes(pkg),
      ),
      deleted: prevSummary.successPackagesNames.filter(
        (pkg) => !currentSummary.successPackagesNames.includes(pkg),
      ),
    },
  };

  const NO_CHANGE_SUMMARY_TEXT = "- This PR has no significant changes";
  const hasAnyImportantBuildChanges =
    tables.minus.length > 0 || tables.plus.length > 0;
  const hasAnyImportantCacheChanges = tables.cacheChanges.length > 0;

  let summaryText = "";
  if (!hasAnyImportantBuildChanges && !hasAnyImportantCacheChanges) {
    summaryText += NO_CHANGE_SUMMARY_TEXT;
  } else {
    summaryText += hasAnyImportantBuildChanges
      ? `
- ${tables.minus.length} packages become faster
- ${tables.plus.length} packages become slower
- ${tables.error.length} packages have errors
- ${tables.cacheChanges.length} packages cache changes
`
      : "";
    summaryText += hasAnyImportantCacheChanges
      ? "- Cache sizes have changed"
      : "";
  }

  const summaryContent: ReportContent = {
    title: "## :zap: Tsc benchmark",
    text: summaryText,
  };

  const contentTotalSummary: ReportContent = {
    title: "### Total Summary",
    text: tablemark([totalSummaryRow], tablemarkOptions),
  };

  const contentTablePlus: ReportContent = {
    title: "#### :tada: Faster packages",
    text: tables.minus.length
      ? tablemark(tables.minus, tablemarkOptions)
      : null,
  };

  const contentTableMinus: ReportContent = {
    title: "#### :rotating_light: Slower packages",
    text: tables.plus.length ? tablemark(tables.plus, tablemarkOptions) : null,
  };

  const contentTableCache: ReportContent = {
    title: "#### :package: Cache size changes",
    text: tables.cacheChanges.length
      ? tablemark(tables.cacheChanges, tablemarkOptions)
      : null,
  };

  let aiResponseStructured:
    | {
        impact: string;
        reason: string;
        suggestion: string;
      }
    | undefined;
  // 静的解析で影響がない場合はAI利用を省略し高速化 / コスト削減
  if (enableAiReport && summaryContent.text !== NO_CHANGE_SUMMARY_TEXT) {
    const GEMINI_API_KEY = process.env["GEMINI_API_KEY"];
    if (!GEMINI_API_KEY)
      throw Error(
        "GEMINI_API_KEY is not set. Please set it in your environment variables.",
      );

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const diff = process.env["CI"]
      ? // use gh command to get diff in GitHub Actions
        await simpleGit().raw(["diff", "--no-color", "HEAD^", "HEAD"])
      : // in local development, use diff from current branch last commit to main branch head commit
        await simpleGit().raw(["diff", "--no-color", "HEAD^", "origin/main"]);

    console.info({ diff });

    const aiResponse = await ai.models.generateContent({
      // TODO: enable switch to gemini-2.5-flash or other models via CLI option
      model: process.env["GEMINI_MODEL"] || "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          // - 影響: impact
          // - 原因: reason
          // - 提案: suggestion
          type: "object",
          properties: {
            impact: {
              type: "string",
              description: `影響: types、instantiationsまたはキャッシュ関連の指標から推測される、分析対象のコード変更がリポジトリに与える影響(以下のフォーマットで簡潔に記載し、インパクトの程度に応じて危険性を表す絵文字を付与)
eg1. 型の数が増えたためxxx個のパッケージの(ビルド|IDE|ビルドとIDE)がyyy(かなり|少し|無視できる範囲で)遅くなります (emoji)[改行\n]
(変動がある場合は影響具合を "X.Y%程度"という簡潔な記載のかっこ書きで追加)

eg2. 型計算量が増えたためxxx個のパッケージの(ビルド|IDE|ビルドとIDE)がyyy(かなり|少し|無視できる範囲で)遅くなります (emoji)[改行\n]
(変動がある場合は影響具合を "X.Y%程度"という簡潔な記載のかっこ書きで追加)

eg3. 特筆すべき変化はありません (測定誤差程度の変動のみ)
`,
            },
            reason: {
              type: "string",
              description: `Git diffの結果から推測される、types、instantiationsまたはキャッシュ関連の指標に変動が影響が生じた理由(出来るだけ以下フォーマットで簡潔に記載。複数の原因がありそうな場合は適宜フォーマットを調整)
xxxのファイルに対するyyyの変更により、zzzが変動した可能性があります
`,
            },
            suggestion: {
              type: "string",
              description:
                "提案(必ず1行以内に収めて記載): もしも改善や対応、判断が必要であれば、何をすべきかを提案する",
            },
          },
          required: ["impact", "reason", "suggestion"],
        },
      },
      contents: `
# What users want:
1. ユーザはTSCコマンドやIDEの型推論、インテリセンスが遅くなるのを防止したい(機能追加やリファクタ内容に見合った性能劣化は許容するが、無駄に遅くなるのは避けたい)
2. ユーザはTSCコマンドやIDEの型推論、インテリセンスが遅くなる可能性がありそうな場合にその理由をしりたい
3. ユーザはもしも改善や対応、判断が必要であれば何をすべきか知りたい

# YOUR TASK:
以下のそれぞれの項目を、簡潔さを重視し記載してください(1~2センテンス程に収めることを目指す。以下項目以外の出力は必ず避ける)
- 影響(必ず1行以内に収めて記載): 変更がリポジトリに与える影響(このPRがマージされた場合に何が起こるかを通知する。ビルドかIDE(型推論やインテリセンス)に影響がある場合はそのどちらが対象かを記載)
- 原因(必ず1行以内に収めて記載): 上記の影響が生じた理由
- 提案(必ず1行以内に収めて記載): もしも改善や対応、判断が必要であれば、何をすべきかを提案する

# 考慮点
- レポートの指標は"tsc --extendedDiagnostics"コマンドの分析結果を利用しています
- 分析結果の指標は計測マシンのCPUやメモリ、OSの影響を受けるため不安定であることを考慮し、これらの影響を受けにくいTypesとInstantiationsの指標を中心に分析
- 指標が悪化または改善した場合は、その理由をgit diffの結果から推測

# 技術的な情報: コンパイルについて
- Types: 型定義の複雑さを示します(コンパイラがプログラム内で認識または作成した型の総数)
- Instantiations: ジェネリック型の使用頻度と複雑さを示し、コンパイル時間への影響が特に大きい項目です(ジェネリックな型定義に対して、Tの部分に具体的な型を当てはめて新しい型を作成するプロセスです。この数値が極端に大きい場合、複雑なジェネリック型や型定義の再帰的な参照などが多用されており、それがコンパイル時間の増加の主な原因である可能性が高いことを示唆します。型定義の最適化を検討する際の最重要指標で、Check timeと直接相関し、コンパイル速度の主要な決定要因となる)

# 技術的な情報: IDEの軽量化に役立つ指標について
- identityCacheSize: 構造的に同一な型同士の比較結果をキャッシュし、IDEが同じ型の構造を再評価する手間を省く
- assignabilityCacheSize: 型の代入可否（例: let a: T = b）の結果をキャッシュし、IDEがコーディング中の頻繁な代入エラーチェックを高速化する
- subtypeCacheSize: ある型が別の型の部分型であるかの判定結果をキャッシュし、IDEが複雑な型の互換性を素早く判断できるようにする
- strictSubtypeCacheSize: strictNullChecks有効時の厳密な型比較の結果をキャッシュし、IDEがnull等の厳格なエラーチェックを瞬時に行えるようにする

# 技術的な情報: コンパイルパフォーマンスの改善における重要指標
- コンパイルパフォーマンスの改善を目指す際には、特に Instantiations と Types の数値を注視し、型定義をシンプルにできないか検討することが有効です。
  
# Report:
${summaryContent.title}
${summaryContent.text}

${contentTotalSummary.title}
${contentTotalSummary.text}

${contentTablePlus.text ? contentTablePlus.title : ""}
${contentTablePlus.text || ""}

${contentTableMinus.text ? contentTableMinus.title : ""}
${contentTableMinus.text || ""}

${contentTableCache.text ? contentTableCache.title : ""}
${contentTableCache.text || ""}

# Git diff:
${diff}`,
    });

    if (aiResponse?.text) {
      try {
        aiResponseStructured = JSON.parse(aiResponse.text);
      } catch (error) {
        console.error("Failed to parse AI response:", error);
      }
    }
  }

  const mdContent = `
${summaryContent.title}
${
  aiResponseStructured
    ? `
${aiResponseStructured.impact}

<details><summary><strong>原因と提案</strong></summary>

- **原因**:  
  ${aiResponseStructured.reason}
- **提案**:  
  ${aiResponseStructured.suggestion}
</details>

`
    : summaryContent.text
}

${
  !hasAnyImportantBuildChanges && !hasAnyImportantCacheChanges
    ? ""
    : `<details><summary>Details</summary>

${contentTotalSummary.title}
${contentTotalSummary.text}

${contentTablePlus.text ? contentTablePlus.title : ""}
${contentTablePlus.text || ""}

${contentTableMinus.text ? contentTableMinus.title : ""}
${contentTableMinus.text || ""}

${contentTableCache.text ? contentTableCache.title : ""}
${contentTableCache.text || ""}
`
}
</details>

<details><summary>Full Details</summary>

- TSC Benchmark version: ${version}
- CPU: ${cpuModelAndSpeeds.join(", ")} (${maxConcurrency} / ${totalCPUs})
- Diff: 
    - TotalTime: ${diffSummary.totalTimes}
    - Analyzed Packages: +${diffSummary.diffPackageNames.added.length} -${diffSummary.diffPackageNames.deleted.length}  
      ${diffSummary.diffPackageNames.added.length ? `added: ${diffSummary.diffPackageNames.added.join(", ")}` : ""} ${diffSummary.diffPackageNames.deleted.length ? `deleted: ${diffSummary.diffPackageNames.deleted.join(", ")}` : ""}

<!-- TODO: 絶対値(リアル秒)表示追加を検討 -->
<!-- TODO: マシンに影響されたないtypesの合計変動表示追加を検討 -->
${tables.noChange.length ? `<details><summary>Open: No change pakcages</summary>\n\n${tablemark(tables.noChange, tablemarkOptions)}</details>` : ""}

${tables.error.length ? `<details><summary>Open: Error packages</summary>\n\n${tablemark(tables.error, tablemarkOptions)}</details>` : ""}

<details><summary>Open Full Analysis</summary>
<pre>
# Current
${printSimpleTable(currentScan.results).trim()}
# Prev
${prevScan ? printSimpleTable(prevScan.results).trim() : "N/A"}
</pre>
</details>

</details>

<p align="right">Compared to ${prevScan ? prevScan.commitHash : "N/A"}</p>

`;

  // write to ts-bench-report.md file
  const reportPath = "ts-bench-report.md";
  writeFileSync(reportPath, mdContent, "utf8");

  // TODO: refactor (レポート生成の中でDB更新しているのはよくない)
  await updateDatabaseWithAIComments(currentScan.id, aiResponseStructured);
};

// TODO: diff だけではなく、元の数値も出すと便利かも(パーセンテージではなく、絶対値も表示することを検討)
// calculate the difference between two numbers
// - case:plus  before 100, after 121 --> +21.0%)
// - case:minus before 100, after 92 --> -8.0%)
const calcDiff = (before: number, after: number): string => {
  if (before === 0) return "N/A"; // Avoid division by zero

  const diff = ((after - before) / Math.abs(before)) * 100;
  const diffFixedLength = Math.abs(diff).toFixed(1);
  if (diffFixedLength === "0" || diffFixedLength === "0.0") return ""; // No change, return empty string

  const sign = diff >= 0 ? "+" : "-";
  return ` (${sign}${diffFixedLength}%)`; // eg: 半角スペース (1.1%)
};

const updateDatabaseWithAIComments = async (
  scanId: number,
  aiResponse:
    | { impact?: string; reason?: string; suggestion?: string }
    | undefined,
): Promise<void> => {
  if (!aiResponse) return;
  await db
    .update(scanTbl)
    .set({
      aiCommentImpact: aiResponse.impact,
      aiCommentReason: aiResponse.reason,
      aiCommentSuggestion: aiResponse.suggestion,
    })
    .where(eq(scanTbl.id, scanId));
};

// 指定されたフィールドの合計値を計算する共通関数
const calculateTotal = (
  results: (typeof resultTbl.$inferSelect)[],
  field: keyof typeof resultTbl.$inferSelect,
): number => {
  return results.reduce(
    (total, current) => total + ((current[field] as number) || 0),
    0,
  );
};
