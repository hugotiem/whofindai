import { adminAuth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { email } = await adminAuth.verifySessionCookie(session);
  if (!email || !['edouard@tiemh.com', 'hugotiem@gmail.com'].includes(email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { context, prompt } = await request.json();

  console.log(context, prompt);

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
          content: context
        },
        {
          role: 'user',
          content: prompt
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
      return NextResponse.json({ completion: data.choices[0].message.content });
    }
    return NextResponse.json({ error: 'No completion found' }, { status: 500 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
