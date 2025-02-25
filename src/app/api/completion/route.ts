export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { promptContext, PromptProps } from './prompt';
import {  adminAuth, adminDb } from '@/lib/firebase/admin';
// import { stripe } from '@/lib/stripe/client';
import { ProfileResponseSchema } from '@/lib/prompts/profile';
import { formatProfilePrompt } from '@/lib/prompts/profile/formatters';
import { ProfileData } from './prompt';

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

  console.log('product', product);
  console.log('linkedinProfile', JSON.stringify(linkedinProfile));
  console.log('lang', lang);
  console.log('authorization', authorization);
  console.log('session', session);

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

  if (session || authorization) {
    try {
      const { uid } = authorization
        ? await adminAuth.verifyIdToken(authorization)
        : ((await adminAuth.verifySessionCookie(session!)) as { uid: string });
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

            // const linkedInProfile =
            //   linkedinUrl &&
            //   (await fetch(
            //     `${process.env.BASE_URL}/api/linkedin/profile/scrap`,
            //     {
            //       method: 'POST',
            //       body: JSON.stringify({ url: linkedinUrl })
            //     }
            //   ).then(async (res) => {
            //     if (!res.ok) {
            //       throw new Error('Failed to fetch LinkedIn profile');
            //     }
            //     const data = await res.json();
            //     return data.item;
            //   }));

            sendMessage({
              type: 'linkedin',
              status: 'success',
              data: {
                name: 'HUGO TIEM',
                url: 'https://fr.linkedin.com/in/hugotiem'
                // name: linkedInProfile?.fullName,
                // url: linkedInProfile?.linkedinUrl,
                // pictureUrl: linkedInProfile?.profilePicHighQuality
              }
            });

            sendMessage({
              type: 'thinking',
              status: 'loading'
            });

            // Step 2: Send initial response
            // const stream = new TransformStream();
            // const writer = stream.writable.getWriter();
            // const encoder = new TextEncoder();

            // Send the LinkedIn search result
            // const initialResponse = {
            //   status: 'searching',
            //   linkedInProfile: linkedinUrl
            // };
            // await writer.write(
            //   encoder.encode(JSON.stringify(initialResponse) + '\n'  )
            // );

            await generateProfile({
              product,
              lang,
              linkedinProfile,
              controller
            });
            // const batch = adminDb.batch();
            // const profileRef = adminDb.collection('profiles').doc(id);
            // batch.set(profileRef, {
            //   ...profile,
            //   userId: uid,
            //   lang,
            //   createdAt: admin.firestore.Timestamp.now()
            //   // ...(profile.sources && { sources: profile.sources })
            // });

            // const userRef = adminDb.collection('users').doc(uid);
            // batch.set(
            //   userRef,
            //   { used_credits: admin.firestore.FieldValue.increment(1) },
            //   { merge: true }
            // );

            // await batch.commit();

            // if (stripe_customer_id && subscription_name === 'pay_as_you_go') {
            //   await stripe.billing.meterEvents.create({
            //     event_name: 'generated_result',
            //     payload: { value: '1', stripe_customer_id }
            //   });
            // }

            // // Send final profile data
            // sendMessage({
            //   type: 'profile',
            //   status: 'success',
            //   data: profile
            // });

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

const generateProfile = async ({
  product,
  // lang,
  controller,
  linkedinProfile
}: PromptProps & {
  controller: ReadableStreamDefaultController;
  linkedinProfile?: ProfileData;
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
            content: promptContext
          },
          {
            role: 'user',
            content: formatProfilePrompt(linkedinProfile!, product)
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
                console.log('citations', parsed.citations);
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
                    console.log(
                      'thinkingEnded',
                      thinkingContent.split('</think>')[0]
                    );
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
                    // console.log('thinkingContent', thinkingContent);
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
        console.error('Failed to parse profile data:', jsonString);
        throw new Error('Invalid JSON format in API response: ' + e);
      }
    }

    console.log('profileData', profileData);

    controller.enqueue(
      encoder.encode(
        JSON.stringify({
          type: 'profile',
          status: 'success',
          data: { content: profileData }
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

// const generateGeminiProfile = async ({
//   fullName,
//   company,
//   linkedinUrl
// }: PromptProps): Promise<EnhancedAPIProfile> => {
//   try {
//     if (!fullName || !company) {
//       throw new Error('Full name and company are required');
//     }

//     // Get the model
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-pro'
//     });

//     // Create prompt parts with explicit JSON instruction
//     const prompt = [
//       { text: systemPrompt({ fullName, company, linkedinUrl }) },
//       { text: userPrompt(fullName, company) }
//     ];
//     // Generate content
//     const result = await model.generateContent({
//       contents: [
//         {
//           role: 'user',
//           parts: prompt
//         }
//       ],
//       // generationConfig: {},
//       tools: [
//         {
//           googleSearchRetrieval: {
//             dynamicRetrievalConfig: {
//               mode: DynamicRetrievalMode.MODE_UNSPECIFIED
//             }
//           }
//         }
//       ]
//     });

//     const response = result.response;
//     console.log('response', response);
//     const content = response.text().trim();
//     console.log('content', content);
//     // Extract grounding metadata
//     const groundingMetadata: GroundingMetadata = {
//       citations: [],
//       searchQueries: []
//     };

//     // // Get citations if available
//     // if (response.candidates?.[0]?.citationMetadata?.citationSources) {
//     //   groundingMetadata.citations =
//     //     response.candidates[0].citationMetadata.citationSources.map((citation) => ({
//     //       startIndex: citation.startIndex,
//     //       endIndex: citation.endIndex,
//     //       url: citation.uri,
//     //       // title: citation.title,
//     //       // snippet: citation.snippet,
//     //       // publishedDate: citation.publishedDate
//     //     }));
//     // }

//     // // Get search queries if available
//     // if (response.promptFeedback?.) {
//     //   groundingMetadata.searchQueries = response.promptFeedback.searchQueries;
//     // }

//     let profileData: APIProfile;
//     try {
//       // Try to parse the content directly first
//       profileData = JSON.parse(content);
//     } catch (e) {
//       // If direct parsing fails, try to clean the content
//       const jsonString = content.replace(/```json\n?|\n?```/g, '').trim();
//       try {
//         profileData = JSON.parse(jsonString);
//       } catch (e) {
//         console.error('Failed to parse profile data:', content);
//         throw new Error('Invalid JSON format in API response: ' + e);
//       }
//     }

//     // Validate the JSON structure
//     const requiredFields = [
//       'fullName',
//       'company',
//       'role',
//       'missions',
//       'background',
//       'education',
//       'company_description',
//       'personality_traits',
//       'communication_insights',
//       'country',
//       'city',
//       'industry',
//       'seo_title',
//       'seo_description',
//       'seo_keywords'
//     ];

//     for (const field of requiredFields) {
//       if (!(field in profileData)) {
//         throw new Error(`Missing required field in API response: ${field}`);
//       }
//     }

//     if (!Array.isArray(profileData.seo_keywords)) {
//       throw new Error('seo_keywords must be an array');
//     }

//     // if (!Array.isArray(profileData.personality_traits)) {
//     //   throw new Error('personality_traits must be an array');
//     // }

//     // Combine profile data with grounding metadata
//     const enhancedProfile: EnhancedAPIProfile = {
//       ...profileData,
//       sources: groundingMetadata
//     };

//     return enhancedProfile;
//   } catch (error) {
//     console.error(
//       'Error generating profile:',
//       error instanceof Error ? error.message : 'Unknown error'
//     );
//     throw error;
//   }
// };
