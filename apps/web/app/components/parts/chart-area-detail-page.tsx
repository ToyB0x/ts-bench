import type { resultTbl, scanTbl } from "@ts-bench/db";
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

type Props = {
  columnKey: string; // resultTbl column key
  data: Array<typeof resultTbl.$inferSelect & typeof scanTbl.$inferSelect>;
};

export function ChartAreaInteractiveDetailPage({ data, columnKey }: Props) {
  const chartConfig = {
    [columnKey]: {
      label: columnKey,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (!data.length) {
    return (
      <Card className="pt-0">
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">
            No data available for this key: {columnKey}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0 bg-black rounded-xs border-gray-800">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row border-none">
        <div className="grid flex-1 gap-1 text-gray-400">
          <CardTitle>{columnKey} - Metrics</CardTitle>
          <CardDescription>
            Showing analysis results across {data.length} scan
            {data.length !== 1 ? "s" : ""}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={data}
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
              <linearGradient
                id={`fill-${columnKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${columnKey})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${columnKey})`}
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
            <Area
              isAnimationActive={false}
              dataKey={columnKey}
              type="natural"
              fill={`url(#fill-${columnKey})`}
              stroke={`var(--color-${columnKey})`}
              stackId={"traceNumType"} // no need? or "a"
              yAxisId={"traceNumType"} // no need?
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
