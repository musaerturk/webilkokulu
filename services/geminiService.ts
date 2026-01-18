
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateStoryContent = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Bir çocuk öyküsü yaz. Konu: ${prompt}. Yanıtı JSON formatında ver.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "content", "description"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateStoryImage = async (storyTitle: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A magical illustration for a story titled: ${storyTitle}. Soft colors, whimsical style.` }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return `https://picsum.photos/400/400?random=${Math.random()}`;
};

export const generatePresentationSlides = async (instructions: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Şu konu hakkında 5 slaytlık bir sunum hazırla: ${instructions}. Her slayt için kısa bir metin ve görsel betimlemesi sağla.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["text", "imagePrompt"]
        }
      }
    }
  });
  const slidesData = JSON.parse(response.text || "[]");
  
  // Her slayt için görsel üret
  const slides = await Promise.all(slidesData.map(async (s: any) => ({
    text: s.text,
    imageUrl: await generateStoryImage(s.imagePrompt)
  })));
  
  return slides;
};

export const generateAssessmentQuestions = async (outcomes: string, count: number, difficulty: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Şu kazanımlar için ${count} adet ${difficulty} seviyesinde soru hazırla: ${outcomes}. Soruların yarısı kavram ölçme (CONCEPT), yarısı bilgiyi kullanma (SKILL) olsun. Hem çoktan seçmeli (MULTIPLE) hem açık uçlu (OPEN) sorular olsun.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["OPEN", "MULTIPLE"] },
            category: { type: Type.STRING, enum: ["CONCEPT", "SKILL"] },
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["type", "category", "text", "correctAnswer", "difficulty"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const generateGameLogic = async (instructions: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Şu oyun talimatlarına göre bir mini oyun evreni ve mekaniği tasarla: ${instructions}. JSON formatında oyun objelerini ve kurallarını döndür.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          universeName: { type: Type.STRING },
          mechanics: { type: Type.STRING },
          scoring: { type: Type.STRING },
          puzzles: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const askAiAboutSubject = async (subjectName: string, subjectContent: string, question: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sen bir ilkokul öğretmenisin. Konu: ${subjectName}. Konu içeriği: ${subjectContent}. Öğrencinin sorusu: ${question}. Lütfen bu soruyu bir ilkokul öğrencisinin anlayabileceği şekilde, nazik, anlaşılır ve teşvik edici bir dille cevapla. Cevabın çok uzun olmasın, öğrencinin merakını canlı tut.`,
  });
  return response.text;
};
