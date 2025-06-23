import { db } from "@ts-bench/db";
import type { Route } from "./+types/graph.$name";

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return db.query.resultTbl.findMany({
    where: (table, { eq }) =>
      eq(table.package, `${params.scope}/${params.name}`),
    with: {
      scan: {
        columns: {
          commitHash: true,
          commitMessage: true,
          scannedAt: true,
        },
      },
    },
    orderBy: (table, { asc }) => asc(table.scanId),
    limit: 100,
  });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const results = loaderData;
  const name = results[0]?.package || "Unknown Package";

  return (
    <div>
      <h1 className="bg-blue-400">{name}</h1>
      <pre>{JSON.stringify(results)}</pre>
    </div>
  );
}
