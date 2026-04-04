import { GoogleGenAI } from "@google/genai";

export async function generateTransportImage() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return null;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompts = [
    'A professional high-quality photo of a young Korean woman with top-tier actress visuals, long wavy brown hair, porcelain skin, and a slim, fit body, standing confidently next to a modern car carrier truck on a clean highway. Cinematic lighting, commercial photography style.',
    'A young Korean woman with top-tier actress visuals, long wavy brown hair, porcelain skin, and a slim, fit body, overseeing the loading of cars onto a large cargo ship at a busy port. Sunset lighting, industrial maritime setting, high resolution.',
    'A professional young Korean woman with top-tier actress visuals, long wavy brown hair, porcelain skin, and a slim, fit body, in a modern logistics center with a fleet of white transport trucks. Professional business atmosphere, bright daylight.',
    'A young Korean woman with top-tier actress visuals, long wavy brown hair, porcelain skin, and a slim, fit body, carefully inspecting a luxury car being loaded onto a flatbed tow truck. Focus on safety and professional handling.',
    'A young Korean woman with top-tier actress visuals, long wavy brown hair, porcelain skin, and a slim, fit body, standing on the deck of a massive car carrier ship on the open ocean. Wide angle shot, majestic and powerful feel.',
    'A professional young Korean woman with top-tier actress visuals, long wavy brown hair, porcelain skin, and a slim, fit body, in a uniform, inspecting a vehicle before transport. Trustworthy atmosphere, modern equipment, bright daylight.'
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
