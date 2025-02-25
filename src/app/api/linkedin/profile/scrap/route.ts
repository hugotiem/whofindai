import client from '@/lib/apify/client';
import { NextRequest, NextResponse } from 'next/server';

function cleanLinkedInUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('linkedin.com')) {
      throw new Error('Not a LinkedIn URL');
    }

    const pathParts = urlObj.pathname.split('/');
    const inIndex = pathParts.indexOf('in');
    if (inIndex === -1) {
      throw new Error('Invalid LinkedIn profile URL format');
    }

    const publicIdentifier = pathParts[inIndex + 1]?.split('?')[0];
    if (!publicIdentifier) {
      throw new Error('No public identifier found');
    }

    return `https://www.linkedin.com/in/${publicIdentifier}/`;
  } catch (error) {
    throw new Error('Invalid LinkedIn URL', { cause: error });
  }
}

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  console.log('url', url);

  try {
    const cleanedUrl = cleanLinkedInUrl(url);

    console.log('cleanedUrl', cleanedUrl);

    const input = { profileUrls: [cleanedUrl] };

    const { defaultDatasetId } = await client
      .actor('dev_fusion/Linkedin-Profile-Scraper')
      .call(input);

    const { items } = await client.dataset(defaultDatasetId).listItems();

    console.log('items', items[0]);

    if (!items[0] || items[0].error) {
      return NextResponse.json({ error: 'profile not found' }, { status: 404 });
    }

    return NextResponse.json({ item: items[0] });
  } catch (error) {
    console.error('Error', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
