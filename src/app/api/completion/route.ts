export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { APIProfile, PromptProps, systemPrompt, userPrompt } from './prompt';
import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/client';
import {
  // DynamicRetrievalMode,
  GoogleGenerativeAI
} from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// First, let's define interfaces for the grounding metadata
interface GroundingMetadata {
  citations: {
    startIndex: number;
    endIndex: number;
    url: string;
    title: string;
    snippet: string;
    publishedDate?: string;
  }[];
  searchQueries: string[];
}

// Update the APIProfile interface to include grounding metadata
interface EnhancedAPIProfile extends APIProfile {
  sources?: GroundingMetadata;
}

export async function POST(request: NextRequest) {
  const { id, fullName, prompt, company, lang, linkedinUrl }: PromptProps =
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
          // ...(profile.sources && { sources: profile.sources })
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
        lang,
        linkedinUrl
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
  prompt,
  lang,
  linkedinUrl
}: PromptProps): Promise<APIProfile> => {
  // return generateGeminiProfile({ fullName, company });
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: systemPrompt({ fullName, company, linkedinUrl })
          },
          { role: 'user', content: userPrompt(fullName, company) }
        ]
      })
    });

    const content = await response.text();

    let profileData: APIProfile;
    try {
      // Try to parse the content directly first
      profileData = JSON.parse(content);
    } catch (e) {
      // If direct parsing fails, try to clean the content
      const jsonString = content.replace(/```json\n?|\n?```/g, '').trim();
      try {
        profileData = JSON.parse(jsonString);
      } catch (e) {
        console.error('Failed to parse profile data:', content);
        throw new Error('Invalid JSON format in API response: ' + e);
      }
    }

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
