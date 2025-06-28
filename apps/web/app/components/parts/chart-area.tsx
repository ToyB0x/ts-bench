import type { resultTbl, scanTbl } from "@ts-bench/db";
import * as React from "react";
import { Area, AreaChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type ChartAreaInteractiveProps = {
  data: Array<
    typeof scanTbl.$inferSelect &
      Pick<
        typeof resultTbl.$inferSelect,
        "package" | "totalTime" | "traceNumType"
      >
  >;
};

export const description = "Package analysis metrics over time";

const chartConfig = {
  traceNumType: {
    label: "traceNumType",
    color: "var(--chart-1)",
  },
  totalTime: {
    label: "totalTime (sec)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const packageName = data[0]?.package || "Unknown Package";
  const chartData = React.useMemo(() => data, [data]);

  const [metricType, setMetricType] = React.useState<
    "all" | "traceNumType" | "totalTime"
  >("all");

  const filteredData = React.useMemo(() => {
    if (metricType === "totalTime") {
      return chartData.map((item) => ({ ...item, traceNumType: 0 }));
    }
    if (metricType === "traceNumType") {
      return chartData.map((item) => ({ ...item, totalTime: 0 }));
    }
    return chartData;
  }, [chartData, metricType]);

  if (!data.length) {
    return (
      <Card className="pt-0">
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">
            No data available for this package
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0 bg-black rounded-xs border-gray-800">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row border-none">
        <div className="grid flex-1 gap-1 text-gray-400">
          <CardTitle>{packageName} - Analysis Metrics</CardTitle>
          <CardDescription>
            Showing analysis results across {data.length} scan
            {data.length !== 1 ? "s" : ""}
          </CardDescription>
        </div>
        <Select
          value={metricType}
          onValueChange={(value: never) => setMetricType(value)}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex  border-gray-600 text-gray-300"
            aria-label="Select metric type"
          >
            <SelectValue placeholder="All metrics" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              All metrics
            </SelectItem>
            <SelectItem value="totalTime" className="rounded-lg">
              totalTime only
            </SelectItem>
            <SelectItem value="traceNumType" className="rounded-lg">
              Types only
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={filteredData}
            onClick={(payload) => {
              const owner = payload?.activePayload?.[0]?.payload.owner;
              const repo = payload?.activePayload?.[0]?.payload.repository;
              const commitHash =
                payload?.activePayload?.[0]?.payload.commitHash;

              if (!owner || !repo || !commitHash) return;

              const githubUrl = `https://github.com/${owner}/${repo}/commit/${commitHash}`;
              window.open(githubUrl, "_blank");
            }}
          >
            <defs>
              {/* biome-ignore lint/nursery/useUniqueElementIds: chart gradients */}
              <linearGradient id="fillTotalTime" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalTime)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalTime)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/* biome-ignore lint/nursery/useUniqueElementIds: chart gradients */}
              <linearGradient id="fillTraceNumType" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-traceNumType)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-traceNumType)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="commitDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={
                (value) => new Date(value).toLocaleDateString().slice(5) // remove year
              }
            />
            <ChartTooltip
              cursor={false}
              isAnimationActive={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    const item = payload?.[0];
                    if (!item) return value;
                    return (
                      <div className="flex flex-col gap-4 w-96 text-xs text-gray-500">
                        <div>
                          PR:
                          <br />
                          {item.payload.commitMessage}
                        </div>
                        {item.payload.aiCommentImpact && (
                          <div className="flex flex-col">
                            <div>
                              Reason:
                              <br />
                              {item.payload.aiCommentReason}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between text-gray-400 font-light mb-2">
                          <div>
                            CPUs:
                            <br />
                            {item.payload.cpus} v{item.payload.version}
                          </div>
                          <div>{item.payload.isCached && "cached"}</div>
                        </div>
                      </div>
                    );
                  }}
                  isAnimationActive={false}
                  indicator="dot"
                />
              }
            />
            {metricType === "all" || metricType === "traceNumType" ? (
              <Area
                isAnimationActive={false}
                dataKey="traceNumType"
                type="natural"
                fill="url(#fillTraceNumType)"
                stroke="var(--color-traceNumType)"
                stackId="a"
                yAxisId="traceNumType" // enable multiple y-axes
              />
            ) : null}
            {metricType === "all" || metricType === "totalTime" ? (
              <Area
                isAnimationActive={false}
                dataKey="totalTime"
                type="natural"
                fill="url(#fillTotalTime)"
                stroke="var(--color-totalTime)"
                stackId="a"
                yAxisId="totalTime" // enable multiple y-axes
              />
            ) : null}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
