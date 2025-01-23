export const RESPONSE_FORMAT = {
  full_name: 'Full name',
  company: 'Company name',
  role: 'Current position',
  country: 'Country',
  city: 'City',
  industry: 'Industry',
  education: 'Education background',
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
      email: 'Email if available',
      phone: 'Phone if available',
      linkedin: 'LinkedIn URL'
    }
  },
  ice_breakers: 'Two relevant conversation starters',
  professional_overview: {
    description:
      'Current role and key responsibilities. Brief summary of professional background or milestones. 2–3 personality traits inferred from available information.',
    fields: {
      responsibilities: 'Key responsibilities',
      background: 'Professional background',
      personality_traits: 'Key traits'
    }
  },
  engagement_insights: {
    description: 'Communication tips and best practices',
    fields: {
      communication_tips: 'Communication best practices',
      key_questions: {
        description:
          'List of 4-5 open-ended questions, along with follow-ups, related to the person and the given product or service. Focus on engaging with the person and identifying any pain points or optimizations that the person may have.',
        fields: {
          question: 'Main question',
          follow_up: 'Follow-up'
        }
      }
    }
  },
  company_overview: {
    description:
      'Basic company information, including market focus and industry. Market position, competitors, and relevant recent developments. Key challenges the company may face. 2–3 major industry trends.',
    fields: {
      basic_info: 'Company description',
      market_position: 'Market position',
      competitors: 'Main competitors',
      recent_developments: 'Recent news',
      challenges: 'Key challenges',
      industry_trends: 'Major trends'
    }
  },
  personality_and_interests: {
    description:
      'Identify any publicly available details about personal interests, hobbies, or philanthropic activities. If no relevant information is found, explicitly state so.',
    fields: {
      interests: 'Professional interests',
      hobbies: 'Personal hobbies',
      philanthropy: 'Philanthropic activities'
    }
  }
} as const;
