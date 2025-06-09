import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userData = await prisma.user.findUnique({
    where: { id: data.user.id }
  });

  return NextResponse.json({ user: userData });
}
