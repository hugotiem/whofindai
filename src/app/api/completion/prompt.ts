export const promptContext =
  "You are an AI assistant helping sales professionals prepare for calls or meetings by creating profiles of prospects. Based on a person's name, company, and the product/service offered, you will generate a structured overview with actionable insights to help guide engagement.";

export const systemPrompt = (
  fullName: string,
  company: string,
  prompt: string,
  lang: string
) => `You are a professional profile generator. Generate a detailed professional profile for the specified person and company.
    Format the response as a valid JSON object with the following structure, ensuring all fields are filled and properly escaped:
    {
        "fullName": "${fullName}",
        "company": "${company}",
        "role": "Job Title",
        "missions": "Key responsibilities, missions and objectives",
        "background": "Professional background, expertise and experience",
        "education": "Educational background, provide a small description of the school/university attended",
        "company_description": "company overview and the branch ${fullName} is working, Main competitors and market position",
        "personality_traits": "Professional personality characteristics and soft skills",
        "communication_insights": "Communication style, preferences and interpersonal approach",
        "country": "Country name",
        "city": "City name",
        "industry": "Industry sector",
        "seo_title": "SEO-friendly title",
        "seo_description": "Brief SEO description",
        "seo_keywords": ["keyword1", "keyword2", "keyword3"]
    }`;

export const userPrompt = (
  fullName: string,
  company: string
  //   prompt: string,
  //   lang: string
) => `
  Generate a professional profile for ${fullName} at ${company}. Return ONLY a valid JSON object, no additional text or formatting.
`;

export interface PromptProps {
  id?: string;
  fullName: string;
  company: string;
  prompt: string;
  lang: string;
}
