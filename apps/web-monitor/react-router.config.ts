import type { Config } from "@react-router/dev/config";
import { prisma } from "@repo/db";

export default {
  // Deployed to a static file server
  ssr: false,
  // all static paths and dynamic segments like "/post/:slug"
  async prerender({ getStaticPaths }) {
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
