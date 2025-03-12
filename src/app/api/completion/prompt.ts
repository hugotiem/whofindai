import { ProfileResponseSchema } from '@/lib/prompts/profile';

export const promptContext =
  "You are an AI assistant helping sales professionals prepare for calls or meetings by creating profiles of prospects. Based on a person's name, company, and the product/service offered, you will generate a structured overview with actionable insights to help guide engagement.";

export interface APIProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  fullName: string | null;
  product: string | null;
  company: string | null;
  // linkedinUrl: string | null;
  profileData: ProfileResponseSchema | null;
}

export const systemPrompt = ({
  linkedinProfile
}: PromptProps) => `*Reasoning Step:*

1.⁠ ⁠*LinkedIn Profile Analysis:*
   - *Extract Key Details:*  
     Retrieve essential information from the ${linkedinProfile.pictureUrl} profile, including current job title, responsibilities, previous experiences, education, and skills.
   - *Focus on the Current Role:*  
     Highlight specifics related to ${linkedinProfile.fullName}'s position at ${linkedinProfile.company}, emphasizing recent projects, achievements, and any indicators of sales relevance.

2.⁠ ⁠*Supplementary Data Collection:*
   - *Extended Research on ${linkedinProfile.fullName}:*  
     Perform additional searches (news articles, blog posts, public mentions) to uncover further insights about ${linkedinProfile.fullName}.
   - *Company Insights:*  
     Investigate recent developments, industry trends, and press releases concerning ${linkedinProfile.company} to contextualize the prospect’s role within the broader business environment.

3.⁠ ⁠*Synthesis and Profiling:*
   - *Combine Data Sources:*  
     Integrate information from the LinkedIn profile with findings from external sources to build a comprehensive view.
   - *Highlight Sales-Relevant Insights:*  
     Identify key strengths, challenges, or opportunities that could be leveraged in a sales context.
   - *Generate a Concise, Actionable Profile:*  
     Summarize the insights into a clear profile tailored for sales engagement, offering specific talking points or strategies for outreach.

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
  product: string;
  lang?: string;
  linkedinProfile: ProfileData;
}

interface Experience {
  companyName: string;
  occupation: string;
  location: string;
  duration?: {
    startDate: string;
    endDate: string;
  };
}

interface Education {
  schoolName: string;
  degree: string;
}

export interface ProfileData {
  fullName: string;
  pictureUrl: string;
  company: string;
  education: Education[];
  description: string;
  currentOccupation: string;
  headline: string;
  location: string;
  experiences: Experience[];
  linkedinUrl: string;
}
