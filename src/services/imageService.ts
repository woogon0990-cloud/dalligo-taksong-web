import { GoogleGenAI } from "@google/genai";

export async function generateTransportImage() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return null;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompts = [
    'A professional high-quality photo of a modern car carrier truck transporting several new cars on a clean highway during a bright day. Cinematic lighting, commercial photography style.',
    'A large cargo ship at a busy port being loaded with hundreds of export cars. Industrial maritime setting, sunset lighting, high resolution.',
    'A fleet of white transport trucks parked in a modern logistics center. Aerial view, clean organized environment, professional business atmosphere.',
    'A close-up of a luxury car being carefully loaded onto a flatbed tow truck for premium delivery. Focus on safety and professional handling.',
    'A massive car carrier ship sailing on the open ocean under a clear blue sky. Wide angle shot, majestic and powerful feel.',
    'A professional driver in uniform inspecting a vehicle before transport. Trustworthy atmosphere, modern equipment, bright daylight.'
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: randomPrompt,
          },
        ],
      },
    });
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
  return null;
}
