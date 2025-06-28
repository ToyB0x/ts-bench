import { db, resultTbl } from "@ts-bench/db";
import { Link } from "react-router";
import { ChartAreaInteractive } from "~/components/parts/chart-area";
import { ChartAreaInteractiveExample } from "~/components/parts/chart-area-example";
import type { Route } from "./+types/graph";

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const packages = await db
    .selectDistinct({ package: resultTbl.package })
    .from(resultTbl)
    .orderBy(resultTbl.package);

  const scansWithResults = await db.query.scanTbl.findMany({
    orderBy: (scan, { asc }) => asc(scan.commitDate),
    with: {
      results: true,
    },
  });

  return {
    packages,
    scansWithResults,
  };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { packages, scansWithResults } = loaderData;

  return (
    <>
      <div className="mt-4 p-6 grid grid-cols-2 gap-5">
        {/* 全パッケージの指標の合計を表示 */}
        <ChartAreaInteractive
          data={scansWithResults.map((scan) => {
            // calculate the total values with each metrics for all packages
            return scan.results.reduce(
              (acc, result) => {
                // Sum up the metrics for all packages
                acc.totalTime += result.totalTime || 0;
                acc.traceNumType += result.traceNumType || 0;
                return acc;
              },
              {
                ...scan,
                package: "⭐️ ALL Packages",
                totalTime: 0,
                traceNumType: 0,
              },
            );
          })}
        />

        {packages.map(({ package: pkg }) => (
          <ChartAreaInteractive
            key={pkg}
            data={scansWithResults.flatMap((scan) => {
              const filteredResults = scan.results.filter(
                (result) => result.package === pkg,
              );

              return filteredResults.map((result) => ({
                ...result,
                ...scan,
              }));
            })}
          />
        ))}

        <ChartAreaInteractiveExample />
      </div>

      <div className="mt-8 p-6">
        <h2 className="text-2xl font-bold">Packages Detail Insight</h2>
        <ul className="list-disc mt-4 pl-6">
          {packages.map(({ package: pkg }) => (
            <li key={pkg}>
              <Link to={`./${pkg}`}>{pkg}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
