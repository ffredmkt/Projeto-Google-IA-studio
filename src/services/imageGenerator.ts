import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImages() {
  const prompts = [
    {
      name: "hero_bg",
      text: "A professional and elegant background for a law firm website specializing in maternity benefits. Deep navy blue color palette. Subtle legal symbols like a scale of justice integrated with soft imagery of a mother's hands holding a baby's hand. High-end, cinematic lighting, blurred background, professional photography style."
    },
    {
      name: "eligibility_bg",
      text: "A high-quality, heartwarming photo of a mother smiling at her newborn baby. Soft, natural lighting. The colors should be warm but with subtle navy blue accents in the clothing or environment to match a professional law firm palette. Minimalist and clean composition."
    },
    {
      name: "about_bg",
      text: "A modern and sophisticated lawyer's office interior. Large windows with soft daylight. Deep navy blue leather chairs, a polished wooden desk with a laptop and some legal books. Professional, trustworthy, and high-end atmosphere. Wide angle shot."
    }
  ];

  const results = {};

  for (const prompt of prompts) {
    console.log(`Generating ${prompt.name}...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt.text }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        results[prompt.name] = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  return results;
}

export { generateImages };
