export const RESPONSE_FORMAT = {
  full_name: 'Full name of the person',
  company: 'Company name',
  role: 'Current position title',
  country: 'Country of the person',
  city: 'City of the person',
  industry: 'Industry of the person',
  education:
    'Educational background, provide a small description of the school/university attended if available',
  // {
  //   description: 'Educational background, provide a small description of the school/university attended if available',
  //   fields: {
  //     school: 'School name',
  //     degree: 'Degree or certificate',
  //     year: 'Year of graduation',
  //     description: 'Small description of the school/university attended'
  //   }
  // },
  contact_details: {
    description:
      'Attempt to find direct or general contact details (email, phone, LinkedIn). If unavailable, explicitly state that no contact information was found.',
    fields: {
      // full_name: 'Full name of the person',
      email: 'Email address if available',
      phone:
        'Phone number if available. If not available, return an empty string.',
      linkedin: 'LinkedIn profile URL if available'
    }
  },
  ice_breakers:
    'List of two engaging icebreakers based on recent professional achievements, company news, or relevant industry trends related to the given product or service',
  professional_overview: {
    description:
      'Current role and key responsibilities. Brief summary of professional background or milestones. 2–3 personality traits inferred from available information.',
    fields: {
      responsibilities: 'Key responsibilities in current role',
      background: 'Professional background summary',
      personality_traits: 'Array of 2-3 inferred personality traits'
    }
  },
  engagement_insights: {
    description: 'Communication tips and best practices',
    fields: {
      communication_tips: 'Communication tips and best practices',
      key_questions: {
        description:
          'List of 4-5 open-ended questions, along with follow-ups, related to the person and the given product or service. Focus on engaging with the person and identifying any pain points or optimizations that the person may have.',
        fields: {
          question: 'open-ended question',
          follow_up: 'follow-up question'
        }
      }
    }
  },
  company_overview: {
    description:
      'Basic company information, including market focus and industry. Market position, competitors, and relevant recent developments. Key challenges the company may face. 2–3 major industry trends.',
    fields: {
      basic_info: 'Company description and market focus',
      market_position: "Company's position in the market",
      competitors: 'Array of main competitors',
      recent_developments: 'Recent company news or developments',
      challenges: `Key challenges facing the company. Deep dive on challenges company may face regarding the given product or service`,
      industry_trends: 'Array of 2-3 major industry trends'
    }
  },
  personality_and_interests: {
    description:
      'Identify any publicly available details about personal interests, hobbies, or philanthropic activities. If no relevant information is found, explicitly state so.',
    fields: {
      interests: 'Array of professional interests',
      hobbies: 'Array of personal hobbies',
      philanthropy: 'Philanthropic activities and interests'
    }
  }
} as const;
