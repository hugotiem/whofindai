import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import { LastGeneratedProfiles } from '@/components/dashboard/last-generated-profiles';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader
} from '@/components/ui/card';
import { StatCards } from '@/components/dashboard/stat-cards';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
export const Dashboard = async () => {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signIn');
  }

  const data = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      plan: true,
      nextBillingDate: true,
      subscriptionStartedAt: true
    }
  });

  return (
    <section className="container mx-auto flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 col-span-3 bg-background rounded-lg">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  Current Plan
                  <span className="text-sm ml-2 text-[#7FFFD4] bg-[#7FFFD4]/10 px-2 py-1 rounded-md">
                    {data?.plan}
                  </span>
                </span>
                {/* <Button variant="secondary">Manage</Button> */}
                {/* add external link icon */}
                <a
                  href="/api/stripe/checkout"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  rel="noopener noreferrer"
                >
                  Manage
                </a>
              </CardTitle>
              <div className="py-[1px]">
                <Separator />
              </div>
              <CardDescription>
                Subscription started on{' '}
                {data?.subscriptionStartedAt?.toDateString() ||
                  '- - / - - / - -'}
                <br />
                Next billing on{' '}
                {data?.nextBillingDate?.toDateString() || '- - / - - / - -'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="col-span-3">
          <StatCards />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-background rounded-lg">
          <DashboardChart />
        </div>
        <div className="bg-background rounded-lg h-[472px]">
          <LastGeneratedProfiles />
        </div>
      </div>
    </section>
  );
};
