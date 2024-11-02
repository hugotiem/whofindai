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
        console.error(e);
        const _cookies = await cookies();
        _cookies.delete('__session');
      }
    }
    const token = request.nextUrl.searchParams.get('idToken');
    const redirect_path = request.nextUrl.searchParams.get('redirect_path');

    if (!token) {
      return NextResponse.redirect(
        `${process.env.BASE_URL}/auth/signIn${redirect_path && `?redirect_path=${redirect_path}`}`
      );
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    await adminAuth.verifyIdToken(decrypt(token));
    const session = await adminAuth.createSessionCookie(decrypt(token), {
      expiresIn
    });

    const redirect_path_url =
      redirect_path && redirect_path !== null ? `/${redirect_path}` : '/';

    const response = NextResponse.redirect(
      `${process.env.BASE_URL}${redirect_path_url}`
    );

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
