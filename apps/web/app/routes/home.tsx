import { db, resultTbl } from "@ts-bench/db";
import { ChartAreaInteractiveExample } from "~/components/parts/chart-area-example";
import type { Route } from "./+types/home";

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  return await db.selectDistinct().from(resultTbl).orderBy(resultTbl.package);
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <ChartAreaInteractiveExample />
      <ul className="list-disc mt-4 pl-6">
        {loaderData.map(({ package: pkg }) => (
          <li key={pkg}>
            <a href={`/packages/${pkg}`}>{pkg}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
