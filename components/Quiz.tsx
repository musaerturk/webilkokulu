
import React, { useState } from 'react';
import { Assessment, QuizResult, Subject, Grade, MascotSettings } from '../types';
import Mascot from './Mascot';

interface QuizProps {
  assessment: Assessment & { title: string, subject: Subject, grade: Grade };
  onComplete: (result: QuizResult) => void;
  mascots?: MascotSettings[];
}

const Quiz: React.FC<QuizProps> = ({ assessment, onComplete, mascots }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const assessmentMascot = mascots?.find(m => m.role === 'assessment') || { type: 'rabbit', name: 'Zıpzıp', customImageUrl: undefined };

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[3rem] border shadow-inner">
         <Mascot type={assessmentMascot.type as any} size="md" imageUrl={assessmentMascot.customImageUrl} className="mx-auto opacity-30 mb-4" />
         <p className="text-gray-400 font-bold uppercase text-xs italic">Henüz soru eklenmemiş.</p>
      </div>
    );
  }

  const handleNext = () => {
    const question = assessment.questions[currentQuestionIndex];
    let currentScore = score;
    if (selectedOption === question.correctAnswer) {
      currentScore += 1;
      setScore(currentScore);
    } else {
      if (!wrongTopics.includes(question.topic)) setWrongTopics(prev => [...prev, question.topic]);
    }

    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    onComplete({
      assessmentId: assessment.id,
      score: score,
      wrongTopics: Array.from(new Set(wrongTopics)),
      totalQuestions: assessment.questions.length,
      grade: assessment.grade,
      subject: assessment.subject,
      topicTitle: assessment.title,
      date: new Date().toLocaleDateString('tr-TR')
    });
  };

  if (isFinished) {
    const successRate = Math.round((score / assessment.questions.length) * 100);
    return (
      <div className="text-center py-12">
        <Mascot type={assessmentMascot.type as any} size="lg" imageUrl={assessmentMascot.customImageUrl} className="mx-auto mb-6" />
        <h3 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Macerayı Tamamladın!</h3>
        <div className="mb-8">
          <span className="text-6xl font-black text-red-600">{successRate}</span>
          <span className="text-2xl font-bold text-gray-400"> / 100</span>
        </div>
        <button onClick={handleFinish} className="bg-red-600 text-white px-10 py-5 rounded-3xl font-black uppercase shadow-xl hover:scale-105 active:scale-95">{assessmentMascot.name}'in Analizini Gör</button>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="animate-slideIn">
      <div className="flex items-center gap-4 mb-8 bg-white p-5 rounded-[2rem] border border-red-50 shadow-sm">
        <Mascot type={assessmentMascot.type as any} size="sm" imageUrl={assessmentMascot.customImageUrl} />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest">SORU {currentQuestionIndex + 1} / {assessment.questions.length}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border-4 border-gray-50 shadow-inner mb-8">
        {currentQuestion.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border-4 border-red-50 max-h-[300px] flex justify-center bg-gray-50">
            <img src={currentQuestion.imageUrl} className="max-h-[300px] object-contain" alt="question illustration" />
          </div>
        )}
        <h3 className="text-2xl font-black text-gray-800 leading-tight">{currentQuestion.text}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {currentQuestion.options.map((option, idx) => (
          <button key={idx} onClick={() => setSelectedOption(idx)} className={`text-left p-6 rounded-3xl border-2 transition-all duration-200 group ${selectedOption === idx ? 'border-red-600 bg-red-50 text-red-700 shadow-md' : 'border-gray-100 hover:border-red-200 hover:bg-gray-50 text-gray-700'}`}>
            <div className="flex items-center">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 font-black text-lg shadow-sm transition-all ${selectedOption === idx ? 'bg-red-600 text-white' : 'bg-white text-gray-300 group-hover:text-red-300'}`}>{String.fromCharCode(65 + idx)}</span>
              <span className="text-lg font-bold tracking-tight">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <button onClick={handleNext} disabled={selectedOption === null} className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-widest transition-all ${selectedOption !== null ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
        {currentQuestionIndex === assessment.questions.length - 1 ? 'Macerayı Bitir' : 'Devam Et'}
      </button>
    </div>
  );
};

export default Quiz;
