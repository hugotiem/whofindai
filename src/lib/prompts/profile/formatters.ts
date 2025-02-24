import { SECTIONS } from './sections';
import { TEMPLATES } from './templates';
import { ProfileData } from '@/app/api/completion/prompt';
export function formatProfilePrompt(
  name: string,
  company: string,
  product?: string,
  linkedinUrl?: string,
  linkedinProfile?: ProfileData
): string {
  // Build sections
  const formattedSections = Object.entries(SECTIONS)
    .map(([_, section]) => {
      return `${section.title} (REQUIRED)\n${section.points.map((point) => `• ${point}`).join('\n')}`;
    })
    .join('\n\n');

  // Build formatting rules
  const formattedRules = TEMPLATES.FORMATTING_RULES.map(
    (rule) => `• ${rule}`
  ).join('\n');

  const linkedinContext = linkedinUrl
    ? `\nLinkedIn Profile: ${linkedinUrl}`
    : '';

  return `Generate a comprehensive professional profile for ${name} at ${company}${product ? ` regarding ${product}` : ''}.${linkedinContext}

CRITICAL: You MUST provide detailed information for ALL sections. Do not skip any section or provide placeholder content.

Required Sections:
${formattedSections}

Writing Guidelines:
${formattedRules}

Return the information in the exact format specified in RESPONSE_FORMAT.

IMPORTANT:
• Write content in natural paragraphs
• Provide substantial, meaningful content for each field
• Do not skip any required fields
• Do not use placeholder text
• Ensure all information is accurate and professional
• Cross-verify information from multiple sources
${linkedinUrl ? '• Use LinkedIn profile as primary source when available' : ''}`;
}
