export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { customPrompt, promptContext, PromptProps } from './prompt';
import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/client';
import { client } from '@/lib/openai/client';

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
      const subscription = user.data()?.subscription;
      const stripe_customer_id = user.data()?.stripe_customer_id as string;
      if (
        usedCredits > 5 &&
        (!subscription || subscription === 'free' || !stripe_customer_id)
      ) {
        return NextResponse.json({ error: 'Credits expired' }, { status: 402 });
      }

      try {
        return await generateProfile({
          fullName,
          company,
          prompt,
          lang,
          onFinish: async (completion) => {
            const batch = adminDb.batch();
            const profileRef = adminDb.collection('profiles').doc(id);
            batch.set(profileRef, {
              fullName,
              company,
              prompt,
              content: completion,
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

            // const response = NextResponse.json({ completion });
            // if (!trialSession && !session && !authorization) {
            //   response.cookies.set('__trial_session', 'true');
            // }
            // return response;
          }
        });
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
      return await generateProfile({ fullName, company, prompt, lang });
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
  prompt,
  lang,
  onFinish
}: PromptProps & {
  onFinish?: (completion: string) => Promise<void>;
}) => {
  try {
    const responseStream = await client.chat.completions.create({
      model: 'llama-3.1-sonar-small-128k-online',
      stream: true,
      messages: [
        {
          role: 'system',
          content: promptContext + `\n\nLanguage code: ${lang}`
        },
        { role: 'user', content: customPrompt(fullName, company, prompt, lang) }
      ]
    });

    let completion = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const response of responseStream) {
            if (
              response &&
              response.choices &&
              response.choices[0]?.delta.content
            ) {
              const chunk = response.choices[0].delta.content;
              controller.enqueue(new TextEncoder().encode(chunk || ''));
              completion += chunk || '';
            }
          }
          controller.close();
          if (onFinish) {
            await onFinish(completion);
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  } catch (e) {
    console.error('API error', e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
