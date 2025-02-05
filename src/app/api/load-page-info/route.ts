import { adminAuth, adminDb } from '@/lib/firebase/admin';

import { JSDOM } from 'jsdom';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = encodeURI(request.nextUrl.searchParams.get('url') || '');
  console.log(url);
  const profileId = request.nextUrl.searchParams.get('profileId');
  const session = request.cookies.get('__session')?.value;

  if (!url || !profileId) {
    return NextResponse.json(
      { error: 'URL and profileId are required' },
      { status: 400 }
    );
  }

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { uid } = await adminAuth.verifySessionCookie(session);

  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const info = await getWebsiteInfo(url);

  const response = await adminDb.runTransaction(async (transaction) => {
    const profile = await transaction.get(
      adminDb.collection('profiles').doc(profileId)
    );

    if (!profile.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profileData = profile.data();
    const citations: {
      url: string;
      title: string | null;
      favicon: string | null;
    }[] = profileData?.citations || [];
    const citationIndex = citations.findIndex(
      (citation) => citation.url === url
    );

    if (citationIndex === -1) {
      return NextResponse.json(
        { error: 'Citation not found' },
        { status: 404 }
      );
    }

    citations[citationIndex].title = info.title;
    citations[citationIndex].favicon = info.favicon;

    transaction.update(adminDb.collection('profiles').doc(profileId), {
      citations
    });

    return NextResponse.json(citations[citationIndex]);
  });

  return response;
}

async function getWebsiteInfo(
  url: string
): Promise<{ url: string; title: string | null; favicon: string | null }> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new JSDOM(html);
    const doc = parser.window.document;

    const title = doc.querySelector('title')?.textContent || null;

    let favicon: string | null = null;

    const faviconLink =
      doc.querySelector('link[rel="icon"]') ||
      doc.querySelector('link[rel="shortcut icon"]') ||
      doc.querySelector('link[rel="apple-touch-icon"]');

    if (faviconLink) {
      const faviconHref = faviconLink.getAttribute('href');
      if (faviconHref) {
        favicon = new URL(faviconHref, url).href;
      }
    } else {
      favicon = new URL('/favicon.ico', url).href;
    }

    return { url, title, favicon };
  } catch (error) {
    console.error('Error fetching website info:', error);
    return { url, title: null, favicon: null };
  }
}
