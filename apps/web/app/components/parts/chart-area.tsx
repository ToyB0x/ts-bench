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

type ResultData = {
  id: number;
  package: string;
  isSuccess: boolean;
  numTrace: number;
  numType: number;
  numHotSpot: number;
  durationMs: number;
  durationMsHotSpot: number;
  error: string | null;
  scanId: number;
};

type ChartAreaInteractiveProps = {
  data: ResultData[];
};

export const description = "Package analysis metrics over time";

const chartConfig = {
  durationMs: {
    label: "ms",
    color: "var(--chart-1)",
  },
  numType: {
    label: "Types",
    color: "var(--chart-2)",
  },
  // numHotSpot: {
  //   label: "Hot Spots",
  //   color: "var(--chart-3)",
  // },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const packageName = data[0]?.package || "Unknown Package";

  const chartData = React.useMemo(() => {
    return data.map((result) => ({
      scanId: result.scanId,
      numTrace: result.numTrace,
      numType: result.numType,
      numHotSpot: result.numHotSpot,
      durationMs: Math.round(result.durationMs),
      isSuccess: result.isSuccess,
    }));
  }, [data]);

  const [metricType, setMetricType] = React.useState<
    "all" | "types" | "durationMs"
  >("all");

  const filteredData = React.useMemo(() => {
    if (metricType === "durationMs") {
      return chartData.map((item) => ({ ...item, numType: 0 }));
    }
    if (metricType === "types") {
      return chartData.map((item) => ({ ...item, durationMs: 0 }));
    }
    // if (metricType === "hotspots") {
    //   return chartData.map((item) => ({ ...item, durationMs: 0, numType: 0 }));
    // }
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
            <SelectItem value="durationMs" className="rounded-lg">
              Ms only
            </SelectItem>
            <SelectItem value="types" className="rounded-lg">
              Types only
            </SelectItem>
            {/*<SelectItem value="hotspots" className="rounded-lg">*/}
            {/*  Hot spots only*/}
            {/*</SelectItem>*/}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {/* biome-ignore lint/nursery/useUniqueElementIds: chart gradients */}
              <linearGradient id="fillDurationMs" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-durationMs)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-durationMs)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/* biome-ignore lint/nursery/useUniqueElementIds: chart gradients */}
              <linearGradient id="fillNumType" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-numType)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-numType)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/*<linearGradient id="fillNumHotSpot" x1="0" y1="0" x2="0" y2="1">*/}
              {/*  <stop*/}
              {/*    offset="5%"*/}
              {/*    stopColor="var(--color-numHotSpot)"*/}
              {/*    stopOpacity={0.8}*/}
              {/*  />*/}
              {/*  <stop*/}
              {/*    offset="95%"*/}
              {/*    stopColor="var(--color-numHotSpot)"*/}
              {/*    stopOpacity={0.1}*/}
              {/*  />*/}
              {/*</linearGradient>*/}
            </defs>
            {/*<CartesianGrid vertical={false} />*/}
            <XAxis
              dataKey="scanId"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => `Scan ${value}`}
            />
            <ChartTooltip
              cursor={false}
              isAnimationActive={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Scan ID: ${value}`}
                  isAnimationActive={false}
                  indicator="dot"
                />
              }
            />
            {/*{metricType === "all" || metricType === "hotspots" ? (*/}
            {/*  <Area*/}
            {/*    dataKey="numHotSpot"*/}
            {/*    type="natural"*/}
            {/*    fill="url(#fillNumHotSpot)"*/}
            {/*    stroke="var(--color-numHotSpot)"*/}
            {/*    stackId="a"*/}
            {/*  />*/}
            {/*) : null}*/}
            {metricType === "all" || metricType === "types" ? (
              <Area
                isAnimationActive={false}
                dataKey="numType"
                type="natural"
                fill="url(#fillNumType)"
                stroke="var(--color-numType)"
                stackId="a"
              />
            ) : null}
            {metricType === "all" || metricType === "durationMs" ? (
              <Area
                isAnimationActive={false}
                dataKey="durationMs"
                type="natural"
                fill="url(#fillDurationMs)"
                stroke="var(--color-durationMs)"
                stackId="a"
              />
            ) : null}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
