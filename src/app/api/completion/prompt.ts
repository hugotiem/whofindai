import { ProfileResponseSchema } from "@/lib/prompts/profile";

export const promptContext =
  "You are an AI assistant helping sales professionals prepare for calls or meetings by creating profiles of prospects. Based on a person's name, company, and the product/service offered, you will generate a structured overview with actionable insights to help guide engagement.";

export interface APIProfile extends ProfileResponseSchema {
  id: string;
  userId: string;
  created_at: string;
  updated_at: string;
  prompt: string;
  citations: {
    url: string;
    title: string;
    favicon: string;
  }[];
}

export const systemPrompt = ({
  fullName,
  company,
  linkedinUrl
}: PromptProps) => `You are a professional profile generator. Generate a detailed professional profile for the specified person and company.

    Format the response as a valid JSON object with the following structure, ensuring all fields are filled and properly escaped:
    {
        "fullName": "${fullName}",
        "company": "${company}",
        "role": "Job Title",
        "email": "Email address. If not available, return an empty string.",
        "phone": "Phone number. Ensure the phone number is valid and accessible. If not available, return an empty string.",
        "linkedin": "LinkedIn profile URL. If not available, return an empty string. Ensure the URL is valid and accessible.",
        "twitter": "Twitter profile URL. If not available, return an empty string. Ensure the URL is valid and accessible.",
        "ice_breaker": "List of ice breaker questions",
        "professional_overview": {
          "role_and_responsibilities": "Role and responsibilities",
          "background": "Professional background, expertise and experience. If not available, return an empty string.",
          "personality_traits": "Professional personality characteristics and soft skills",
        }
        "company_overview": {
          "basic_info": "Basic information about the company ${company}",
          "market_position": "Main competitors and market position",
          "challenges": "Challenges and opportunities",
          "industry_trends": "Industry trends and future outlook",
        }
        "engagement_insights": {
          "communication_tips": "Communication tips and best practices",
          "key_questions": "List of 4-5 open-ended questions, along with follow-ups, related to ${fullName}. Focus on engaging with the person and identifying any pain points or optimizations that ${fullName} may have.",
        }
        "missions": "short description in one sentence of Key responsibilities, missions and objectives",
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
    }
`;

// In a second part, verify that the infos are valid by looking LinkedIn profile and all links from this page. Here is the Edouard Tiem's Linkedin Profile : ${linkedinUrl}`

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
  prompt?: string;
  lang?: string;
  linkedinUrl?: string;
}
