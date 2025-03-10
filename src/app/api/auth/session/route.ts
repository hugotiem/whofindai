import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const refreshToken = request.headers.get('x-refresh-token');

  if (!token || !refreshToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await createClient();
  const currentUser = await client.auth.getUser();
  const user = await client.auth.getUser(token);

  if (currentUser.data.user?.id === user.data.user?.id) {
    return NextResponse.json({ message: 'Already logged in' }, { status: 202 });
  }

  if (!user.data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // generate unique code
  const code = Math.random().toString(36).substring(2, 15);

  await prisma.session.upsert({
    where: { accessToken: token },
    update: { code, accessToken: token, refreshToken },
    create: { code, accessToken: token, refreshToken: refreshToken }
  });

  return NextResponse.json({ code });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const redirectUri = request.nextUrl.searchParams.get('redirect_path');

  if (!code) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbSession = await prisma.session.delete({
    where: { code },
    select: { accessToken: true, refreshToken: true }
  });

  if (!dbSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const session = await supabase.auth.setSession({
    access_token: dbSession.accessToken,
    refresh_token: dbSession.refreshToken
  });

  if (!session.data.session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.redirect(
    `${process.env.BASE_URL}${redirectUri}`
  );

  return response;
}
