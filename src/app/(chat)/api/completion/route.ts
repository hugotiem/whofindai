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
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: promptContext
        },
        {
          role: 'user',
          content: customPrompt('Sacha Azoulay', 'Growth Room', 'AI Tool')
        },
        {
          role: 'assistant',
          content: `Output example (for reference only):
             ## **1. Contact Details**

            - **Full Name**: Sacha Azoulay
            - **Professional Email**: [sacha@growthroom.co](mailto:sacha@growthroom.co), [azoulay.sacha@gmail.com](mailto:azoulay.sacha@gmail.com)
            - **Company Address**: 336 Rue Saint-Honoré, 75001 Paris, France
            - **Phone Number**: Not publicly available.

            ---

            ## **2. Professional Overview**

            - **Role and Responsibilities**: Sacha Azoulay is the Founder & CEO of Growth Room, a growth marketing agency based in Paris. His responsibilities include overseeing the company's strategic direction, client acquisition, and growth initiatives. He is also involved in managing key client relationships and ensuring the successful execution of digital marketing strategies.
            - **Background**: Sacha has extensive experience in growth marketing and business development. Prior to founding Growth Room in 2020, he held leadership roles such as Head of Growth at Dreem and worked with TheFamily as a Growth Marketing Manager. His expertise spans digital prospecting, SEO, media campaigns, and CRM management. He has a strong track record of helping startups and established companies scale through tailored growth strategies.
            - **Personality Insights (Inferred)**: Based on his public posts and leadership style, Sacha appears to be resilient, adaptable, and driven by results. His ability to navigate challenges (e.g., COVID-19 setbacks) suggests he may have a personality type aligned with the *ENTJ* (Commander) in the MBTI framework or a *D* (Dominant) in DISC, characterized by leadership and problem-solving skills. However, this is an inferred analysis based on public information.

            ---

            ## **3. Company Overview**

            - **Basic Info**: Growth Room is a growth marketing agency founded in 2020, based in Paris. The company has about 25 employees and has experienced rapid growth (110% annually). It specializes in digital marketing strategies including SEO, paid media campaigns, and CRM optimization.
            - **Market Position**: Growth Room positions itself as an expert in helping businesses unlock growth through structured digital strategies. The agency has worked with over 230 companies across various sectors, including startups and large corporations like Michelin and Figaro Classifieds. They aim to be one of the top five growth marketing agencies in Europe within the next few years.
            - **Challenges**: One potential challenge for Growth Room is maintaining its rapid growth while ensuring high-quality service delivery as it scales. Additionally, staying competitive in a crowded market of digital agencies requires constant innovation in tools and strategies. The AI tool offered could help address these challenges by streamlining sales preparation processes, improving conversion rates through better-informed calls.

            ---

            ## **4. Engagement Strategy**

            - **Communication Tips**:
                - Focus on how your AI tool can save time for sales teams by automating call preparation.
                - Highlight how the tool can enhance prospecting efforts by providing relevant insights quickly.
                - Use data-driven examples to show how your product can improve conversion rates for Growth Room’s clients.
                - Emphasize scalability—how your tool grows with their needs as they expand their client base.
            - **Key Questions**:
                1. "What are the biggest challenges your sales team faces when preparing for calls?"
                    - *Follow-up*: "How do you currently gather information for these calls?"
              2. "How important is it for your team to have real-time access to prospect data?"
                  - *Follow-up*: "What tools are you using now to manage this process?"
              3. "How do you measure the success of your sales calls?"
                  - *Follow-up*: "What specific metrics do you track to assess call performance?"
              4. "What role does automation play in your current sales process?"
                  - *Follow-up*: "Have you explored AI-driven solutions before? If so, what was your experience?"
              5. "How do you ensure that your sales team stays informed about prospects’ latest activities?"
                  - *Follow-up*: "Would having an automated tool that consolidates this information be valuable?"
            - **Follow-Up**: After discussing their needs and challenges, suggest setting up a demo of your AI tool to show how it can address specific pain points mentioned during the conversation.
          `
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
