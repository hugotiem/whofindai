export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { customPrompt, promptContext, PromptProps } from './prompt';
import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const { id, fullName, prompt, company }: PromptProps = await request.json();

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
          content: promptContext
        },
        {
          role: 'user',
          content: customPrompt(fullName, company, prompt)
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

    // console.log(data.choices[0].message);
    // show citations from perplexity api
    console.log(data);

    if (id && data.choices.length > 0 && data.choices[0].message.content) {
      const content = data.choices[0].message.content;

      const session = request.cookies.get('__session')?.value;
      if (!session) return NextResponse.json({ completion: content });

      try {
        const { uid } = await adminAuth.verifySessionCookie(session);
        await adminDb.collection('profiles').doc(id).set({
          fullName,
          company,
          prompt,
          content,
          userId: uid,
          createdAt: admin.firestore.Timestamp.now()
        });
      } catch (e) {
        console.error(e);
      }
      return NextResponse.json({ completion: content });
    }
    throw Error('response.choices is empty or undefined');
  } catch (e) {
    console.error('API error', e);
    return NextResponse.json({ error: e });
  }
}
