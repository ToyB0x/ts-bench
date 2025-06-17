import { prisma } from "@ts-bench/db";
import type { Route } from "./+types/packages.$name";

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return prisma.result.findMany({
    where: {
      package: `${params.scope}/${params.name}`,
    },
    select: {
      package: true,
      scan: {
        select: {
          commitHash: true,
          commitMessage: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      scan: {
        createdAt: "desc",
      },
    },
    take: 100,
  });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const results = loaderData;
  console.log(results);
  const name = results[0]?.package || "Unknown Package";

  return (
    <div>
      <h1>{name}</h1>
      <pre>{JSON.stringify(results)}</pre>
    </div>
  );
}
