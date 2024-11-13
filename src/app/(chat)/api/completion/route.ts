export const maxDuration = 60; // This function can run for a maximum of 30 seconds

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
            - Linkedin to build the profile
            - Accuracy and Assumptions: Present all information honestly, acknowledging gaps where necessary. Avoid overestimating the person’s influence or impact, and clearly mark any inferred personality analysis as such.
            - If you find differing information on the same topic, use only the most recent one. For example, if you encounter two company addresses, select the more recent address as accurate.
            - Output Format:
                - Return the most structured answer possible
                - Use clear section headings for each part.
                    - Contact details
                    - The person
                    - The company
                    - Insights on how to conduct my interaction
                - Give as much details as possible
                - Return only the answer without intro nor conclusion

            ### Instructions:

            Using the inputs provided below:

            Person’s Name: ${fullName}
            Company Name: ${company}
            Product/Service offered by the sales professional (user of this prompt): ${prompt}

            Create a detailed profile that includes the following:

            1. The Person
                1. Contact Details (show all of them even if it’s empty):
                Full name
                Professional contact details if publicly available, including:
                Business email address
                Mobile phone number
                Company phone number 
                Company address
                2. Professional Insights and Personality Analysis:
                Highlight the person’s professional background, expertise, and any industry involvement (e.g., publications, speaking engagements).
                Based on public information, generate an inferred and detailed MBTI or DISC profile. And explain what the profile is.
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
            3. Insight on how to conduct my interaction
                1. Communication and Engagement Strategy:
                Recommend areas to focus on during discussions, aligned with their interests and company goals.
                Suggest the most effective communication style to engage with this individual based on their professional profile and inferred personality.
                2. Key Questions for the Meeting:
                Provide 5-7 key open questions to uncover the prospect’s needs, priorities, and pain points regarding the product and service we are selling. If conversation goes well add more questions around budget, timing, competitors and decision maker. 
                3. For each main question, include 3-4 follow-up open questions to dive deeper into the topic and encourage dialogue.
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

      try {
        const { uid } = await adminAuth.verifySessionCookie(session);
        await adminDb.collection('profiles').doc(id).set({
          fullName,
          company,
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
