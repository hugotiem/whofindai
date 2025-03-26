import { Suspense } from 'react';
import { AppBarChart } from '@/components/custom/bar-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import {
  subMonths,
  eachMonthOfInterval,
  startOfMonth,
  isSameMonth,
  endOfMonth
} from 'date-fns';

const ChartSkeleton = () => {
  return <Skeleton className="h-[472px] w-full" />;
};

async function ChartContent() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const now = new Date();
  const fiveMonthsAgo = startOfMonth(subMonths(now, 5));

  const count = await prisma.profile.groupBy({
    by: ['createdAt'],
    where: {
      userId: user.id,
      createdAt: {
        gte: fiveMonthsAgo,
        lte: endOfMonth(now)
      }
    },
    _count: true,
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Get all months in the interval
  const allMonths = eachMonthOfInterval({
    start: fiveMonthsAgo,
    end: now
  });

  // Transform the data to group by month and include zeros
  const monthlyCount = allMonths.map((month) => {
    const monthData = count
      .filter((item) => isSameMonth(new Date(item.createdAt), month))
      .reduce((sum, curr) => sum + curr._count, 0);

    return {
      month: startOfMonth(month),
      count: monthData
    };
  });

  // No need to reverse since we want oldest to newest
  return <AppBarChart stats={monthlyCount} />;
}

export const DashboardChart = () => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartContent />
    </Suspense>
  );
};
