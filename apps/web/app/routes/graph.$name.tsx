import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ChartAreaInteractiveDetailPage } from "~/components/parts/chart-area-detail-page";
import { fetchPackageResults } from "~/utils/db-browser";
import type { Route } from "./+types/graph.$name";

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Page() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof fetchPackageResults>
  > | null>(null);

  useEffect(() => {
    async function fetchData() {
      const packageFullName = params["scope"]
        ? `${params["scope"]}/${params["name"]}`
        : params["name"];

      if (!packageFullName) return;

      try {
        const result = await fetchPackageResults(packageFullName);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch package results:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params["scope"], params["name"]]);

  if (loading || !data) {
    return <div className="p-6">Loading...</div>;
  }

  const { results, packageFullName, resultTblKeysForGraph } = data;

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
              // biome-ignore lint/suspicious/noExplicitAny: Type compatibility with chart component
              data={results as any}
              columnKey={key}
            />
          );
        })}
      </div>
    </>
  );
}
