
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizResult, StudyPlan, UserProfile, Assessment5N1K, Book } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// 5N1K Değerlendirme Servisi
export const grade5N1K = async (book: Book, answers: Assessment5N1K): Promise<{ score: number, feedback: string }> => {
  const prompt = `
    Sen bir ilkokul öğretmenisin. Öğrenci bir kitap okudu ve 5N1K sorularını yanıtladı.
    Kitap: "${book.title}"
    Kitap Özeti: "${book.summary}"
    
    Öğrencinin Cevapları:
    Kim: ${answers.who}
    Ne: ${answers.what}
    Nerede: ${answers.where}
    Ne Zaman: ${answers.when}
    Neden: ${answers.why}
    Nasıl: ${answers.how}
    
    Lütfen öğrencinin anlama düzeyini değerlendir. 100 üzerinden bir puan ver ve teşvik edici, yapıcı bir geri bildirim yaz.
    Yanıtı JSON formatında {"score": sayı, "feedback": "metin"} şeklinde döndür.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"score": 0, "feedback": "Hata oluştu."}');
  } catch (error) {
    return { score: 0, feedback: "Bağlantı hatası, tekrar dene." };
  }
};

// Gelişmiş Kişiselleştirilmiş Çalışma Planı Üretimi
export const generatePersonalizedPlan = async (result: QuizResult, user: UserProfile): Promise<StudyPlan> => {
  const successRate = Math.min(100, Math.round((result.score / result.totalQuestions) * 100));
  
  const prompt = `
    Sen uzman bir ilkokul eğitim danışmanısın.
    Öğrenci Bilgileri: ${user.name}, ${result.grade}. Sınıf. 
    İlgi Alanları: ${user.interests?.join(', ')}, Takımı: ${user.team}, Sevdiği Sporlar: ${user.sports?.join(', ')}.
    Sınav Sonucu: ${result.subject}, Konu: ${result.topicTitle}, Puan: %${successRate}.
    
    Lütfen tavsiyelerini verirken öğrencinin ilgi alanlarından (takımı, hobileri vb.) örnekler vererek onu motive et.
    JSON formatında "analysis", "dailyTasks", "motivationalQuote", "teacherNote" alanlarını içeren bir yanıt ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            dailyTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  task: { type: Type.STRING }
                }
              }
            },
            motivationalQuote: { type: Type.STRING },
            teacherNote: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}") as StudyPlan;
  } catch (error) {
    return { analysis: "Hata oluştu, tekrar dene.", dailyTasks: [], motivationalQuote: "", teacherNote: "" };
  }
};

// Açık uçlu soruları değerlendirme servisi
export const gradeOpenEndedAnswers = async (questions: string[], answers: { text: string, image?: string }[]): Promise<{ score: number, feedback: string[] }> => {
  const prompt = `
    Sen bir ilkokul öğretmenisin. Öğrencilerin açık uçlu sorulara verdikleri yanıtları değerlendiriyorsun.
    Sorular: ${questions.join(' | ')}
    Öğrenci Cevapları: ${answers.map(a => a.text).join(' | ')}
    
    Lütfen her cevabı değerlendir. 100 üzerinden toplam bir puan ver ve her soru için kısa, teşvik edici geri bildirimler yaz.
    Yanıtı JSON formatında {"score": sayı, "feedback": ["geri bildirim 1", "geri bildirim 2", ...]} şeklinde döndür.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"score": 0, "feedback": []}');
  } catch (error) {
    return { score: 0, feedback: ["Bağlantı hatası."] };
  }
};

export const refineContent = async (type: 'presentation' | 'question' | 'activity', content: string, tone: string = 'eğlenceli ve merak uyandırıcı'): Promise<string> => {
  const prompt = `Sen uzman bir ilkokul içerik tasarımcısısın. Mevcut İçerik: ${content}`;
  try {
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text || content;
  } catch (error) { return content; }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
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

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number = 24000, numChannels: number = 1): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}