export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { customPrompt, promptContext, PromptProps } from './prompt';
import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';
import { client } from '@/lib/openai/client';

export async function POST(request: NextRequest) {
  const { id, fullName, prompt, company }: PromptProps = await request.json();

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.1-sonar-small-128k-online',
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

    if (
      id &&
      response.choices.length > 0 &&
      response.choices[0].message.content
    ) {
      const content = response.choices[0].message.content;

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
