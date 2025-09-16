import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.error("API_KEY environment variable not set. The application will not work.");
}

export function createChatSession(systemInstruction: string): Chat | null {
  if (!ai) {
    return null;
  }
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: { thinkingBudget: 0 }, // Prioriza baixa latência
    },
  });
}
