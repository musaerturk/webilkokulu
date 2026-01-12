
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Grade, Subject, PresentationStep, Activity, Question, ActivityType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getGradeLabel = (grade: Grade) => grade === 'SC' ? 'Sesten Cümleye (Okuma Yazma Hazırlık)' : `${grade}. Sınıf`;

/**
 * Gelişmiş AI Sunum Mimarı: Pedagojik 4 aşamalı yapı üretir.
 * Yazılı içerik ve seslendirme (TTS) için ayrıntılı script hazırlar.
 */
export const generatePresentationAI = async (
  grade: Grade, 
  subject: Subject, 
  topicTitle: string, 
  concepts: string, 
  outcomes: string
): Promise<PresentationStep[]> => {
  const gradeLabel = getGradeLabel(grade);
  const prompt = `
    Sen dünya standartlarında bir ilkokul içerik tasarımcısısın. 
    Ders: ${gradeLabel} ${subject}
    Konu: "${topicTitle}"
    Kavramlar: ${concepts}
    Kazanımlar: ${outcomes}

    GÖREV: Öğrenciyi içine çekecek 4 slaytlık profesyonel, pedagojik bir sunum tasarla. 
    
    HER SLAYT ŞU PEDAGOJİK YAPIYI İZLEMELİ:
    1. SLAYT (KANCA/MERAK): Konuya merak uyandıran bir soru veya günlük hayattan bir senaryo.
    2. SLAYT (KEŞİF/BAĞLAM): Bilgiyi çocuğun dünyasından bir örnekle (örn: oyun parkı, mutfak, uzay) ilişkilendir.
    3. SLAYT (DERİNLEŞME/BİLGİ): Temel kuralı veya bilgiyi en sade, somut ve eğlenceli şekilde ver.
    4. SLAYT (ÖZET/GÖREV): Öğrenileni pekiştiren bir özet ve "Hadi Dene" çağrısı.

    ÇIKTI FORMATI: JSON. 
    Her slayt için: 
    - 'title': Kısa, enerjik başlık.
    - 'content': Ekranda görünecek kısa ve öz metin.
    - 'audioScript': Seslendirme için kullanılacak; vurgulu, samimi, öğretmen edasıyla yazılmış, en az 3-4 cümlelik AYRINTILI anlatım metni.
    - 'icon': Konuya uygun FontAwesome ikonu.
    - 'color': Canlı bir Tailwind bg sınıfı.
    - 'imageDescription': Slaytı anlatan, çocuksu, renkli ve yüksek kaliteli illüstrasyon betimlemesi.
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            audioScript: { type: Type.STRING },
            icon: { type: Type.STRING },
            color: { type: Type.STRING },
            imageDescription: { type: Type.STRING }
          },
          required: ["title", "content", "audioScript", "icon", "color", "imageDescription"]
        }
      }
    }
  });
  
  const data = JSON.parse(response.text || "[]");
  return data.map((d: any, i: number) => ({ 
    ...d, 
    id: `s-${Date.now()}-${i}`
  }));
};

/**
 * Gelişmiş AI Oyun Laboratuvarı: Mekanik, görsel ve kural tasarımı yapar.
 */
export const generateActivityAI = async (
  grade: Grade, 
  subject: Subject, 
  type: ActivityType, 
  userPrompt: string,
  base64Image?: string
): Promise<Activity> => {
  const gradeLabel = getGradeLabel(grade);
  
  const parts: any[] = [
    { text: `
      Sen uzman bir oyun tabanlı öğrenme (GBL) tasarımcısısın.
      Hedef Kitle: ${gradeLabel} | Ders: ${subject}
      Oyun Türü: ${type}
      İstek: "${userPrompt}"

      GÖREV: Eğitici, eğlenceli ve mekanik olarak kusursuz bir oyun kurgula.
      
      AYRINTILI TASARIM KRİTERLERİ:
      1. Oyun Mekaniği: Oyuncu ekranda ne yapacak? (Örn: "Doğru elmaları sepete sürükle", "Sayıları sıraya diz").
      2. Oyun Kuralları: Puanlama nasıl olacak? Yanlış nesneye dokunursa ne uyarısı verilecek?
      3. Görsel Atmosfer: Oyunun geçeceği mekanın (Örn: "Büyülü bir kütüphane", "Gökkuşağı tarlası") detaylı tasviri.
      4. Nesne Listesi (items): En az 6-8 adet nesne. Her biri için 'content' (yazı), 'targetCategory' (kategori), 'isCorrect' (doğruluk) ve nesnenin nasıl görüneceğine dair 'description'.

      ÇIKTI: JSON (instruction, categories, items, config).
    `}
  ];

  if (base64Image) {
    parts.push({ inlineData: { data: base64Image, mimeType: "image/jpeg" } });
    parts[0].text += "\nÖNEMLİ: Yüklenen resimdeki görsel öğeleri, kelimeleri veya sayıları oyunun temel malzemesi olarak kullan!";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instruction: { type: Type.STRING },
          categories: { type: Type.ARRAY, items: { type: Type.STRING } },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                targetCategory: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
                description: { type: Type.STRING }
              }
            }
          },
          config: {
            type: Type.OBJECT,
            properties: {
              animationTheme: { type: Type.STRING },
              character: { type: Type.STRING }
            }
          }
        }
      }
    }
  });
  
  const data = JSON.parse(response.text || "{}");
  return { 
    id: `act-${Date.now()}`, 
    type, 
    instruction: data.instruction || "Maceraya başla!", 
    categories: data.categories || [], 
    items: (data.items || []).map((it:any, idx:number) => ({
      ...it, 
      id: `it-${Date.now()}-${idx}`
    })),
    config: data.config
  };
};

export const generateSlideImage = async (description: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `İlkokul seviyesinde, parlak renkli, temiz hatlı dijital illüstrasyon: ${description}` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (error) { console.error("Resim hatası", error); }
  return undefined;
};

export const generateAISpeech = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) { return undefined; }
};

export const generateAssessmentAI = async (grade: Grade, subject: Subject, count: number, outcome: string): Promise<any> => {
  const prompt = `${grade}. Sınıf ${subject} dersi, "${outcome}" kazanımı için ${count} adet kaliteli, çocuk dostu çoktan seçmeli soru hazırla. JSON döndür.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.NUMBER },
                topic: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
