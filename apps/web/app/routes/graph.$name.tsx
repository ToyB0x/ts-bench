import { db, eq, resultTbl, scanTbl } from "@ts-bench/db";
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

  return {
    packageFullName,
    results: packageResults,
  };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { results, packageFullName } = loaderData;

  return (
    <div>
      <h1 className="bg-blue-400">{packageFullName}</h1>
      <pre>{JSON.stringify(results)}</pre>
    </div>
  );
}
