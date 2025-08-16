import { db, eq, getTableColumns, resultTbl, scanTbl } from "@ts-bench/db";
import { ChartAreaInteractiveDetailPage } from "~/components/parts/chart-area-detail-page";
import type { Route } from "./+types/graph.$name";

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const packageFullName = params.scope
    ? `${params.scope}/${params.name}`
    : params.name;

  const packageResults = await db
    .select()
    .from(resultTbl)
    .where(eq(resultTbl.package, packageFullName))
    .innerJoin(scanTbl, eq(resultTbl.scanId, scanTbl.id))
    .orderBy(scanTbl.commitDate)
    .limit(300);

  // this line can't be outside of the loader function (explicitly use it in node.js)
  const resultTblKeys = Object.keys(getTableColumns(resultTbl));
  const resultTblKeysForGraph = resultTblKeys.filter(
    (key) =>
      // Exclude keys that are not relevant for the graph
      !["id", "scanId", "package", "isSuccess", "isCached", "error"].includes(
        key,
      ),
  );

  return {
    packageFullName,
    resultTblKeysForGraph,
    results:
      // extract result
      packageResults.map((r) => ({
        ...r.result,
        ...r.scan, // result id is overwritten by scan id
      })),
  };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { results, packageFullName, resultTblKeysForGraph } = loaderData;

  return (
    <>
      <h1 className="p-6 pb-0 text-3xl font-bold text-gray-200">
        {packageFullName}
      </h1>
      <div className="p-6 grid grid-cols-2 gap-5">
        {resultTblKeysForGraph.map((key) => {
          // TODO: filter out keys that are not relevant for the graph (reduce data size)
          return (
            <ChartAreaInteractiveDetailPage
              key={key}
              data={results}
              columnKey={key}
            />
          );
        })}
      </div>
    </>
  );
}
