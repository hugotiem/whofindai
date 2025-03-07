import { History } from './history';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
export const HistorySidebarItem = async () => {
  const client = await createClient();
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user)
    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 p-4 text-center">
        If you are logged in, you can see your history here.
      </div>
    );

  const history = await prisma.profile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      company: true
    }
  });

  return (
    <History
      initialHistory={history.map((profile) => ({
        id: profile.id,
        fullName: profile.fullName || '',
        company: profile.company || ''
      }))}
    />
  );
};
