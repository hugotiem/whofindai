export const CORE_REQUIREMENTS = {
  hidden_reasoning:
    'Perform all reasoning and verification internally; do not display any explanations or thought processes in the final response.',
  continuous_verification: {
    min_sources: 8,
    preferred_sources: [
      'LinkedIn',
      'Official company websites',
      'Verified news sources',
      'Corporate registries'
    ],
    description:
      "Ensure accuracy by sourcing data from at least 8 reputable sources whenever possible. Ensure that the sources are relevant to the person's first and last name, role and company."
  },
  recency: {
    max_years: 3,
    exception: 'historical context',
    description:
      'Use only information from the last 3 years unless historical context is essential.'
  },
  relevance:
    "Focus exclusively on details pertinent to the person's role and their company.",
  clarity: 'Provide structured, precise outputs without redundant explanations.'
} as const;

export const EXECUTION_RULES = [
  "Citations must be included for all retrieved information. Each section has a dedicated 'citations': [] field where source URLs should be stored.",
  'If information is unavailable, return an empty string ("") or an empty array ([]) rather than speculative content.',
  'No reasoning steps or explanations should appear in the final output.',
  'Ensure coherence by cross-checking data consistency across sections before finalizing.'
] as const;

export const FINAL_INSTRUCTIONS = [
  'Generate the final structured profile strictly in JSON—do not include any preamble, notes, or explanations.',
  'If any essential information is missing, ensure the respective fields remain blank or empty.',
  'Maintain a professional yet engaging and user-friendly tone in the generated content.'
] as const;
