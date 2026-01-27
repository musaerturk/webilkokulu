
import React, { useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Question, TopicProgress } from '../../types';

interface AICoachFeedbackProps {
    topicTitle: string;
    incorrectQuestions: Question[];
    progress: TopicProgress;
    onUpdateProgress: (updates: Partial<TopicProgress>) => void;
}

const AICoachFeedback: React.FC<AICoachFeedbackProps> = ({ topicTitle, incorrectQuestions, progress, onUpdateProgress }) => {
    
    useEffect(() => {
        if (progress.assessmentScore !== undefined && !progress.coachFeedback && !progress.coachFeedbackLoading) {
            generateFeedback();
        }
    }, [progress.assessmentScore]);

    const generateFeedback = async () => {
        onUpdateProgress({ coachFeedbackLoading: true });

        const formattedIncorrectQuestions = incorrectQuestions.map(q => `- Soru: "${q.questionText}"`).join('\n');
        
        const prompt = `
        Sen ilkokul öğrencileri için hazırlanmış bir yapay zeka öğrenci koçusun. Öğrenci, "${topicTitle}" konusundaki bir testi yeni bitirdi.

        Öğrencinin yanlış cevapladığı sorular şunlar:
        ${formattedIncorrectQuestions || "Öğrenci tüm soruları doğru cevapladı."}

        Bu sonuçlara göre, aşağıdaki formatta, Türkçe olarak bir geri bildirim hazırla:
        1.  Öğrenciyi tebrik eden veya cesaretlendiren, samimi ve pozitif bir başlangıç yap.
        2.  Eğer yanlışları varsa, hangi temel kavramları tekrar etmesi gerektiğini basit bir dille anlat. (Örn: "Sayıları karşılaştırırken biraz daha dikkatli olmaya ne dersin?" gibi.)
        3.  Öğrencinin konuyu daha iyi anlaması için 2-3 adımlık basit bir çalışma planı oluştur. (Örn: "1. Sunumdaki elma sayma bölümünü tekrar izle. 2. Alıştırma sorularından birkaç tane daha çöz.")
        
        Tüm metni Markdown formatında ve sanki doğrudan öğrenciyle konuşuyormuş gibi yaz.
        `;

        try {
            // FIX: Use process.env.API_KEY as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            onUpdateProgress({ coachFeedback: response.text, coachFeedbackLoading: false });
        } catch (error) {
            console.error("AI Coach feedback error:", error);
            onUpdateProgress({ coachFeedback: "Geri bildirim alınırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.", coachFeedbackLoading: false });
        }
    };

    return (
        <div className="p-4 border-t-2 border-blue-200 mt-4">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Yapay Zeka Öğrenci Koçu Diyor ki...</h3>
            {progress.coachFeedbackLoading && <p className="text-gray-600 animate-pulse">Analiz yapılıyor, senin için özel bir çalışma planı hazırlıyorum...</p>}
            {progress.coachFeedback && (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: progress.coachFeedback.replace(/\n/g, '<br />') }}>
                </div>
            )}
        </div>
    );
};

export default AICoachFeedback;
