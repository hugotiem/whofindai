export const promptContext =
  "You are an AI assistant helping sales professionals prepare for calls or meetings by creating profiles of prospects. Based on a person's name, company, and the product/service offered, you will generate a structured overview with actionable insights to help guide engagement.";

export const customPrompt = (
  fullName: string,
  company: string,
  prompt: string
) => `
  ### **Title**:

  Generate a Detailed Client Profile with Engagement Strategy for ${fullName} at ${company}

  ### **Guidelines**:

  1. **Approach**: Use a logical sequence to derive insights:
      - Start by analyzing the inputs provided (Name, Company, Product/Service).
      - Search for relevant public information from reputable sources.
      - **Prioritize LinkedIn, official company websites, and verified news outlets** as primary sources for information.
      - Use at least **8 sources** to gather comprehensive insights whenever possible. If fewer than 8 credible sources are available, proceed with fewer, prioritizing depth and relevance.
      - **Separate each section of the response with a markdown line ("---") for clarity and structure.**
  2. **Tone**: Maintain professionalism and respect throughout the response.
  3. **Sources**:
      - Use reputable sources but **do not include citations** in the response.
      - Focus on accuracy and consistency rather than listing the origin of data.
  4. **Accuracy**:
      - Focus on details specific to the prospect’s branch or location, unless the global entity is more relevant.
      - Clearly label any inferred insights (e.g., personality traits) as "Inferred:" or "Possible:". Provide appropriate disclaimers for inferred analysis.
      - Include only information current within the **last 5 years**, unless historical context is crucial.
  5. **Relevance**:
      - Focus on information directly related to the person's role, company, and the product/service being offered.
      - Exclude irrelevant personal details or outdated information.
  6. **Completeness**:
      - If information for a section is unavailable, state: "No publicly available information found for this section."
  7. **Efficiency**:
      - Use concise, structured outputs without redundant explanations.
      - **Ensure sections are separated with a markdown line ("---").**

  ---

  ### **Instructions**:

  Using the inputs provided:

  - **Person’s Name**: ${fullName}
  - **Company Name**: ${company}
  - **Product/Service Offered by the sales professional**: ${prompt}

  Generate a detailed profile including the following, and **separate each part with a markdown line ("---")**:

  ---

  ### **1. Contact Details**

  - **Process**: Search for the individual’s publicly available professional contact details (email, phone number, office address). If unavailable, clearly state: "No publicly available contact details found."
  - **Output**: Present full name and contact details concisely. **Separate this section from others using "---".**

  ---

  ### **2. Ice Breakers**

  - **Process**:
      - Identify relevant points from the prospect’s professional background, achievements, or company context.
      - Use recent company news, industry trends, or updates tied to the product/service offered.
  - **Output**: Provide 2 engaging and context-specific ice breakers designed to start a smooth, natural conversation. **Separate this section from others using "---".**

  ---

  ### **3. Professional Overview**

  - **Process**:
      1. Search for the prospect’s current job title and responsibilities.
      2. Summarize their professional background and industry expertise.
      3. Identify inferred personality traits based on their public presence (e.g., LinkedIn activity, media coverage).
  - **Output**:
      - **Role and Responsibilities**: Briefly describe the individual’s role and core duties.
      - **Background**: Highlight key professional milestones.
      - **Personality Insights**: Provide 2-3 inferred traits with a disclaimer, e.g., “Based on public information, [Person’s Name] appears to be [Trait 1], [Trait 2].”
      - **Separate this section from others using "---".**

  ---

  ### **4. Company Overview**

  - **Process**:
      1. Analyze branch-specific details (size, location, market focus).
      2. Research the company’s market position, competitors, and recent developments.
      3. Identify challenges that align with the offered product/service.
      4. Include 2-3 relevant industry trends affecting the company and its market.
  - **Output**:
      - **Basic Info**: Overview of the company’s branch.
      - **Market Position**: Key activities, competitors, and market standing.
      - **Challenges**: Potential challenges and how the product/service might address them.
      - **Industry Trends**: Highlight 2-3 key industry trends relevant to the company’s context.
      - **Separate this section from others using "---".**

  ---

  ### **5. Engagement Strategy**

  - **Process**:
      1. Tailor communication tips based on inferred personality and role.
      2. Craft questions aligned with the person’s challenges, company position, and potential needs.
      3. Include follow-up questions to deepen the conversation.
  - **Output**:
      - **Communication Tips**: Recommendations for approaching the conversation.
      - **Key Questions**: Provide 5-7 open-ended questions, including follow-up prompts for deeper insights. Ensure the questions directly relate to the person’s role and the product/service.
      - **Separate this section from others using "---".**

  ---

  ### **Execution Notes**:

  1. **Enforcing Minimum Sources**: Use Perplexity to search for at least **8 sources** whenever possible. If fewer sources are available, prioritize credibility and timeliness over quantity.
  2. **Final Refinement**: Validate the output internally for completeness, accuracy, and relevance. Do not display this refinement step in the final response.
  3. **Section Separation**: Ensure each section is separated by "---" for clarity in the final output.
`;

export interface PromptProps {
  id: string;
  fullName: string;
  company: string;
  prompt: string;
}
