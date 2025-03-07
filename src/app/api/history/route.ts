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
