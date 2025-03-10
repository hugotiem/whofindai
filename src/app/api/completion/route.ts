export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { promptContext, PromptProps } from './prompt';
// import { stripe } from '@/lib/stripe/client';
import { ProfileResponseSchema } from '@/lib/prompts/profile';
import { formatProfilePrompt } from '@/lib/prompts/profile/formatters';
import { ProfileData } from './prompt';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Plan, Prisma } from '@prisma/client';
import { stripe } from '@/lib/stripe/client';
interface StreamMessage {
  type: 'linkedin' | 'sources' | 'thinking' | 'profile';
  status: 'loading' | 'success' | 'error';
  data?: unknown;
  error?: string;
}

export async function POST(request: NextRequest) {
  // const start = new Date();

  // const local = request.headers.get('accept-language')!.split(',')[1];

  const {
    id,
    // fullName,
    product,
    // company,
    lang,
    linkedinProfile
  }: PromptProps = await request.json();

  const trialSession = request.cookies.get('__trial_session')?.value;
  const session = request.cookies.get('__session')?.value;
  const authorization = request.headers.get('Authorization')?.split(' ')[1];

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser(authorization);

  if (trialSession && !session && !authorization) {
    return NextResponse.json(
      { error: 'Trial session expired' },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  }

  if (!linkedinProfile) {
    return NextResponse.json(
      { error: 'No linkedin profile provided' },
      { status: 400 }
    );
  }

  if (user || authorization) {
    try {
      // const { uid } = authorization
      //   ? await adminAuth.verifyIdToken(authorization)
      //   : ((await adminAuth.verifySessionCookie(session!)) as { uid: string });
      // const user = await adminDb.collection('users').doc(uid).get();
      const userInfo = await prisma.user.findUnique({
        where: { id: user?.id }
      });
      const usedCredits = userInfo?.usedCredits || 0;
      const subscription_name = userInfo?.plan as Plan;
      const stripe_customer_id = userInfo?.stripeCustomerId as string;
      if (
        usedCredits >= 5 &&
        (!subscription_name ||
          subscription_name === 'FREE' ||
          !stripe_customer_id)
      ) {
        return NextResponse.json({ error: 'Credits expired' }, { status: 402 });
      }

      const encoder = new TextEncoder();

      // Create a ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const sendMessage = (message: StreamMessage) => {
              controller.enqueue(
                encoder.encode(JSON.stringify(message) + '\n')
              );
            };

            // Phase 1: LinkedIn Profile
            sendMessage({
              type: 'linkedin',
              status: 'loading'
            });

            sendMessage({
              type: 'linkedin',
              status: 'success',
              data: {
                name: linkedinProfile.fullName,
                url: linkedinProfile.linkedinUrl
              }
            });

            sendMessage({
              type: 'thinking',
              status: 'loading'
            });

            const profile = await generateProfile({
              product,
              lang,
              linkedinProfile,
              controller
            });

            await prisma.profile.upsert({
              where: {
                userId_linkedinUrl: {
                  userId: user?.id as string,
                  linkedinUrl: linkedinProfile.linkedinUrl
                }
              },
              update: {
                profileData: profile as unknown as Prisma.InputJsonValue
              },
              create: {
                id: id,
                linkedinUrl: linkedinProfile.linkedinUrl,
                company: linkedinProfile.company,
                product,
                fullName: linkedinProfile.fullName,
                profileData: profile as unknown as Prisma.InputJsonValue,
                user: { connect: { id: user?.id as string } }
              }
            });

            await prisma.user.update({
              where: { id: user?.id },
              data: { usedCredits: { increment: 1 } }
            });

            if (stripe_customer_id && subscription_name === 'PAY_AS_YOU_GO') {
              await stripe.billing.meterEvents.create({
                event_name: 'generated_result',
                payload: { value: '1', stripe_customer_id }
              });
            }

            controller.close();
          } catch (e) {
            console.error('API error', e);
            return NextResponse.json(
              { error: 'No content generated' },
              { status: 500 }
            );
          }
        }
      });
      return new Response(stream, {
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
  } else {
    try {
      throw new Error('Not implemented');
      // const _linkedinUrl = linkedinUrl
      //   ? { url: linkedinUrl }
      //   : await searchLinkedInProfile(fullName, company, local);
      // const profile = await generateProfile({
      //   fullName,
      //   company,
      //   prompt,
      //   lang,
      //   linkedinUrl: _linkedinUrl.url,
      //   controller
      // });
      // return NextResponse.json({ profile });
    } catch (e) {
      console.error('API error', e);
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      );
    }
  }
}

