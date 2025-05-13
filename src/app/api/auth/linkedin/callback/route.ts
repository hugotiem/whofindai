import linkedin from '@/lib/linkedin/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error) {
      console.error(`LinkedIn OAuth error: ${error} - ${errorDescription}`);
      return NextResponse.redirect(`${url.origin}?error=linkedin_auth_failed`);
    }

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Exchange code for access token
    await linkedin.getAccessToken(code);

    // Get user profile and store LinkedIn connection
    // Add implementation based on your requirements

    return NextResponse.redirect(url.origin);
  } catch (error) {
    console.error('Error processing LinkedIn callback:', error);
    return NextResponse.json(
      { error: 'Failed to process LinkedIn authentication' },
      { status: 500 }
    );
  }
}
