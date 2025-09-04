"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/Components/ui/toggle-group"

export const description = "An interactive area chart for DeFi pool APY trends"

interface PoolData {
  pool: string;
  project: string;
  category: string;
  symbol: string;
  tvlUsd: string;
  apy: string;
  apyMean30d: string;
  sigma: string;
  chain: string;
}

interface ChartAreaInteractiveProps {
  pools: PoolData[];
  selectedCategory: 'lending' | 'liquid' | 'yield';
}

const generateAPYTrendData = (pools: PoolData[] = []) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.slice(Math.max(0, currentMonth - 11), currentMonth + 1).map((month) => {
    const baseAPY = pools.length > 0 ? parseFloat(pools[0]?.apy || '0') : 15;
    const variation = (Math.random() - 0.5) * 10; // ±5% variation
    const currentAPY = Math.max(0, baseAPY + variation);
    
    return {
      date: month,
      apy: Math.round(currentAPY * 100) / 100,
      tvl: pools.length > 0 ? parseFloat(pools[0]?.tvlUsd || '0') / 1000000 : 100, // Convert to millions
    };
  });
};

const chartConfig = {
  apy: {
    label: "APY %",
    color: "hsl(var(--chart-1))",
  },
  tvl: {
    label: "TVL (M)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ pools = [], selectedCategory = "lending" }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const chartData = React.useMemo(() => generateAPYTrendData(pools), [pools])

  const filteredData = React.useMemo(() => {
    let dataToShow = chartData
    if (timeRange === "30d") {
      dataToShow = chartData.slice(-6) // Last 6 months
    } else if (timeRange === "7d") {
      dataToShow = chartData.slice(-3) // Last 3 months
    }
    return dataToShow
  }, [chartData, timeRange])

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'lending':
        return 'Lending Pools';
      case 'liquid':
        return 'Liquid Staking';
      case 'yield':
        return 'Yield Aggregators';
      default:
        return 'DeFi Pools';
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>APY Performance Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {getCategoryTitle()} performance over time
          </span>
          <span className="@[540px]/card:hidden">Performance trends</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 12 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 6 months</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 3 months</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 12 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 12 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 3 months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAPY" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-apy)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-apy)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value) => [
                    `${value}%`,
                    'APY'
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="apy"
              type="natural"
              fill="url(#fillAPY)"
              stroke="var(--color-apy)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
