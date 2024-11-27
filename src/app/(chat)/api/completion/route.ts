export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { customPrompt, promptContext, PromptProps } from './prompt';
import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  const { id, fullName, prompt, company, lang }: PromptProps = await request.json();

  console.log('lang', lang);

  const trialSession = request.cookies.get('__trial_session')?.value;
  const session = request.cookies.get('__session')?.value;
  const authorization = request.headers.get('Authorization')?.split(' ')[1];


  if (trialSession && !session && !authorization) {
    return NextResponse.json(
      { error: 'Trial session expired' },
      { status: 401 }
    );
  }

  if (session || authorization) {
    try {
      const { uid } = session
        ? ((await adminAuth.verifySessionCookie(session)) as { uid: string })
        : await adminAuth.verifyIdToken(authorization!);
      const user = await adminDb.collection('users').doc(uid).get();
      const usedCredits = user.data()?.used_credits || 0;
      const subscription = user.data()?.subscription;
      const stripe_customer_id = user.data()?.stripe_customer_id as string;
      if (
        (usedCredits > 5 && (!subscription || subscription === 'free')) &&
        !stripe_customer_id
      ) {
        return NextResponse.json({ error: 'Credits expired' }, { status: 402 });
      }
      const content = await generateProfile(fullName, company, prompt, lang);
      if (!content) {
        return NextResponse.json(
          { error: 'No content generated' },
          { status: 500 }
        );
      }
      const batch = adminDb.batch();
      const profileRef = adminDb.collection('profiles').doc(id);
      batch.set(profileRef, {
        fullName,
        company,
        prompt,
        content,
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

      if (stripe_customer_id && subscription === 'pay_as_you_go') {
        await stripe.billing.meterEvents.create({
          event_name: 'generated_result',
          payload: { value: '1', stripe_customer_id }
        });
      }

      const response = NextResponse.json({ completion: content });
      if (!trialSession && !session && !authorization) {
        response.cookies.set('__trial_session', 'true');
      }
      return response;
    } catch (e) {
      console.error('API error', e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  } else {
    const content = await generateProfile(fullName, company, prompt, lang);
    if (!content) {
      return NextResponse.json({ error: 'No content generated' });
    }
    return NextResponse.json({ completion: content });
  }
}

const generateProfile = async (
  fullName: string,
  company: string,
  prompt: string,
  lang: string
): Promise<string | null> => {
  try {
    const body = JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      return_citations: true,
      stream: false,
      response_format: {
        type: 'json_schema',
        json_schema: {
          schema: {
            type: 'object',
            properties: {
              completion: { type: 'string' }
            }
          }
        }
      },
      messages: [
        {
          role: 'system',
          content: promptContext + `\n\nLanguage code: ${lang}`
        },
        {
          role: 'user',
          content: customPrompt(fullName, company, prompt, lang)
        }
      ]
    });

    const response = await fetch(
      `${process.env.PERPLEXITY_BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body
      }
    );

    const data = await response.json();
    if (data.choices.length > 0 && data.choices[0].message.content) {
      return data.choices[0].message.content;
    }
    return null;
  } catch (e) {
    console.error('API error', e);
    return null;
  }
};
