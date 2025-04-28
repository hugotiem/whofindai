import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const client = await createClient();
  const user = await client.auth.getUser();

  if (user.data.user) {
    // const { email } = await adminAuth.verifySessionCookie(user.data.user.id);
    if (user.data.user.email && ['edouard@tiemh.com', 'hugotiem@gmail.com'].includes(user.data.user.email)) {
      const response = NextResponse.redirect(new URL('/prompt', request.url));
      response.cookies.set('has_access', 'true');
      return response;
    }
  }
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('has_access', 'false');
  return response;
}
  