export const generateProfile = async ({
  product,
  id,
  controller,
  linkedinProfile,
  sysPrompt,
  userPrompt
}: PromptProps & {
  controller: ReadableStreamDefaultController;
  linkedinProfile?: ProfileData;
  sysPrompt?: string;
  userPrompt?: string;
}): Promise<ProfileResponseSchema & { citations: { url: string }[] }> => {
  // return generateGeminiProfile({ fullName, company });
  // const date = new Date();
  const encoder = new TextEncoder();

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar-reasoning-pro',
        response_format: {
          type: 'json_schema',
          json_schema: {
            schema: {
              type: 'object'
            }
          }
        },
        messages: [
          {
            role: 'system',
            content: sysPrompt || promptContext
          },
          {
            role: 'user',
            content:
              userPrompt || formatProfilePrompt(linkedinProfile!, product)
          }
        ],
        max_tokens: 2048,
        temperature: 0.3,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';
    let citations: string[] = [];

    let thinkingEnded = false;

    try {
      let citationsReturned = false;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);

              // Handle citations if present
              if (
                parsed.citations &&
                parsed.citations.length > 0 &&
                !citationsReturned
              ) {
                citations = parsed.citations;
                citationsReturned = true;
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({
                      type: 'sources',
                      status: 'success',
                      data: citations.map((url) => ({ url }))
                    }) + '\n'
                  )
                );
              }

              // Handle content streaming
              const content = parsed.choices[0]?.message?.content;
              if (content) {
                // extract content between start and end of <thinking> and </thinking>
                const start = content.indexOf('<think>');
                const end = content.indexOf('</think>');
                if (start !== -1 && !thinkingEnded) {
                  const thinkingContent = content.slice(start + 7);

                  if (end !== -1) {
                    thinkingEnded = true;
                    controller.enqueue(
                      encoder.encode(
                        JSON.stringify({
                          type: 'thinking',
                          status: 'success',
                          data: {
                            content: thinkingContent.split('</think>')[0]
                          }
                        }) + '\n'
                      )
                    );
                  } else {
                    controller.enqueue(
                      encoder.encode(
                        JSON.stringify({
                          type: 'thinking',
                          status: 'loading',
                          data: { content: thinkingContent }
                        }) + '\n'
                      )
                    );
                  }
                } else {
                  // return content after </think>
                  // const resultContent = ;
                  // // console.log('resultContent', resultContent);
                  // controller.enqueue(
                  //   encoder.encode(
                  //     JSON.stringify({
                  //       type: 'profile',
                  //       status: 'loading',
                  //       data: { content: resultContent }
                  //     }) + '\n'
                  //   )
                  // );
                  accumulatedContent = content.slice(end + 7);
                }
              }
            } catch (e) {
              if (process.env.NODE_ENV !== 'production') {
                console.error('Error parsing streaming response:', e);
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    let profileData: ProfileResponseSchema;
    try {
      // Try to parse the content directly first
      profileData = JSON.parse(accumulatedContent);
    } catch (e) {
      // If direct parsing fails, try to clean the content
      if (!(e instanceof SyntaxError)) {
        console.error('Error', e);
      }
      const jsonString = accumulatedContent
        .replace(/```json\n?|\n?```/g, '') // Remove JSON code block markers
        .replace(/^```\s*\n|```\s*$/g, '') // Remove any remaining code block markers
        .replace(/^\s*```\s*$\n?/gm, '') // Remove single line code markers
        .replace(/>/g, '') // remove ">"
        .replace(/json\n?|\n?json/g, '') // remove just json markers
        .trim();
      try {
        profileData = JSON.parse(jsonString);
        // console.log('profileData', profileData);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error', e);
        }
        try {
          profileData = JSON.parse(`${jsonString}\n}`);
        } catch (e) {
          console.error('Failed to parse profile data:', jsonString);
          throw new Error('Invalid JSON format in API response: ' + e);
        }
      }
    }

    controller.enqueue(
      encoder.encode(
        JSON.stringify({
          type: 'profile',
          status: 'success',
          data: {
            content: {
              id,
              fullName: linkedinProfile?.fullName,
              company: linkedinProfile?.company,
              product,
              linkedinUrl: linkedinProfile?.linkedinUrl,
              profileData
            }
          }
        }) + '\n'
      )
    );

    return {
      ...profileData,
      citations: citations.map((citation: string) => ({
        url: citation
      }))
    };
  } catch (e) {
    console.error('Error generating profile:', e);
    throw e;
  }
};
