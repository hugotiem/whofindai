import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const client = await createClient();
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await prisma.profile.delete({
    where: { id: id }
  });

  if (!deleted) {
    return NextResponse.json({ message: 'History not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'History deleted' });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const linkedinUrl = searchParams.get('linkedinUrl');

    console.log('linkedinUrl', linkedinUrl);

    if (!linkedinUrl) {
      return NextResponse.json(
        { message: 'Linkedin URL is required' },
        { status: 400 }
      );
    }

    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await createClient();
    const {
      data: { user }
    } = await client.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const history = await prisma.profile.findFirst({
      where: {
        linkedinUrl: linkedinUrl,
        user: { id: user.id }
      }
    });

    console.log('history', history);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching history', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
