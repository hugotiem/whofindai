import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { customPrompt, openai, promptContext, PromptProps } from '../prompt';

export async function POST(request: NextRequest) {
  const { fullName, prompt, company }: PromptProps = await request.json();

  // if (!session) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  const result = await streamText({
    model: openai('llama-3.1-sonar-large-128k-online'),
    system: promptContext,
    prompt: `
        ${customPrompt(fullName, company, prompt)}
        
        The Person
        1. Contact Details:
        Full name
        Professional contact details if publicly available, including:
        Business email address
        Office phone number
        Company address
        2. Professional Insights and Personality Analysis:
        Highlight the person’s professional background, expertise, and any industry involvement (e.g., publications, speaking engagements).
        Based on public information, provide an inferred and detailed MBTI or DISC profile. And explain what the profile is.
        Note: Clearly state that this analysis is an inference and may not be fully accurate without formal assessment.
        3. Job Role and Responsibilities:
        Provide the person's current job title and summarize their key responsibilities.
        Clarify if the person is an internal employee or works as an external consultant/freelancer.
        Describe their role within the company structure, including their influence and scope of responsibilities (highlighting key projects if relevant).
      `,
    maxSteps: 5,
    onFinish: async ({ responseMessages, text }) => {
      // console.log(responseMessages);
      // console.log(text);
      // const session = request.cookies.get('__session')?.value;
      // if (!session) return;
      // try {
      //   const { uid } = await adminAuth.verifySessionCookie(session);
      //   await adminDb.collection('profiles').add({
      //     userId: uid,
      //   })
      // } catch (e) {
      //   console.error(e);
      // }
      // if (session.user && session.user.id) {
      //   try {
      //     await saveChat({
      //       id,
      //       messages: [...coreMessages, ...responseMessages],
      //       userId: session.user.id,
      //     });
      //   } catch (error) {
      //     console.error("Failed to save chat");
      //   }
      // }
    }
    // experimental_telemetry: {
    //   isEnabled: true,
    //   functionId: "stream-text",
    // },
  });

  return result.toDataStreamResponse();
}

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return new Response("Not Found", { status: 404 });
//   }

//   const session = await auth();

//   if (!session || !session.user) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   try {
//     const chat = await getChatById({ id });

//     if (chat.userId !== session.user.id) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     await deleteChatById({ id });

//     return new Response("Chat deleted", { status: 200 });
//   } catch (error) {
//     return new Response("An error occurred while processing your request", {
//       status: 500,
//     });
//   }
// }
