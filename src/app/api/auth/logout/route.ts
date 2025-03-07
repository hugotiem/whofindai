import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'Signed out' }, { status: 200 });
  } catch (error) {
    console.error(
      'Logout error:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
