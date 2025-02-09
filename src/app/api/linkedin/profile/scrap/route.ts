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
    throw new Error('Invalid LinkedIn URL');
  }
}

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  const cleanedUrl = cleanLinkedInUrl(url);

  const input = {
    urls: [{ url: cleanedUrl }],
    findContacts: false
  };

  const { defaultDatasetId } = await client
    .actor('supreme_coder/linkedin-profile-scraper')
    .call(input);

  const { items } = await client.dataset(defaultDatasetId).listItems();

  return NextResponse.json({ item: items[0] });
}
