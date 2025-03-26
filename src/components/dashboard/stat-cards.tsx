import { Card, CardContent } from '@/components/ui/card';
import { Users, CreditCard, DollarSign } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => {
  const isPositive = change.startsWith('+');
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-medium text-muted-foreground overflow-ellipsis w-full line-clamp-1">
            {title}
          </p>
          {icon}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{value}</p>
          <p
            className={`text-xs ${isPositive ? 'text-[#7FFFD4]' : 'text-red-500'}`}
          >
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatCards = async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userData = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      plan: true,
      billingHistory: { take: 2, orderBy: { endAt: 'desc' } }
    }
  });

  const currentBilling = userData?.billingHistory[0];

  const usedCredits = currentBilling?.usedCredits || 0;
  const lastWeekUsedCredit = userData?.billingHistory[1]?.usedCredits || 1;

  // i want to get the first day of last two months

  const percentageDifference = (usedCredits / lastWeekUsedCredit) * 100;

  const differenceWithPro = (currentBilling?.usedCredits || 0) * 0.5 - 2.5;

  // do it for the last month

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <StatCard
        title="Total credits used"
        value={usedCredits.toString()}
        change={`${percentageDifference >= 0 ? '+' : ''}${percentageDifference}% from last week`}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Next billing"
        value={`$${(currentBilling?.amount || 0) / 100}`}
        change={`+$${differenceWithPro > 0 ? differenceWithPro : 0} saved with pro plan`}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="estimated saved time"
        value={`${(usedCredits || 0) * 15.8}s`}
        change="+19% from last month"
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};
