export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { APIProfile, PromptProps, systemPrompt, userPrompt } from './prompt';
import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/client';



export async function POST(request: NextRequest) {
  const { id, fullName, prompt, company, lang }: PromptProps =
    await request.json();

  const trialSession = request.cookies.get('__trial_session')?.value;
  const session = request.cookies.get('__session')?.value;
  const authorization = request.headers.get('Authorization')?.split(' ')[1];

  if (trialSession && !session && !authorization) {
    return NextResponse.json(
      { error: 'Trial session expired' },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  }

  if (session || authorization) {
    try {
      const { uid } = session
        ? ((await adminAuth.verifySessionCookie(session)) as { uid: string })
        : await adminAuth.verifyIdToken(authorization!);
      const user = await adminDb.collection('users').doc(uid).get();
      const usedCredits = user.data()?.used_credits || 0;
      const subscription_name = user.data()?.stripe_subscription_name;
      const stripe_customer_id = user.data()?.stripe_customer_id as string;
      if (
        usedCredits >= 5 &&
        (!subscription_name ||
          subscription_name === 'free' ||
          !stripe_customer_id)
      ) {
        return NextResponse.json({ error: 'Credits expired' }, { status: 402 });
      }

      try {
        const profile = await generateProfile({
          fullName,
          company,
          prompt,
          lang
          // onFinish: async (completion) => {

          // const response = NextResponse.json({ completion });
          // if (!trialSession && !session && !authorization) {
          //   response.cookies.set('__trial_session', 'true');
          // }
          // return response;
          // }
        });
        const batch = adminDb.batch();
        const profileRef = adminDb.collection('profiles').doc(id);
        batch.set(profileRef, {
          ...profile,
          userId: uid,
          lang,
          createdAt: admin.firestore.Timestamp.now()
        });

        const userRef = adminDb.collection('users').doc(uid);
        batch.set(
          userRef,
          { used_credits: admin.firestore.FieldValue.increment(1) },
          { merge: true }
        );

        await batch.commit();

        if (stripe_customer_id && subscription_name === 'pay_as_you_go') {
          await stripe.billing.meterEvents.create({
            event_name: 'generated_result',
            payload: { value: '1', stripe_customer_id }
          });
        }

        return NextResponse.json({ profile });
      } catch (e) {
        console.error('API error', e);
        return NextResponse.json(
          { error: 'No content generated' },
          { status: 500 }
        );
      }
    } catch (e) {
      console.error('API error', e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  } else {
    try {
      const profile = await generateProfile({
        fullName,
        company,
        prompt,
        lang
      });
      return NextResponse.json({ profile });
    } catch (e) {
      console.error('API error', e);
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      );
    }
  }
}

const generateProfile = async ({
  fullName,
  company,
  // prompt
  // lang
  // onFinish
}: PromptProps & {
  // onFinish?: (completion: string) => Promise<APIProfile>;
}): Promise<APIProfile> => {
  try {
    if (!fullName || !company) {
      throw new Error('Full name and company are required');
    }

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
              content: systemPrompt(fullName, company)
            },
            {
              role: 'user',
              content: userPrompt(fullName, company)
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

    return profileData;
  } catch (error) {
    console.error(
      'Error generating profile:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw error;
  }
};
