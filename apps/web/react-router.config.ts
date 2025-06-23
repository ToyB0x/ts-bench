import type { Config } from "@react-router/dev/config";
import { db, resultTbl } from "@ts-bench/db";

export default {
  // Deployed to a static file server
  ssr: false,
  // all static paths and dynamic segments like "/post/:slug"
  async prerender({ getStaticPaths }) {
    const pkgs = await db
      .selectDistinct()
      .from(resultTbl)
      .orderBy(resultTbl.package);

    const packagePaths = pkgs.map((pkg) => `/graph/${pkg.package}`); // packageName may have scope slash
    return [...getStaticPaths(), ...packagePaths];
  },
} satisfies Config;
