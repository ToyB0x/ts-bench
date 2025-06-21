/** biome-ignore-all lint/a11y/noSvgWithoutTitle: temp */
export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 flex-1 flex flex-col">
      <header className="mb-20">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full" />
          </div>
          <span className="text-sm font-medium text-gray-400">TSBench</span>
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          TypeScript Performance
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
          Performance monitoring and analysis tools for modern development.
        </p>
      </header>

      <main className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-16">
          <a
            href="/home"
            className="group relative p-8 border border-gray-800 hover:border-gray-700 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
              Repo Performance
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Analyze repository performance metrics and insights on a monthly
              basis.
            </p>
          </a>

          <a
            href="https://app.devin.ai/wiki/3-shake/securify-portal"
            className="group relative p-8 border border-gray-800 hover:border-gray-700 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
              AI Integrations
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI analysis and MCP integration for next-gen performance tuning.
            </p>
          </a>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-500">
            New version of TSBench has been released. Please check the latest
            updates and features in the{" "}
            <a
              href="https://github.com/ToyB0x/ts-bench"
              className="text-gray-400 font-bolder"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </main>

      <footer className="mt-auto pt-8 border-t border-gray-900">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Last scan: 2025-6-22</p>
          <p className="text-xs text-gray-500">Version 0.0.12</p>
        </div>
      </footer>
    </div>
  );
}
