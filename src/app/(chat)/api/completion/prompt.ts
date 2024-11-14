export const promptContext =
  "You are an AI assistant helping sales professionals prepare for calls or meetings by creating profiles of prospects. Based on a person's name, company, and the product/service offered, you will generate a structured overview with actionable insights to help guide engagement.";

export const customPrompt = (
  fullName: string,
  company: string,
  prompt: string
) => `
  Generate a Detailed Client Profile with Engagement Strategy

  ### Guidelines:

  - **Tone**: Maintain a professional and respectful tone.
  - **Sources**: Use reputable, publicly available sources such as company websites, LinkedIn, and news articles. Prioritize company and LinkedIn over other social media.
  - **Accuracy**: Present all information honestly, and avoid overestimating the person’s influence. Clearly indicate any inferred personality analysis.
  - **Efficiency**: Provide the most concise yet informative response.
  - **Output Format**:
      - Use clear section headings:
          - Contact Details
          - Professional Overview
          - Company Overview
          - Engagement Strategy
      - Separate sections with "—-"
      - Return only the specified parts without intro or conclusion

  ### Instructions:

  Using the inputs provided:

  - **Person’s Name**: ${fullName}
  - **Company Name**: ${company}
  - **Product/Service Offered**: ${prompt}

  Generate a detailed profile including the following:

  **1. Contact Details**

  - Full name
  - Professional contact details (business email, phone numbers, company address) if publicly available. If no publicly available mention it as it is.

  ---

  **2. Professional Overview**

  - **Role and Responsibilities**: Current job title and summary of key responsibilities. Clarify if internal or external (e.g., consultant).
  - **Background**: Highlight professional background, expertise, and involvement in industry activities.
  - **Personality Insights** (optional): Provide a brief, inferred personality type (MBTI/DISC) based on public info, with a disclaimer about its limitations.

  ---

  **3. Company Overview**

  - **Basic Info**: Company size, annual turnover, geographical presence, date of establishment.
  - **Market Position**: Core activities, position in the market, recent news or developments, list of the 3 main competitors
  - **Challenges**: Identify potential challenges for the company or individual, and suggest how the offered product/service might address these.

  ---

  **4. Engagement Strategy**

  - **Communication Tips**: Recommend key areas to focus on during the conversation. Suggest an effective communication style.
  - **Key Questions**: Provide 5-7 key questions to understand the prospect's needs and priorities. If the conversation goes well, add questions around budget, timing, competitors, and decision makers.
  - **Follow-Up**: Include 1 follow-up question for each key question to help dive deeper into the topic.
`;

export interface PromptProps {
  id: string;
  fullName: string;
  company: string;
  prompt: string;
}

// export const openai = createOpenAI({
//   baseURL: process.env.PERPLEXITY_BASE_URL
// });
