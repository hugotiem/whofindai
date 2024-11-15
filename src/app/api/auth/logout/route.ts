import { adminAuth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const createLogoutResponse = () => {
    const response = NextResponse.redirect(`${process.env.BASE_URL}/`);
    response.cookies.delete('__session');
    return response;
  };

  try {
    const session = request.cookies.get('__session')?.value;
    if (!session) throw Error('No current session');
    const { uid } = await adminAuth.verifySessionCookie(session);
    await adminAuth.revokeRefreshTokens(uid);
    return createLogoutResponse();
  } catch (error) {
    console.error(
      'Logout error:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return createLogoutResponse();
  }
}
