import { createOpenAI } from "@ai-sdk/openai";

export const promptContext =
  "You are an AI sales executive assistant designed to assist sales professionals in preparing for meetings by generating detailed profiles of prospects or potential clients. Based on a person's name, company, and the product/service offered by the sales professional, you will create a structured overview with actionable insights to help the user to know how to guide engagement during the meeting with the person.";

export const customPrompt = (
  fullName: string,
  company: string,
  service: string
) => `
  Generate a Detailed Client Profile with Engagement Strategy

  ### Guidelines:

  - Tone: Maintain a professional and respectful tone throughout.
  - Sources: Use only reputable, publicly available sources like company websites, LinkedIn profiles, social medias and news articles.
  - Privacy Compliance: Do not include private life details.
  - Accuracy and Assumptions: Present all information honestly, acknowledging gaps where necessary. Avoid overestimating the person’s influence or impact, and clearly mark any inferred personality analysis as such.
  - If you find differing information on the same topic, use only the most recent one. For example, if you encounter two company addresses, select the more recent address as accurate.

  ### Instructions:

  Using the inputs provided below:

  Person’s Name: ${fullName}
  Company Name: ${company}
  Product/Service offered by the sales professional (user of this prompt): ${service}

  Create a detailed profile that includes the following:
`;

export interface PromptProps {
  id: string;
  fullName: string;
  company: string;
  prompt: string;
}

export const openai = createOpenAI({
  baseURL: process.env.PERPLEXITY_BASE_URL
});