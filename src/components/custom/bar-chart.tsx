'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useState } from 'react';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { Tabs } from '../ui/tabs';
import { cn } from '@/lib/utils';

type MonthlyCount = {
  month: Date;
  count: number;
};

const chartConfig = {
  desktop: {
    label: 'Profiles Generated',
    color: 'var(--app-green)'
  }
} satisfies ChartConfig;

export function AppBarChart({
  className,
  stats
}: {
  className?: string;
  stats: MonthlyCount[];
}) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const chartData = stats.map((item) => ({
    month: format(new Date(item.month), 'MMMM'),
    desktop: Number(item.count)
  }));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </div>
          <Tabs
            defaultValue="bar"
            onValueChange={(value) => setChartType(value as 'bar' | 'line')}
          >
            <TabsList>
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === 'bar' ? (
          <ChartBar data={chartData} />
        ) : (
          <ChartLine data={chartData} />
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {stats.length > 1 && (
            <>
              Trending{' '}
              {stats[stats.length - 1].count > stats[stats.length - 2].count
                ? 'up'
                : 'down'}{' '}
              by{' '}
              {Math.abs(
                ((stats[stats.length - 1].count -
                  stats[stats.length - 2].count) /
                  stats[stats.length - 2].count) *
                  100
              ).toFixed(1)}
              % this month <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total profiles generated for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

const ChartBar = ({ data }: { data: { month: string; desktop: number }[] }) => {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={8}
          maxBarSize={60}
        />
      </BarChart>
    </ChartContainer>
  );
};

const ChartLine = ({
  data
}: {
  data: { month: string; desktop: number }[];
}) => {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
};
