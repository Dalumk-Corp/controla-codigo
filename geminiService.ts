
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Low-latency chat model
const chatLiteModel = 'gemini-2.5-flash-lite-latest';
// Standard chat and grounding model
const flashModel = 'gemini-2.5-flash';
// Advanced analysis model
const proModel = 'gemini-2.5-pro';
// Image editing model
const imageModel = 'gemini-2.5-flash-image';


export const getChatResponse = async (prompt: string, useGrounding: boolean): Promise<GenerateContentResponse> => {
  const model = useGrounding ? flashModel : chatLiteModel;
  const config = useGrounding ? { tools: [{ googleSearch: {} }] } : {};

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: config,
  });
  return response;
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string | null> => {
  const response = await ai.models.generateContent({
    model: imageModel,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  return null;
};

export const analyzeFinancialData = async (data: string): Promise<string> => {
    const prompt = `Analyze the following financial data and provide insights and recommendations for improvement. Be detailed and constructive. Data:\n\n${data}`;
    const response = await ai.models.generateContent({
        model: proModel,
        contents: prompt
    });
    return response.text;
}

export const getGroundedData = async (prompt: string): Promise<GenerateContentResponse> => {
    const response = await ai.models.generateContent({
        model: flashModel,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    return response;
};
