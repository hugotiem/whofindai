export interface ProfileResponseSchema {
  full_name: string;
  company: string;
  role: string;
  education: string;
  country: string;
  city: string;
  industry: string;
  // seo_title: string;
  // seo_description: string;
  // seo_keywords: string[];
  contact_details: {
    email: string;
    phone: string;
    linkedin: string;
  };
  ice_breakers: string[];
  professional_overview: {
    // role: string;
    responsibilities: string;
    background: string;
    personality_traits: string[];
  };
  engagement_insights: {
    communication_tips: string;
    key_questions: { question: string; follow_up: string }[];
  };
  company_overview: {
    basic_info: string;
    market_position: string;
    competitors: string[];
    recent_developments: string;
    challenges: string;
    industry_trends: string[];
  };
  personality_and_interests: {
    interests: string[];
    hobbies: string[];
    philanthropy: string;
  };
}

export type CitationSection = {
  citations: string[];
  [key: string]: any;
};
