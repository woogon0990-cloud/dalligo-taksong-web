import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export const getGeminiInstance = () => {
  if (!aiInstance) {
    // In React/Vite, process.env.GEMINI_API_KEY is preferred in AI Studio Build.
    // We should also check for VITE_ prefix just in case user specifically set it that way.
    const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? (window as { GEMINI_API_KEY?: string }).GEMINI_API_KEY : '');
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found in environment. Please check Settings > Secrets.");
    }
    
    aiInstance = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiInstance;
};

export const chatWithGemini = async (prompt: string) => {
  try {
    const ai = getGeminiInstance();
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "당신은 '달리고탁송'의 전문 상담원입니다. 대표번호는 1844-1585입니다."
      }
    });

    if (!response.text) {
      throw new Error("답변을 생성하지 못했습니다.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && (error.message.includes('API_KEY_INVALID') || error.message.includes('not configured') || error.message.includes('403'))) {
      throw new Error("상담 서비스 설정(API Key)을 확인해 주세요. [403 Forbidden/Invalid Key]");
    }
    throw new Error("상담 서비스 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};
