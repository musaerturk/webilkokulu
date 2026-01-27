
import React, { useState } from 'react';
import { Assessment, Question, TopicProgress } from '../../types';
import AICoachFeedback from './AICoachFeedback';

interface AssessmentViewProps {
    assessment: Assessment;
    topicTitle: string;
    progress: TopicProgress;
    onUpdateProgress: (updates: Partial<TopicProgress>) => void;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ assessment, topicTitle, progress, onUpdateProgress }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]);

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        const incorrect: Question[] = [];
        assessment.questions.forEach(q => {
            if (q.type === 'multiple_choice') {
                const correctOption = q.options?.find(opt => opt.id === q.correctOptionId);
                // Note: The mock data's correctOptionId is an index, not an id. Let's handle that.
                 const correctAnswer = q.options?.[parseInt(q.correctOptionId || '0')]?.text;
                if (answers[q.id] === correctAnswer) {
                    correctCount++;
                } else {
                    incorrect.push(q);
                }
            }
        });
        const score = (correctCount / assessment.questions.filter(q=>q.type==='multiple_choice').length) * 100;
        onUpdateProgress({ assessmentScore: Math.round(score) });
        setIncorrectQuestions(incorrect);
        setSubmitted(true);
    };

    if (progress.assessmentScore !== undefined) {
        return (
            <div className="p-4 space-y-4">
                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-green-800">Değerlendirme Tamamlandı!</h3>
                    <p className="text-green-700">Sınav puanınız: <strong>{progress.assessmentScore}</strong></p>
                </div>
                <AICoachFeedback 
                    topicTitle={topicTitle}
                    incorrectQuestions={incorrectQuestions}
                    progress={progress}
                    onUpdateProgress={onUpdateProgress}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Konu Değerlendirme Sınavı</h3>
            {assessment.questions.map((q, index) => (
                <div key={q.id} className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-semibold">{index + 1}. {q.questionText}</p>
                    {q.questionImageUrl && <img src={q.questionImageUrl} alt="Soru görseli" className="my-2 rounded-md" />}
                    {q.type === 'multiple_choice' && q.options && (
                        <div className="mt-2 space-y-2">
                            {q.options.map((opt) => (
                                <label key={opt.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
                                    <input type="radio" name={q.id} value={opt.text} onChange={e => handleAnswerChange(q.id, e.target.value)} className="form-radio text-blue-600"/>
                                    <span>{opt.text}</span>
                                </label>
                            ))}
                        </div>
                    )}
                     {q.type === 'open_ended' && (
                        <textarea onChange={e => handleAnswerChange(q.id, e.target.value)} placeholder="Cevabınızı buraya yazın..." className="mt-2 w-full p-2 border rounded-md"></textarea>
                     )}
                </div>
            ))}
            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">Sınavı Bitir</button>
        </div>
    );
};

export default AssessmentView;
