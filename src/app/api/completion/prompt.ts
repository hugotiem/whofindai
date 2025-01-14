export const promptContext =
  "You are an AI assistant helping sales professionals prepare for calls or meetings by creating profiles of prospects. Based on a person's name, company, and the product/service offered, you will generate a structured overview with actionable insights to help guide engagement.";

export interface APIProfile {
  id: string;
  userId: string;
  created_at: string;
  updated_at: string;
  fullName: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  ice_breaker: string[];
  professional_overview: {
    role_and_responsibilities: string;
    background: string;
    personality_traits: string;
  };
  company_overview: {
    basic_info: string;
    market_position: string;
    challenges: string;
    industry_trends: string;
  };
  engagement_insights: {
    communication_tips: string;
    key_questions: string[];
  };
  missions: string;
  background: string;
  education: string;
  company_description: string;
  personality_traits: string;
  communication_insights: string;
  country: string;
  city: string;
  industry: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}

export const systemPrompt = (
  fullName: string,
  company: string,
  //   prompt: string
  //   lang: string
) => `You are a professional profile generator. Generate a detailed professional profile for the specified person and company.
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
