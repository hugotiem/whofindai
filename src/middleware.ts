import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const hasAccess = request.cookies.get('has_access')?.value;

  if (session && hasAccess === 'true') {
    const response = NextResponse.next();
    response.cookies.delete('has_access');
    return response;
  }
  if (session && hasAccess === 'false') {
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
