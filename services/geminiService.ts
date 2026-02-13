import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a cute, short romantic note or poem.
 */
export const generateLoveNote = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Write a very short, cute, and witty 4-line poem for a girlfriend who just agreed to be my valentine. Use emojis. Make it sweet and heartwarming.",
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "Roses are red, violets are blue, I'm so happy I chose you! 💖";
  } catch (error) {
    console.error("Failed to generate love note:", error);
    return "Even if the AI fails, my love for you never will! You're the best! 💖";
  }
};
