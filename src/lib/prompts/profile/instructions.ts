export const SECTION_REQUIREMENTS = {
  professionalOverview: {
    description:
      'Comprehensive professional background and achievements summary',
    requirements: [
      "Summarize the prospect's overall professional background",
      'Highlight significant projects, key roles, notable achievements, and career milestones',
      'Include hobbies or passions that add depth to their professional persona',
      'Draw insights from both experiences and education history'
    ]
  },
  companyOverview: {
    description: 'Detailed analysis of current role, company, and product fit',
    requirements: [
      'Provide detailed summary of current role within the company',
      'Describe company business, target market, and market position',
      'Include context about recent successes or challenges',
      'Connect company initiatives and market context to product benefits',
      'Identify potential sales opportunities based on company profile'
    ]
  },
  engagementStrategy: {
    description: 'Strategic conversation starters and discovery questions',
    requirements: [
      'Create two product-focused icebreakers relevant to role/industry',
      'Design five strategic questions to uncover pain points',
      'Ensure questions reveal challenges the product can address',
      'Focus on sparking curiosity about potential issues/opportunities'
    ]
  }
} as const;

export const CORE_REQUIREMENTS = {
  researchIntegration:
    'Combine LinkedIn data with supplementary external research (industry reports, news, company data)',
  actionability:
    'Ensure profile is coherent, actionable, and directly applicable for sales outreach',
  professionalism:
    'Use clear, concise language and maintain professional tone throughout',
  validation: 'Cross-reference and verify all information for accuracy'
} as const;

export const OUTPUT_REQUIREMENTS = [
  'Return response as valid JSON object',
  'Include required keys: professionalOverview, companyOverview, engagementStrategy',
  'Ensure all nested fields are properly formatted',
  'Maintain consistent data structure'
] as const;
