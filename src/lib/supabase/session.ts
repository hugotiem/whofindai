import { cookies } from 'next/headers';
import { adminAuth } from './admin';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';

export const loadSession = async () => {
  'use server';
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        }
      }
    }
  );

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (!session) return;

    return session;
  } catch (e) {
    console.error(e);
  }
};

export const loadUserId = async () => {
  'use server';
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        }
      }
    }
  );

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (!session) return;

    return session.user.id;
  } catch (e) {
    console.error(e);
    redirect('/api/auth/logout');
  }
};
