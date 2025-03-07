export const maxDuration = 30;

import { NextRequest, NextResponse } from 'next/server';
import { ProfileData } from '@/app/api/completion/prompt';
import { generateProfile } from '@/app/api/completion/route';
import { createClient } from '@/lib/supabase/server';

interface StreamMessage {
  type: 'linkedin' | 'sources' | 'thinking' | 'profile' | 'error';
  status: 'loading' | 'success' | 'error';
  data?: unknown;
  error?: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!user.email || !['edouard@tiemh.com', 'hugotiem@gmail.com'].includes(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { sysPrompt, userPrompt, linkedinProfile, lang } = await request.json();

  try {
    const encoder = new TextEncoder();

    // Create a ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        // Define sendMessage function inside the start method to avoid reference error
        const sendMessage = (message: StreamMessage) => {
          controller.enqueue(encoder.encode(JSON.stringify(message) + '\n'));
        };

        try {
          // Phase 1: LinkedIn Profile
          sendMessage({
            type: 'linkedin',
            status: 'loading'
          });

          // Simulate a delay for LinkedIn data retrieval
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Send LinkedIn data
          sendMessage({
            type: 'linkedin',
            status: 'success',
            data: {
              name: linkedinProfile?.fullName || 'John Doe',
              url: 'https://linkedin.com/in/johndoe',
              pictureUrl:
                linkedinProfile?.pictureUrl || 'https://via.placeholder.com/150'
            }
          });

          // Phase 2 & 3: Use the imported generateProfile function
          // Create a mock product value since the original function expects it
          const product = 'profile';

          await generateProfile({
            product,
            lang,
            linkedinProfile: linkedinProfile as ProfileData,
            controller,
            sysPrompt,
            userPrompt
          });

          controller.close();
        } catch (e) {
          console.error('API error', e);
          sendMessage({
            type: 'error',
            status: 'error',
            error: e instanceof Error ? e.message : 'Unknown error occurred'
          });
          controller.close();
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
