export const maxDuration = 30;

import { adminAuth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { APIProfile } from '@/app/api/completion/prompt';

export async function POST(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { email } = await adminAuth.verifySessionCookie(session);
  if (!email || !['edouard@tiemh.com', 'hugotiem@gmail.com'].includes(email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { sysPrompt, userPrompt } = await request.json();

  try {
    const response = await fetch(
      `${process.env.PERPLEXITY_BASE_URL!}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: sysPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_tokens: 2048,
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format: No content in response');
    }

    const content = data.choices[0].message.content.trim();

    // Remove any potential markdown formatting or extra text
    const jsonString = content.replace(/```json\n?|\n?```/g, '').trim();

    let profileData: APIProfile;
    try {
      profileData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse profile data:', jsonString);
      throw new Error('Invalid JSON format in API response' + e);
    }

    // Validate required fields
    const requiredFields = [
      'fullName',
      'company',
      'role',
      'missions',
      'background',
      'education',
      'company_description',
      'personality_traits',
      'communication_insights',
      'engagement_insights',
      'company_overview',
      'professional_overview',
      'country',
      'city',
      'industry',
      'seo_title',
      'seo_description',
      'seo_keywords'
    ];
    for (const field of requiredFields) {
      if (!(field in profileData)) {
        throw new Error(`Missing required field in API response: ${field}`);
      }
    }

    if (!Array.isArray(profileData.seo_keywords)) {
      throw new Error('seo_keywords must be an array');
    }

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
