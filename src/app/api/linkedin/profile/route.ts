import { adminAuth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { searchLinkedInProfile } from '../actions';
// import { JSDOM } from 'jsdom';
export async function POST(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await adminAuth.verifySessionCookie(session);
    // const user = await adminDb.collection('users').doc(uid).get();
    // const linkedinUrl = user.data()?.linkedin_url;

    const { fullName, company, fromUrl } = await request.json();

    console.log('fromUrl', fromUrl);

    const local = request.headers.get('accept-language')!.split(',')[1];

    if (fromUrl) {
      const linkedin = await searchLinkedInProfile(fromUrl, '', local);
      console.log('linkedin', linkedin);
      return NextResponse.json({ linkedin });
    }

    const linkedin = await searchLinkedInProfile(fullName, company, local);

    return NextResponse.json({ linkedin });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized', message: error },
      { status: 401 }
    );
  }
}
