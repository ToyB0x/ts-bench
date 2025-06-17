import process from "node:process";
import type { Config } from "@react-router/dev/config";
import { prisma } from "@repo/db";

export default {
  // Deployed to a static file server
  ssr: false,
  // all static paths and dynamic segments like "/post/:slug"
  async prerender({ getStaticPaths }) {
    // NOTE: workaround for Prisma RLS issues in development and CI environments
    // https://github.com/prisma/prisma/issues/27085
    // https://github.com/prisma/prisma/issues/27212
    // biome-ignore lint/complexity/useLiteralKeys: workaround for Prisma RLS issues
    if (!process.env?.["DATABASE_URL"]) return [];

    const packages = await prisma.result.findMany({
      distinct: ["package"],
      orderBy: {
        package: "asc",
      },
      select: {
        package: true,
      },
    });
    const packagePaths = packages.map((pkg) => `/packages/${pkg.package}`);
    return [...getStaticPaths(), ...packagePaths];
  },
} satisfies Config;
