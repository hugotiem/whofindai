import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limitParam = searchParams.get('limit');

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = limitParam ? parseInt(limitParam) : undefined;

    const profiles = await prisma.profile.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: 1,
      take: limit ? limit + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined
    });

    return NextResponse.json({
      profiles,
      hasMore: profiles.length === limit,
      nextCursor:
        profiles.length === limit ? profiles[profiles.length - 1].id : undefined
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
