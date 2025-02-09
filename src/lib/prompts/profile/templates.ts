export const TEMPLATES = {
  FORMATTING_RULES: [
    'Use bullet points for clarity',
    'Start each highlight with a strong action verb',
    'Include specific metrics and numbers',
    'Keep highlights concise (10-15 words max)',
    'Focus on quantifiable achievements',
    'Use industry-specific terminology',
    'Highlight scope of responsibility'
  ],

  HIGHLIGHT_CATEGORIES: [
    'Leadership & Team Management',
    'Budget & Financial Impact',
    'Project Delivery & Success',
    'Innovation & Technical Achievement',
    'Business Growth & Revenue',
    'Client Relations & Satisfaction',
    'Process Improvement & Efficiency'
  ],

  // Maintain existing schema structure
  RESPONSE_FORMAT: {
    full_name: 'Full name',
    company: 'Company name',
    role: 'Current position',
    country: 'Country',
    city: 'City',
    industry: 'Industry',
    education: 'Education background',
    contact_details: {
      email: 'Email if available',
      phone: 'Phone if available',
      linkedin: 'LinkedIn URL'
    },
    ice_breakers: 'Two relevant conversation starters',
    professional_overview: {
      responsibilities: 'Key responsibilities',
      background: 'Professional background',
      personality_traits: 'Key traits'
    },
    engagement_insights: {
      communication_tips: 'Communication best practices',
      key_questions: {
        question: 'Main question',
        follow_up: 'Follow-up'
      }
    },
    company_overview: {
      basic_info: 'Company description',
      market_position: 'Market position',
      competitors: 'Main competitors',
      recent_developments: 'Recent news',
      challenges: 'Key challenges',
      industry_trends: 'Major trends'
    },
    personality_and_interests: {
      interests: 'Professional interests',
      hobbies: 'Personal hobbies',
      philanthropy: 'Philanthropic activities'
    }
  }
};
