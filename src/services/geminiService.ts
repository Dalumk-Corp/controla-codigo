
import { GoogleGenAI } from "@google/genai";

// Use recommended models and initialize inside each call for up-to-date key access
export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "Error: Unable to analyze the image.";
  }
};

export const performGroundedSearch = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter(Boolean)
      .map((web: any) => ({ uri: web.uri, title: web.title }))
      .filter((source: { uri: string }, index: number, self: { uri: string }[]) => index === self.findIndex(s => s.uri === source.uri));

    return {
      text: response.text,
      sources,
    };
  } catch (error) {
    console.error("Error with grounded search:", error);
    return {
      text: "Error: Unable to perform the search.",
      sources: [],
    };
  }
};

export const executeComplexQuery = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error with complex query:", error);
    return "Error: Unable to process the complex query.";
  }
};
