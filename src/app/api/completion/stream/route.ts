import { client } from '@/lib/openai/client';
import { NextRequest, NextResponse } from 'next/server';

import { remark } from 'remark';
import html from 'remark-html';

export async function POST(request: NextRequest) {
  const { firstName, lastName, service } = await request.json();

  if (!firstName || !lastName || !service) {
    return NextResponse.json(
      { error: 'User question is required' },
      { status: 400 }
    );
  }

  const responseStream = await client.chat.completions.create({
    model: 'llama-3.1-sonar-small-128k-online',
    messages: [
      {
        role: 'system',
        content: `
          Title: Generate a Detailed Client Profile with Engagement Strategy
        `
      },
      {
        role: 'user',
        content: `
          ### Context:

          You are an AI language model designed to assist sales professionals in preparing for meetings by generating detailed profiles of potential clients. Based on a person's name, company, and the product/service offered, you will create a structured overview with actionable insights to help guide engagement during the meeting.

          ### Instructions:

          Using the inputs provided below:

          Person’s Name: ${firstName} ${lastName}
          Company Name: [Insert Company Name]
          Product/Service: ${service}
          Create a detailed profile that includes the following:

          1. Contact Details:
          Full name
          Professional contact details if publicly available, including:
          Business email address
          Office phone number
          Company address
          2. Job Role and Responsibilities:
          Provide the person's current job title and summarize their key responsibilities.
          Clarify if the person is an internal employee or works as an external consultant/freelancer.
          Describe their role within the company structure, including their influence and scope of responsibilities (highlighting key projects if relevant).
          3. Company Overview:
          Summarize the company’s size, annual turnover, geographical presence, and date of establishment.
          Describe the company’s core activities, position in the market, and recent news or developments.
          Provide context on industry trends or competition where relevant.
          4. Role Significance in the Company:
          Assess the significance of the person’s role in relation to the company’s objectives.
          Explain their influence on major initiatives or strategic goals, based on available information.
          Avoid making assumptions; acknowledge if their impact or exact responsibilities are unclear.
          5. Potential Objectives and Pain Points:
          Identify potential challenges or pain points for the person and their department.
          Extend this analysis to the company's broader business needs.
          Suggest how the product/service offered can address these needs, both at the individual and organizational levels.
          6. Professional Insights and Personality Analysis:
          Highlight the person’s professional background, expertise, and any industry involvement (e.g., publications, speaking engagements).
          Based on public information, provide an inferred MBTI or DISC profile, explaining how this insight can inform your communication approach.
          Note: Clearly state that this analysis is an inference and may not be fully accurate without formal assessment.
          7. Communication and Engagement Strategy:
          Offer tailored communication tips, considering their role, responsibilities, and inferred personality profile.
          Recommend areas to focus on during discussions, aligned with their interests and company goals.
          Suggest the most effective communication style to engage with this individual based on their professional profile and inferred personality.
          8. Key Questions for the Meeting:
          Provide 5-7 key questions to uncover the prospect’s needs, priorities, and pain points.
          For each main question, include 2-3 follow-up questions to dive deeper into the topic and encourage dialogue.
          Guidelines:

          Tone: Maintain a professional and respectful tone throughout.

          Length: Aim for a concise but comprehensive output, around 700-900 words.

          Sources: Use only reputable, publicly available sources like company websites, LinkedIn profiles, or news articles.

          Privacy Compliance:

          Do not include private life details or sensitive information.

          Accuracy and Assumptions:

          Present all information honestly, acknowledging gaps where necessary. Avoid overestimating the person’s influence or impact, and clearly mark any inferred personality analysis as such.

          Output Format:

          Use clear section headings for each part.

          Use bullet points for clarity where appropriate.
        `
      }
    ],
    stream: true
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const response of responseStream) {
          if (
            response &&
            response.choices &&
            response.choices[0]?.delta.content
          ) {
            const chunk = response.choices[0].delta.content;
            controller.enqueue(new TextEncoder().encode(chunk || ''));
          }
        }
        controller.close();
      } catch (error) {
        console.error('Streaming error:', error);
        controller.error(error);
      }
    }
  });

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
