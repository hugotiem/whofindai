export const maxDuration = 30; // This function can run for a maximum of 30 seconds

import { NextRequest, NextResponse } from 'next/server';
import { promptContext, PromptProps } from './prompt';
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
          content: `
            ### Guidelines:

            - Tone: Maintain a professional and respectful tone throughout.
            - Sources: Use only reputable, publicly available sources like company websites, LinkedIn profiles, social medias and news articles.
            - Privacy Compliance: Do not include private life details.
            - Accuracy and Assumptions: Present all information honestly, acknowledging gaps where necessary. Avoid overestimating the person’s influence or impact, and clearly mark any inferred personality analysis as such.
            - If you find differing information on the same topic, use only the most recent one. For example, if you encounter two company addresses, select the more recent address as accurate.
            - Output Format:
                - Use clear section headings for each part.
                    - The contact
                    - The company
                    - Executive insights
                - Use monthly plain text and give as much details as possible

            ### Instructions:

            Using the inputs provided below:

            Person’s Name: ${fullName}
            Company Name: ${company}
            Product/Service offered by the sales professional (user of this prompt):  ${prompt}

            Create a detailed profile that includes the following:

            1. The Person
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
            2. The company
                1. Company Overview:
                Summarize the company’s size, annual turnover, geographical presence, and date of establishment.
                Describe the company’s core activities, position in the market, and recent news or developments.
                Provide context on industry trends or competition where relevant.
                2. Potential Objectives and Pain Points:
                    1. Identify potential challenges or pain points for the person and their department.
                    2. Extend this analysis to the company's broader business needs.
                    3. Suggest how the product/service offered can address these needs, both at the individual and organizational levels.
            3. How to prepare my meeting 
                1. Communication and Engagement Strategy:
                Offer tailored communication tips, considering their role, responsibilities, and inferred personality profile.
                Recommend areas to focus on during discussions, aligned with their interests and company goals.
                Suggest the most effective communication style to engage with this individual based on their professional profile and inferred personality.
                2. Key Questions for the Meeting:
                Provide 5-7 key questions to uncover the prospect’s needs, priorities, and pain points regarding the product and service we are selling. 
                3. Not only, you can also try to find questions around need, pain, budget, timing, competitors and decision maker. 
                4. For each main question, include 2-3 follow-up questions to dive deeper into the topic and encourage dialogue.
            `
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

      const { uid } = await adminAuth.verifySessionCookie(session);

      await adminDb.collection('profiles').doc(id).set({
        fullName,
        company,
        content,
        userId: uid,
        createdAt: admin.firestore.Timestamp.now()
      });
      return NextResponse.json({ completion: content });
    }
    throw Error('response.choices is empty or undefined');
  } catch (e) {
    console.error('API error', e);
    return NextResponse.json({ error: e });
  }
}
