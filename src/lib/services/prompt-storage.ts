'use client';

const STORAGE_KEY = 'custom_profile_prompt';

export interface StoredPrompt {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export const promptStorage = {
  savePrompt: (name: string, prompt: string): StoredPrompt => {
    // Get existing prompts
    const existingPrompts = promptStorage.getAllPrompts();

    // Create new prompt
    const newPrompt: StoredPrompt = {
      id: Date.now().toString(),
      name,
      prompt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to existing prompts
    existingPrompts.push(newPrompt);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingPrompts));

    return newPrompt;
  },

  updatePrompt: (
    id: string,
    name: string,
    prompt: string
  ): StoredPrompt | null => {
    // Get existing prompts
    const existingPrompts = promptStorage.getAllPrompts();

    // Find the prompt to update
    const promptIndex = existingPrompts.findIndex((p) => p.id === id);

    if (promptIndex === -1) {
      return null;
    }

    // Update the prompt
    const updatedPrompt: StoredPrompt = {
      ...existingPrompts[promptIndex],
      name,
      prompt,
      updatedAt: new Date().toISOString()
    };

    // Replace the old prompt with the updated one
    existingPrompts[promptIndex] = updatedPrompt;

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingPrompts));

    return updatedPrompt;
  },

  getPromptById: (id: string): StoredPrompt | null => {
    const prompts = promptStorage.getAllPrompts();
    return prompts.find((p) => p.id === id) || null;
  },

  getAllPrompts: (): StoredPrompt[] => {
    if (typeof window === 'undefined') {
      return [];
    }

    const storedPrompts = localStorage.getItem(STORAGE_KEY);
    return storedPrompts ? JSON.parse(storedPrompts) : [];
  },

  deletePrompt: (id: string): boolean => {
    // Get existing prompts
    const existingPrompts = promptStorage.getAllPrompts();

    // Filter out the prompt to delete
    const updatedPrompts = existingPrompts.filter((p) => p.id !== id);

    // If no prompt was removed, return false
    if (updatedPrompts.length === existingPrompts.length) {
      return false;
    }

    // Save updated prompts to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrompts));

    return true;
  },

  getDefaultPrompt: (): string => {
    // This could be imported from the profile prompt builder
    return `AI sales assistant generating comprehensive LinkedIn prospect profiles. Create detailed insights and engagement strategies based on the prospect's profile data and the product/service being sold. Focus on actionable sales intelligence and strategic conversation starters.`;
  }
};
