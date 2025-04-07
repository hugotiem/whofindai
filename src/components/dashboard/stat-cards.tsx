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

const formatTimeSaved = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ') || '0s';
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
      billingHistory: { take: 2, orderBy: { endAt: 'asc' } }
    }
  });

  const currentBilling = userData?.billingHistory[0];

  const usedCredits = currentBilling?.usedCredits || 0;
  const lastWeekUsedCredit = userData?.billingHistory[1]?.usedCredits || 1;

  // Calculate time saved for current and previous week
  const currentTimeSaved = (usedCredits || 0) * 15.8 * 60;
  const lastWeekTimeSaved =
    (userData?.billingHistory[1]?.usedCredits || 0) * 15.8 * 60;

  const timeSavedPercentageDifference =
    ((currentTimeSaved - lastWeekTimeSaved) /
      (lastWeekTimeSaved === 0 ? 1 : lastWeekTimeSaved)) *
    100;

  const percentageDifference = (usedCredits / lastWeekUsedCredit) * 100;

  const differenceWithPro = (currentBilling?.usedCredits || 0) * 0.5 - 2.5;

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
        value={formatTimeSaved(currentTimeSaved)}
        change={`${timeSavedPercentageDifference >= 0 ? '+' : ''}${timeSavedPercentageDifference.toFixed(1)}% from last week`}
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};
