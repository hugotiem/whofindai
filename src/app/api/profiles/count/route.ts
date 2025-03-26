import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { subMonths } from 'date-fns';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sixMonthsAgo = subMonths(new Date(), 6);

  const count = await prisma.profile.groupBy({
    by: ['createdAt'],
    where: {
      userId: user.id,
      createdAt: {
        gte: sixMonthsAgo
      }
    },
    _count: true,
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Transform the data to group by month
  const monthlyCount = count.reduce(
    (acc, curr) => {
      const month = new Date(curr.createdAt);
      month.setDate(1); // Set to first day of month
      month.setHours(0, 0, 0, 0); // Reset time

      const existingMonth = acc.find(
        (item) => item.month.getTime() === month.getTime()
      );

      if (existingMonth) {
        existingMonth.count += curr._count;
      } else {
        acc.push({
          month,
          count: curr._count
        });
      }

      return acc;
    },
    [] as Array<{ month: Date; count: number }>
  );

  return NextResponse.json({ count: monthlyCount });
}
