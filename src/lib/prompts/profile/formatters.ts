import { ProfileData } from '@/app/api/completion/prompt';
import { SECTION_REQUIREMENTS } from './instructions';
// import { TEMPLATES } from './templates';

export function formatProfilePrompt(
  profileData: ProfileData,
  product: string,
  lang: string
): string {
  // Format work experience
  const experienceContext = profileData.experiences?.length
    ? `\nWork Experience:\n${profileData.experiences
        .map(
          (exp) => `• ${exp.occupation} at ${exp.companyName}
  Location: ${exp.location}
  Duration: ${exp.duration ? `${exp.duration.startDate} to ${exp.duration.endDate}` : 'Not specified'}`
        )
        .join('\n')}`
    : '';

  // Format education
  const educationContext = profileData.education?.length
    ? `\nEducation:\n${profileData.education
        .map((edu) => `• ${edu.degree} from ${edu.schoolName}`)
        .join('\n')}`
    : '';

  const inputData = `
Input Variables:
• lang: ${lang}
• fullName: ${profileData.fullName}
• pictureUrl: ${profileData.pictureUrl || 'Not provided'}
• company: ${profileData.company}
• description: ${profileData.description || 'Not provided'}
• currentOccupation: ${profileData.currentOccupation || 'Not provided'}
• headline: ${profileData.headline || 'Not provided'}
• location: ${profileData.location || 'Not provided'}
• product: ${product}${experienceContext}${educationContext}`;

  const sections = Object.entries(SECTION_REQUIREMENTS)
    .map(([section, { description, requirements }]) => {
      return `${section}:\n${description}\n${requirements.map((req) => `• ${req}`).join('\n')}`;
    })
    .join('\n\n');

  return `Generate a comprehensive sales profile for ${profileData.fullName} at ${profileData.company} regarding ${product} in ${lang}.

${inputData}

Required Sections:
${sections}

Research Requirements:
• When company information is not provided or incomplete:
  - Research the company's business model, market position, and recent developments
  - Look for news articles, press releases, and company website information
  - Analyze industry reports and market trends
  - Investigate competitors and market challenges
  - Find recent company achievements or initiatives

• When education/experience information is limited:
  - Research the mentioned institutions and companies
  - Look for company reviews, culture, and work environment
  - Find information about typical roles and responsibilities in similar positions
  - Research industry standards and common career paths

• For engagement strategy:
  - Research industry-specific challenges and trends
  - Look for recent news or developments in the prospect's industry
  - Investigate common pain points for similar roles/companies
  - Research how similar companies have implemented or benefited from similar products

Additional Guidelines:
• Integrate insights from both LinkedIn data and supplementary external research
• Ensure the profile is coherent, actionable, and directly applicable for sales outreach
• Use clear and concise language, maintaining professional tone throughout
• Cross-reference all research findings for accuracy and relevance
• Prioritize recent information (within the last 2 years when possible)
• The final answer must be a valid JSON object containing the following structure and in the language specified:
{
  "professionalOverview": {
    "background": "string",
    "achievements": ["string"],
    "hobbiesAndPassions": ["string"]
  },
  "companyOverview": {
    "currentRoleSummary": "string",
    "companyDescription": "string",
    "marketPosition": "string",
    "recentDevelopments": "string",
    "productFit": "string"
  },
  "engagementStrategy": {
    "icebreakers": ["string", "string"],
    "strategicQuestions": [
      {
        "question": "string",
        "context": "string"
      }
    ]
  }
}`;
}
