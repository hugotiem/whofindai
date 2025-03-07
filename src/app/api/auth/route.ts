import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const { error } = await supabase.auth.signOut();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await supabase.auth.admin.deleteUser(user.id);
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : `Unknown error ${error}` },
      { status: 500 }
    );
  }
}
