import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const _cookies = await cookies();
  try {
    const session = request.cookies.get('__session')?.value;
    if (!session) throw Error('No current session');
    const token = await adminAuth.verifySessionCookie(session);
    await adminAuth.revokeRefreshTokens(token.uid);
    _cookies.delete('__session');
    return NextResponse.redirect(`${process.env.BASE_URL}/auth/signIn`);
  } catch (e) {
    console.error(e);
    _cookies.delete('__session');
   return  NextResponse.redirect(process.env.BASE_URL!);
  }
}
