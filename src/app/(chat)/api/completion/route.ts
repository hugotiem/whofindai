export const maxDuration = 60; // This function can run for a maximum of 60 seconds

import { NextRequest, NextResponse } from 'next/server';
import { customPrompt, promptContext, PromptProps } from './prompt';
import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';
import { client } from '@/lib/openai/client';

export async function POST(request: NextRequest) {
  const { id, fullName, prompt, company }: PromptProps = await request.json();

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.1-sonar-large-128k-online',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: promptContext
        },
        {
          role: 'user',
          content: customPrompt('Jonathan Ferrebeuf', 'Upfeel', 'AI Tool')
        },
        {
          role: 'assistant',
          content: `Output example (for reference only):
            ## **1. Contact Details**

            - **Full Name**: Jonathan Ferrebeuf
            - **Professional Contact Details**:
                - Email: [jferrebeuf@gmail.com](mailto:jferrebeuf@gmail.com), [jonathan@upfeel.io](mailto:jonathan@upfeel.io), [jonathan@upfeel.com](mailto:jonathan@upfeel.com)
                - Phone Number: +33 6 77 79 61 03
                - Company Address: Upfeel Services, 9 rue Louis David, 75116 Paris, France

            ——

            ## **2. Ice Breakers**

            1. *"I saw that you've been mentoring startups at ESSEC Business School for a while now. How has that experience influenced your leadership approach at Upfeel?"*
            2. *"Upfeel's focus on collective intelligence and emotional intelligence is fascinating, especially in today's hybrid work environment. How do you see AI tools enhancing these team-building experiences?"*

            ——

            ## **3. Professional Overview**

            - **Role and Responsibilities**: Jonathan Ferrebeuf is the CEO & Co-Founder of Upfeel, where he leads the company in delivering innovative team-building experiences and collective coaching programs aimed at improving organizational performance through emotional and collective intelligence. His responsibilities include strategic leadership, business development, and overseeing product innovation.
            - **Background**: Jonathan has a diverse background in entrepreneurship, mentoring startups, and investing in innovative companies. He has been involved in various industries, including marketing, advertising, and technology. In addition to his role at Upfeel, he is a pro bono mentor at the ESSEC Business School's Center for Entrepreneurship & Innovation and an angel investor.
            - **Personality Insights**:
                - *Visionary*: Jonathan's leadership at Upfeel and his involvement with startups suggest that he is highly forward-thinking and passionate about innovation.
                - *Collaborative*: His focus on collective intelligence and team dynamics indicates a strong belief in collaboration and teamwork.
                - *Empathetic*: Given his emphasis on emotional intelligence within teams, it can be inferred that he values understanding others' perspectives.

            *Note: These personality insights are inferred from public information and may not fully capture his personal traits.*

            ——

            ## **4. Company Overview**

            - **Basic Info**:
                - **Upfeel** is based in Paris, France, with a focus on team-building activities, professional seminars, and collective coaching. The company works with over 400 teams across various industries.
                - **Market Position**: Upfeel is recognized for its innovative approach to improving team cohesion through scientifically validated methods that blend fun with practical learning. Their clients include major companies like Google, Bouygues, Clarins, Bayer, and Suez.
            - **Challenges**:
                - With the rise of hybrid work environments, maintaining team cohesion and engagement is a growing challenge for many organizations.
            - **Top Competitors**:
                - Teamway
                - Cohesion Capital
                - Boost Team
            - **How the AI Meeting Tool Can Help**:
                - Upfeel’s focus on collective intelligence could benefit from an AI meeting tool that enhances virtual collaboration by providing real-time insights into team dynamics during online sessions.

            ——

            ## **5. Engagement Strategy**

            - **Communication Tips**:
                - Highlight how AI can complement their existing offerings by enhancing real-time feedback during virtual team-building sessions.
                - Emphasize the potential for scaling their services through AI-driven insights into team performance.
            - **Key Questions**:
                1. *"How do you currently measure the success of your team-building programs?"*
                    - Follow-up: *"What metrics would you like to track more effectively with the help of technology?"*
                2. *"What challenges do you face when conducting virtual or hybrid team-building sessions?"*
                    - Follow-up: *"How do you think AI could help bridge some of these gaps?"*
                3. *"How do you see the role of technology evolving in enhancing collective intelligence within teams?"*
                    - Follow-up: *"Are there specific tech tools you're considering to integrate into your programs?"*
                4. *"What feedback have you received from clients regarding your current virtual offerings?"*
                    - Follow-up: *"Would real-time analytics during meetings improve client satisfaction?"*
                5. *"How does Upfeel differentiate itself from other team-building companies in terms of innovation?"*
                    - Follow-up: *"Could AI tools help further this differentiation by offering unique insights during sessions?"*
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
