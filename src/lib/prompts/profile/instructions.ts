export const CORE_REQUIREMENTS = {
  hidden_reasoning: 'Internal reasoning only, no explanations in output.',
  continuous_verification: {
    min_sources: 4,
    preferred_sources: ['LinkedIn', 'Company websites', 'News sources'],
    description: 'Verify data from reputable sources for name, role and company.'
  },
  recency: {
    max_years: 3,
    description: 'Use recent information unless historical context needed.'
  },
  relevance: 'Focus on role and company-relevant details.',
  clarity: 'Structured output only.'
} as const;

export const EXECUTION_RULES = [
  'Include citations in dedicated citations field.',
  'Use empty string or array for unavailable data.',
  'Cross-check data consistency.'
] as const;

export const FINAL_INSTRUCTIONS = [
  'Output JSON only.',
  'Keep fields empty if data unavailable.'
] as const;
