import { CORE_REQUIREMENTS, EXECUTION_RULES, FINAL_INSTRUCTIONS } from './instructions';
import { RESPONSE_FORMAT } from './format';
import type { ProfileResponseSchema } from './schema';

export class ProfilePromptBuilder {
  private static buildSystemMessage(): string {
    return "You are an AI assistant helping sales professionals prepare for calls or meetings by creating structured prospect profiles. Your role is to generate clear, actionable insights based on the provided inputs: a person's name and their company and a product or service.";
  }

  private static buildCoreRequirements(): string {
    return Object.entries(CORE_REQUIREMENTS)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `• ${key}: ${value}`;
        }
        if ('description' in value) {
          return `• ${key}: ${value.description}`;
        }
        return `• ${key}: ${JSON.stringify(value)}`;
      })
      .join('\n');
  }

  private static buildResponseFormat(): string {
    return JSON.stringify({ response_structure: RESPONSE_FORMAT }, null, 2);
  }

  private static buildExecutionRules(): string {
    return EXECUTION_RULES.map(rule => `• ${rule}`).join('\n');
  }

  private static buildFinalInstructions(): string {
    return FINAL_INSTRUCTIONS.map(instruction => `• ${instruction}`).join('\n');
  }

  static buildPrompt(language: string = 'english'): string {
    const sections = [
      "System Message:",
      this.buildSystemMessage(),
      "",
      "Core Requirements:",
      this.buildCoreRequirements(),
      "",
      "Response Format (JSON):",
      this.buildResponseFormat(),
      "",
      "Execution Rules:",
      this.buildExecutionRules(),
      "",
      "Final Instructions:",
      this.buildFinalInstructions(),
      "",
      `Language: ${language}`
    ];

    return sections.join('\n');
  }
}

export type { ProfileResponseSchema };
export { RESPONSE_FORMAT, CORE_REQUIREMENTS, EXECUTION_RULES, FINAL_INSTRUCTIONS };
