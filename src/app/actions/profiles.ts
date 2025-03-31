import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function getLastGeneratedProfiles(
  // cursor: string = '',
  limit: number = 10
) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const profiles = await prisma.profile.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: limit,
    // cursor: cursor ? { id: cursor } : undefined
  });

  return {
    profiles,
    hasMore: profiles.length === limit,
    nextCursor:
      profiles.length === limit ? profiles[profiles.length - 1].id : undefined
  };
}
