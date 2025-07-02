import { Link } from "react-router";

export function meta() {
  return [
    { title: "AI Integrations - TSBench" },
    {
      name: "description",
      content:
        "AI analysis and MCP integration for next-gen performance tuning.",
    },
  ];
}

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 flex-1 flex flex-col">
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
            <span className="text-sm font-medium">TSBench</span>
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-white">
            AI Integrations
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          AI Integrations
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
          AI analysis and MCP integration for next-gen performance tuning.
        </p>
      </header>

      <main className="flex-1">
        <div className="space-y-16">
          {/* MCP Setup Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: temp */}
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">
                MCP Setup & AI Improvement Tools
              </h2>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Model Context Protocol (MCP) enables seamless integration with
                AI tools for enhanced TypeScript performance analysis. Follow
                these steps to set up MCP and leverage AI-powered improvement
                suggestions.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    1. Install MCP Client
                  </h3>
                  <div className="bg-black rounded-lg p-4 font-mono text-sm">
                    <code className="text-green-400">
                      npm install -g @modelcontextprotocol/cli
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    2. Configure MCP for TSBench
                  </h3>
                  <div className="bg-black rounded-lg p-4 font-mono text-sm">
                    <code className="text-green-400">
                      mcp configure --server tsbench --endpoint
                      localhost:3000/api/mcp
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    3. Enable AI Analysis
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Add the following environment variable to enable AI-powered
                    analysis:
                  </p>
                  <div className="bg-black rounded-lg p-4 font-mono text-sm">
                    <code className="text-green-400">
                      export TSBENCH_AI_ENABLED=true
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    4. Run AI-Enhanced Analysis
                  </h3>
                  <div className="bg-black rounded-lg p-4 font-mono text-sm">
                    <code className="text-green-400">
                      tsbench analyze --ai-insights
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Diagnostic Report Analysis Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: temp */}
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Historical Data Analysis</h2>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Leverage historical diagnostic reports stored in the database to
                identify patterns, regression trends, and optimization
                opportunities across different time periods.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    Performance Trends
                  </h3>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Track TypeScript compilation times over months
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Monitor type instantiation growth patterns
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Identify performance regression points
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    AI-Powered Insights
                  </h3>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      Automated hotspot detection
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      Personalized optimization recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      Predictive performance modeling
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">
                  Example Analysis Query
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  Generate insights from historical data using SQL queries:
                </p>
                <div className="bg-black rounded-lg p-3 font-mono text-xs">
                  <code className="text-green-400">
                    {"SELECT package, AVG(totalTime) as avg_time,"}
                    <br />
                    {"       COUNT(*) as scan_count"}
                    <br />
                    {"FROM results r JOIN scans s ON r.scanId = s.id"}
                    <br />
                    {"WHERE s.commitDate >= date('now', '-3 months')"}
                    <br />
                    {"GROUP BY package ORDER BY avg_time DESC;"}
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Gemini API Configuration Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: temp */}
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">CI AI Comments with Gemini</h2>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Enable AI-powered code review comments in your CI/CD pipeline
                using Google's Gemini API. Get intelligent suggestions for
                TypeScript performance improvements directly in your pull
                requests.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    1. Get Gemini API Key
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Visit Google AI Studio to obtain your API key:
                  </p>
                  <div className="bg-black rounded-lg p-4 font-mono text-sm">
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://makersuite.google.com/app/apikey
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    2. Configure Environment Variables
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Add the following to your CI environment or{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                      .env
                    </code>{" "}
                    file:
                  </p>
                  <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-1">
                    <div>
                      <code className="text-green-400">
                        GEMINI_API_KEY=your_api_key_here
                      </code>
                    </div>
                    <div>
                      <code className="text-green-400">
                        GEMINI_MODEL=gemini-1.5-pro
                      </code>
                    </div>
                    <div>
                      <code className="text-green-400">
                        AI_COMMENTS_ENABLED=true
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    3. GitHub Actions Integration
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Add the following step to your GitHub Actions workflow:
                  </p>
                  <div className="bg-black rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <code className="text-green-400">
                      {"- name: TSBench AI Analysis"}
                      <br />
                      {"  uses: tsbench/ai-action@v1"}
                      <br />
                      {"  with:"}
                      <br />
                      {"    gemini-api-key: ${{ secrets.GEMINI_API_KEY }}"}
                      <br />
                      {"    enable-pr-comments: true"}
                      <br />
                      {"    analysis-depth: detailed"}
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    4. Configure Comment Settings
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Customize AI comment behavior in your{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                      tsbench.config.json
                    </code>
                    :
                  </p>
                  <div className="bg-black rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <code className="text-green-400">
                      {"{"}
                      <br />
                      {'  "ai": {'}
                      <br />
                      {'    "comments": {'}
                      <br />
                      {'      "enabled": true,'}
                      <br />
                      {'      "threshold": "medium",'}
                      <br />
                      {'      "includeOptimizations": true,'}
                      <br />
                      {'      "includeTrends": true'}
                      <br />
                      {"    }"}
                      <br />
                      {"  }"}
                      <br />
                      {"}"}
                    </code>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-semibold text-green-300 mb-2">
                  ✨ What You'll Get
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Automated performance regression detection in PRs</li>
                  <li>• Intelligent TypeScript optimization suggestions</li>
                  <li>• Historical trend analysis and comparisons</li>
                  <li>• Actionable improvement recommendations</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            AI integrations powered by MCP and Gemini
          </p>
          <Link
            to="/graph"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View Performance Data →
          </Link>
        </div>
      </footer>
    </div>
  );
}
