import { copyFile } from "node:fs/promises";
import path from "node:path";
import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode
  ssr: false,

  // Workaround for Vite's SPA mode with GitHub Pages
  // ref: https://zenn.dev/ofk/articles/562098fdab1888
  async buildEnd(args): Promise<void> {
    if (!args.viteConfig.isProduction) return;
    const buildPath = args.viteConfig.build.outDir;
    await copyFile(
      path.join(buildPath, "index.html"),
      path.join(buildPath, "404.html"),
    );
  },
} satisfies Config;
