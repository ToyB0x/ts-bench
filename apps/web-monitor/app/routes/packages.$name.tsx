import * as process from "node:process";
import { prisma } from "@repo/db";
import type { Route } from "./+types/packages.$name";

// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // NOTE: workaround for Prisma RLS issues in development and CI environments
  // https://github.com/prisma/prisma/issues/27085
  // https://github.com/prisma/prisma/issues/27212
  // biome-ignore lint/complexity/useLiteralKeys: workaround for Prisma RLS issues
  if (!process.env?.["DATABASE_URL"]) return [];

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
