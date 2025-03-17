
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from './lib/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const hasAccess = request.cookies.get('has_access')?.value;

  if (session?.access_token && hasAccess === 'true') {
    const response = NextResponse.next();
    response.cookies.delete('has_access');
    return response;
  }
  if (session?.access_token && hasAccess === 'false') {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('has_access');
    return response;
  }
  return NextResponse.redirect(
    new URL('/api/auth/session/access', request.url)
  );
}

export const config = {
  matcher: ['/prompt/:path*']
};
