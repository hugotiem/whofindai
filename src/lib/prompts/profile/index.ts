import { CORE_REQUIREMENTS, EXECUTION_RULES, FINAL_INSTRUCTIONS } from './instructions';
import { RESPONSE_FORMAT } from './format';
import type { ProfileResponseSchema } from './schema';

export class ProfilePromptBuilder {
  private static buildSystemMessage(): string {
    return "AI assistant generating structured prospect profiles for sales professionals. Create insights based on person's name, company, and product/service.";
  }

  private static buildCoreRequirements(): string {
    return Object.entries(CORE_REQUIREMENTS)
      .map(([key, value]) => {
        if (typeof value === 'string') return value;
        if ('description' in value) return value.description;
        return JSON.stringify(value);
      })
      .join('. ');
  }

  private static buildResponseFormat(): string {
    return JSON.stringify({ format: RESPONSE_FORMAT }, null, 0);
  }

  static buildPrompt(language: string = 'english'): string {
    return [
      this.buildSystemMessage(),
      'Requirements:',
      this.buildCoreRequirements(),
      'Format:',
      this.buildResponseFormat(),
      'Rules:',
      EXECUTION_RULES.join('. '),
      FINAL_INSTRUCTIONS.join('. '),
      `Language: ${language}`
    ].join('\n');
  }
}

export type { ProfileResponseSchema };
export { RESPONSE_FORMAT, CORE_REQUIREMENTS, EXECUTION_RULES, FINAL_INSTRUCTIONS };
