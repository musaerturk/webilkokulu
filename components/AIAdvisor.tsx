
import React, { useEffect, useState } from 'react';
import { QuizResult, StudyPlan, UserProfile } from '../types';
import Mascot from './Mascot';
import { generatePersonalizedPlan } from '../services/geminiService';

interface AIAdvisorProps {
  result: QuizResult;
  user: UserProfile;
  onClose: () => void;
  onBilkusClick?: () => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ result, user, onClose, onBilkusClick }) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      const generatedPlan = await generatePersonalizedPlan(result, user);
      setPlan(generatedPlan);
      setLoading(false);
    };
    fetchPlan();
  }, [result, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen">
        <Mascot type="fox" size="lg" className="mb-6 animate-slowPulse" />
        <p className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Analiz Yapılıyor...</p>
        <p className="text-gray-500 mt-2 font-medium">MEB müfredatına ve ilgi alanlarına göre eksiklerini çıkarıyorum.</p>
      </div>
    );
  }

  const needsBilkus = result.score < 100 || result.wrongTopics.length > 0;

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-20">
      <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-[3rem] p-10 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="bg-white/20 p-4 rounded-[2.5rem] backdrop-blur-xl border border-white/30 shadow-2xl">
            <Mascot type="fox" size="lg" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Yol Haritan Hazır, {user.name.split(' ')[0]}!</h2>
            <p className="text-red-50 opacity-90 text-xl font-medium">
              {result.topicTitle} performansını pedagojik olarak inceledim.
            </p>
          </div>
          <button onClick={onClose} className="absolute top-0 right-0 m-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 relative group">
            <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Danışman Analizi</h3>
            <p className="text-gray-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">{plan?.analysis}</p>
            <div className="mt-6 p-6 bg-blue-50 rounded-3xl border border-blue-100">
               <h4 className="text-blue-800 font-black text-sm uppercase mb-2">Fikir'in Özel Notu:</h4>
               <p className="text-blue-700 italic font-medium">{plan?.teacherNote}</p>
            </div>
          </section>

          {needsBilkus && onBilkusClick && (
            <section className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 border-4 border-indigo-400">
              <Mascot type="owl" size="lg" className="animate-slowPulse" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">BİLKUŞ Seni Bekliyor!</h3>
                <p className="text-indigo-100 mb-6 font-medium italic">Eksik kalan noktaları BİLKUŞ'a sorarak beraber keşfedelim mi?</p>
                <button 
                  onClick={onBilkusClick}
                  className="bg-white text-indigo-700 px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                >
                  BİLKUŞ'a Git <i className="fas fa-chevron-right ml-2"></i>
                </button>
              </div>
            </section>
          )}

          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 uppercase mb-8">Çalışma Takvimin</h3>
            <div className="grid grid-cols-1 gap-4">
              {plan?.dailyTasks.map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 p-6 rounded-3xl bg-gray-50 border-2 border-transparent hover:border-orange-100 transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex-shrink-0 flex items-center justify-center font-black text-orange-600">{idx + 1}</div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{item.day}</h4>
                    <p className="text-gray-600 font-medium leading-tight">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <section className="bg-yellow-50 rounded-[3rem] p-10 border-4 border-white shadow-xl">
            <h3 className="text-xl font-black text-yellow-800 mb-4 uppercase italic">Motto</h3>
            <p className="text-yellow-700 text-xl font-black leading-snug">"{plan?.motivationalQuote}"</p>
          </section>

          <section className="bg-red-50 rounded-[3rem] p-10 border-4 border-white shadow-xl">
            <h3 className="text-xl font-black text-red-800 mb-6 uppercase">Eksik Kazanımlar</h3>
            <div className="flex flex-wrap gap-2">
              {result.wrongTopics.map((topic, idx) => (
                <span key={idx} className="bg-white px-4 py-2 rounded-2xl text-red-600 text-sm font-black border-2 border-red-100 shadow-sm">
                  {topic}
                </span>
              ))}
              {result.wrongTopics.length === 0 && <p className="text-green-600 font-black">Eksik bulunamadı, mükemmel!</p>}
            </div>
          </section>

          <button onClick={onClose} className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl">
            Kapat ve Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
