import { adminAuth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { searchLinkedInProfile } from '../../completion/route';
import { JSDOM } from 'jsdom';
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

    if (fromUrl) {
      const linkedinHtml = await fetch(fromUrl).then((res) => res.text());
      const parser = new JSDOM(linkedinHtml);
      const doc = parser.window.document;
      const title = doc.querySelector('title')?.textContent || null;
      const linkedinUrl =
        doc
          .querySelector('a[href^="https://www.linkedin.com/in/"]')
          ?.getAttribute('href') || null;
      // get image from og:image
      const profileImageUrl =
        doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute('content') || null;

      console.log({ title, url: linkedinUrl, profileImageUrl });
      return NextResponse.json({ title, url: linkedinUrl, profileImageUrl });
    }

    const local = request.headers.get('accept-language')!.split(',')[1];

    const linkedin = await searchLinkedInProfile(fullName, company, local);

    return NextResponse.json({ linkedin });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
