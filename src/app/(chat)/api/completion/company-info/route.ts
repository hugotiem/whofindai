import { streamText } from 'ai';
import { NextRequest } from 'next/server';
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
        
        The company
        1. Company Overview:
        Summarize the company’s size, annual turnover, geographical presence, and date of establishment.
        Describe the company’s core activities, position in the market, and recent news or developments.
        Provide context on industry trends or competition where relevant.
        2. Potential Objectives and Pain Points:
          1. Identify potential challenges or pain points for the person and their department.
          2. Extend this analysis to the company's broader business needs.
          3. Suggest how the product/service offered can address these needs, both at the individual and organizational levels.
      `,
    maxSteps: 5,
    // tools: {
    //   e: {
    //     description: '',
    //     parameters: {}
    //   }
    //   // getWeather: {
    //   //   description: "Get the current weather at a location",
    //   //   parameters: z.object({
    //   //     latitude: z.number(),
    //   //     longitude: z.number(),
    //   //   }),
    //   //   execute: async ({ latitude, longitude }) => {
    //   //     const response = await fetch(
    //   //       `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    //   //     );

    //   //     const weatherData = await response.json();
    //   //     return weatherData;
    //   //   },
    //   // },
    // },
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
