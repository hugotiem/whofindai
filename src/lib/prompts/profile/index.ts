import {
  CORE_REQUIREMENTS,
  SECTION_REQUIREMENTS,
  OUTPUT_REQUIREMENTS
} from './instructions';
import { TEMPLATES } from './templates';
import type { ProfileResponseSchema } from './schema';

export class ProfilePromptBuilder {
  private static buildSystemMessage(): string {
    return `AI sales assistant generating comprehensive LinkedIn prospect profiles. Create detailed insights and engagement strategies based on the prospect's profile data and the product/service being sold. Focus on actionable sales intelligence and strategic conversation starters.`;
  }

  private static buildSectionRequirements(): string {
    return Object.entries(SECTION_REQUIREMENTS)
      .map(
        ([section, { description, requirements }]) =>
          `${section}:\n${description}\n- ${requirements.join('\n- ')}`
      )
      .join('\n\n');
  }

  private static buildCoreRequirements(): string {
    return Object.entries(CORE_REQUIREMENTS)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  private static buildResponseFormat(): string {
    return JSON.stringify(
      {
        format: TEMPLATES.RESPONSE_FORMAT,
        formatting: TEMPLATES.FORMATTING_GUIDELINES,
        analysis: TEMPLATES.ANALYSIS_CATEGORIES
      },
      null,
      2
    );
  }

  static buildPrompt(language: string = 'english'): string {
    return [
      this.buildSystemMessage(),
      '\nSection Requirements:',
      this.buildSectionRequirements(),
      '\nCore Requirements:',
      this.buildCoreRequirements(),
      '\nOutput Format:',
      this.buildResponseFormat(),
      '\nOutput Rules:',
      OUTPUT_REQUIREMENTS.join('\n'),
      `\nLanguage: ${language}`
    ].join('\n');
  }
}

export type { ProfileResponseSchema };
export {
  TEMPLATES,
  CORE_REQUIREMENTS,
  SECTION_REQUIREMENTS,
  OUTPUT_REQUIREMENTS
};
