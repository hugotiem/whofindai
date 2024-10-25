import { adminAuth } from '@/lib/firebase/admin';
import { decrypt } from '@/lib/utils';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const jwt = request.cookies.get('__session')?.value;
  try {
    if (jwt) {
      try {
        await adminAuth.verifySessionCookie(jwt, true);
      } catch (e) {
        const _cookies = await cookies();
        _cookies.delete('__session');
      }
    }
    const token = request.nextUrl.searchParams.get('idToken');
    if (!token) {
      return NextResponse.redirect(`${process.env.BASE_URL}/auth/signIn`);
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    await adminAuth.verifyIdToken(decrypt(token));
    const session = await adminAuth.createSessionCookie(decrypt(token), {
      expiresIn
    });
    const response = NextResponse.redirect(`${process.env.BASE_URL}/`);
    response.headers.set(
      'Set-Cookie',
      `__session=${session}; Max-Age=${expiresIn}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );
    return response;
  } catch (e) {
    console.log('Unable to login');
    console.error(e);
    return NextResponse.redirect(process.env.BASE_URL!);
  }
}
