import { adminAuth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  if (session) {
    const { email } = await adminAuth.verifySessionCookie(session);
    if (email && ['edouard@tiemh.com', 'hugotiem@gmail.com'].includes(email)) {
      const response = NextResponse.redirect(new URL('/prompt', request.url));
      response.cookies.set('has_access', 'true');
      return response;
    }
  }
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('has_access', 'false');
  return response;
}
