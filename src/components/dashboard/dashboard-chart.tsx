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
import { redirect } from 'next/navigation';
const ChartSkeleton = () => {
  return <Skeleton className="h-[472px] w-full" />;
};

async function ChartContent() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/signIn');
  }

  const now = new Date();
  const fiveMonthsAgo = startOfMonth(subMonths(now, 5));

  const count = await prisma.profile.groupBy({
    by: ['updatedAt'],
    where: {
      userId: user.id,
      updatedAt: {
        gte: fiveMonthsAgo,
        lte: endOfMonth(now)
      }
    },
    _count: true,
    orderBy: {
      updatedAt: 'asc'
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
      .filter((item) => isSameMonth(new Date(item.updatedAt), month))
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
