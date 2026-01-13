
import React, { useState } from 'react';
import { Topic, Grade, Subject, PresentationStep, Activity, Unit, ActivityType, Question, Assessment } from '../types';
import { 
  generatePresentationAI, 
  generateSlideImage, 
  generateAISpeech, 
  generateActivityAI, 
  generateAssessmentAI 
} from '../services/contentService';
import Mascot from './Mascot';

interface AdminWorkspaceProps {
  units: Unit[];
  onSaveUnits: (updatedUnits: Unit[]) => void;
  onBack: () => void;
  grade: Grade;
  subject: Subject;
}

const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({ units: initialUnits, onSaveUnits, onBack, grade, subject }) => {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedUnitIdx, setSelectedUnitIdx] = useState<number | null>(null);
  const [selectedTopicIdx, setSelectedTopicIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'sunum' | 'oyun' | 'olcm-ai' | 'olcm-manuel'>('sunum');
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // AI Inputs
  const [presentationPrompt, setPresentationPrompt] = useState('');
  const [activityPrompt, setActivityPrompt] = useState('');
  const [activityImages, setActivityImages] = useState<string[]>(['', '']);
  const [quizOutcome, setQuizOutcome] = useState('');
  const [quizCount, setQuizCount] = useState(5);
  const [quizType, setQuizType] = useState<'multiple-choice' | 'mixed'>('multiple-choice');

  const handleSave = () => {
    onSaveUnits(units);
    setHasUnsavedChanges(false);
    alert("Tüm değişiklikler başarıyla kaydedildi! 🚀");
  };

  const updateUnits = (updater: (prev: Unit[]) => Unit[]) => {
    setHasUnsavedChanges(true);
    setUnits(updater);
  };

  const handleAiPresentation = async () => {
    if (selectedUnitIdx === null || selectedTopicIdx === null) return;
    if (!presentationPrompt) { alert("Lütfen detaylı sunum açıklaması girin."); return; }
    
    setIsAiLoading(true);
    try {
      setLoadingStep('Pedagojik Kurgu Hazırlanıyor...');
      const slides = await generatePresentationAI(grade, subject, units[selectedUnitIdx].topics[selectedTopicIdx].title, presentationPrompt, "");
      
      const enrichedSlides: PresentationStep[] = [];
      for (let i = 0; i < slides.length; i++) {
        setLoadingStep(`Slayt ${i+1}/${slides.length}: Görsel ve Ses İşleniyor...`);
        const imageUrl = await generateSlideImage(slides[i].content);
        const audioBase64 = await generateAISpeech(slides[i].audioScript || slides[i].content);
        enrichedSlides.push({
          ...slides[i],
          imageUrl: imageUrl || undefined,
          audioUrl: audioBase64 ? `data:audio/pcm;base64,${audioBase64}` : undefined
        });
      }
      
      updateUnits(prev => prev.map((u, ui) => ui === selectedUnitIdx ? {
        ...u,
        topics: u.topics.map((t, ti) => ti === selectedTopicIdx ? { ...t, presentationSteps: enrichedSlides } : t)
      } : u));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiActivity = async () => {
    if (selectedUnitIdx === null || selectedTopicIdx === null) return;
    setIsAiLoading(true);
    try {
      setLoadingStep('Oyun Animasyonları Tasarlanıyor...');
      const activity = await generateActivityAI(grade, subject, 'animated-adventure', activityPrompt, activityImages[0]);
      updateUnits(prev => prev.map((u, ui) => ui === selectedUnitIdx ? {
        ...u,
        topics: u.topics.map((t, ti) => ti === selectedTopicIdx ? { ...t, activities: [activity] } : t)
      } : u));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiQuiz = async () => {
    if (selectedUnitIdx === null || selectedTopicIdx === null) return;
    setIsAiLoading(true);
    try {
      setLoadingStep('Zeka Soruları Hazırlanıyor...');
      const quiz = await generateAssessmentAI(grade, subject, quizCount, quizOutcome);
      updateUnits(prev => prev.map((u, ui) => ui === selectedUnitIdx ? {
        ...u,
        topics: u.topics.map((t, ti) => ti === selectedTopicIdx ? { ...t, assessment: { ...quiz, title: `${t.title} Testi`, type: quizType } } : t)
      } : u));
    } finally {
      setIsAiLoading(false);
    }
  };

  if (selectedUnitIdx === null) {
    return (
      <div className="max-w-6xl mx-auto py-10 animate-fadeIn">
         <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex justify-between items-center shadow-2xl mb-12 border-b-8 border-indigo-600">
            <div>
               <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Müfredat Stüdyosu</h2>
               <p className="text-indigo-400 font-bold uppercase text-[10px] mt-2 tracking-widest">{grade}. Sınıf / {subject}</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => updateUnits(prev => [...prev, { id: `U-${Date.now()}`, title: 'Yeni Ünite', topics: [] }])} className="bg-emerald-600 px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl">+ Ünite Ekle</button>
               <button onClick={onBack} className="bg-white/10 px-8 py-4 rounded-2xl font-black uppercase text-xs">Geri</button>
            </div>
         </div>

         <div className="space-y-8">
            {units.map((unit, uIdx) => (
              <div key={unit.id} className="bg-white rounded-[3rem] shadow-xl border overflow-hidden">
                <div className="bg-slate-50 p-10 flex flex-col md:flex-row justify-between items-center border-b gap-6">
                   <div className="flex flex-col gap-2 flex-1">
                      <input className="bg-transparent text-2xl font-black outline-none border-b-2 border-transparent focus:border-indigo-600 w-full" value={unit.title} onChange={e => updateUnits(p => p.map((un, i) => i === uIdx ? {...un, title: e.target.value} : un))} />
                      <div className="flex gap-4 mt-2">
                         <div className="flex-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Ünite Kapak Görseli URL</label>
                            <input className="w-full bg-white p-3 rounded-xl border text-xs" value={unit.coverImage || ''} onChange={e => updateUnits(p => p.map((un, i) => i === uIdx ? {...un, coverImage: e.target.value} : un))} />
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => updateUnits(p => p.map((un, i) => i === uIdx ? {...un, topics: [...un.topics, { id: `T-${Date.now()}`, title: 'Yeni Konu', presentationSteps: [], activities: [], assessment: { id: `as-${Date.now()}`, questions: [], title: 'Konu Testi', type: 'multiple-choice' } }]} : un))} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-md">+ Konu Ekle</button>
                      <button onClick={() => { if(confirm("Üniteyi silmek istediğine emin misin?")) updateUnits(p => p.filter((_, i) => i !== uIdx)); }} className="text-red-500 p-4 hover:bg-red-50 rounded-xl transition-all"><i className="fas fa-trash"></i></button>
                   </div>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {unit.topics.map((topic, tIdx) => (
                     <div key={topic.id} className="bg-slate-50 p-6 rounded-[2.5rem] flex flex-col justify-between border-2 border-transparent hover:border-indigo-100 transition-all shadow-sm group">
                        <div className="space-y-4">
                           {topic.coverImage ? <img src={topic.coverImage} className="w-full h-24 object-cover rounded-2xl shadow-sm" /> : <div className="w-full h-24 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-200"><i className="fas fa-image text-3xl"></i></div>}
                           <input className="bg-transparent font-black text-slate-800 text-lg outline-none w-full border-b-2 border-transparent focus:border-indigo-600" value={topic.title} onChange={e => updateUnits(p => p.map((un, i) => i === uIdx ? {...un, topics: un.topics.map((t, j) => j === tIdx ? {...t, title: e.target.value} : t)} : un))} />
                           <div className="flex flex-col gap-1">
                              <label className="text-[8px] font-black uppercase text-slate-400">Konu Kapak Görseli</label>
                              <input className="w-full bg-white p-2 rounded-xl border text-[10px]" value={topic.coverImage || ''} onChange={e => updateUnits(p => p.map((un, i) => i === uIdx ? {...un, topics: un.topics.map((t, j) => j === tIdx ? {...t, coverImage: e.target.value} : t)} : un))} />
                           </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                           <button onClick={() => { setSelectedUnitIdx(uIdx); setSelectedTopicIdx(tIdx); }} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-[10px] shadow-md hover:bg-indigo-600 transition-all">İçeriği Düzenle</button>
                           <button onClick={() => { if(confirm("Konuyu silmek istediğine emin misin?")) updateUnits(p => p.map((un, i) => i === uIdx ? {...un, topics: un.topics.filter((_, j) => j !== tIdx)} : un)); }} className="text-red-500 px-4 py-3 hover:bg-red-50 rounded-xl transition-all"><i className="fas fa-trash"></i></button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            ))}
         </div>

         {hasUnsavedChanges && (
           <button onClick={handleSave} className="fixed bottom-10 right-10 px-12 py-6 rounded-[3rem] bg-orange-500 text-white font-black text-xl uppercase shadow-2xl z-50 animate-bounce">
              TÜMÜNÜ KAYDET VE YAYINLA
           </button>
         )}
      </div>
    );
  }

  const topic = units[selectedUnitIdx].topics[selectedTopicIdx!];

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fadeIn pb-32">
       {isAiLoading && (
         <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-white text-center p-10">
            <Mascot type="fox" size="lg" className="animate-bounce" />
            <h3 className="text-3xl font-black uppercase mt-8 tracking-tighter">AI Stüdyosu Aktif ⚡</h3>
            <p className="text-indigo-400 font-bold italic text-xl mt-2">{loadingStep}</p>
         </div>
       )}

       <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <button onClick={() => { setSelectedUnitIdx(null); setSelectedTopicIdx(null); }} className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center hover:bg-white/20"><i className="fas fa-arrow-left"></i></button>
             <div>
                <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest tracking-tighter">İÇERİK EDİTÖRÜ</span>
                <h3 className="text-3xl font-black">{topic.title}</h3>
             </div>
          </div>
          <button onClick={handleSave} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase shadow-xl">Konuyu Kaydet</button>
       </div>

       <div className="flex bg-white p-2 rounded-[2.5rem] shadow-lg mb-10 border overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('sunum')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'sunum' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>Sunum & Slayt</button>
          <button onClick={() => setActiveTab('oyun')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'oyun' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400'}`}>AI Oyun Lab</button>
          <button onClick={() => setActiveTab('olcm-ai')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'olcm-ai' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-400'}`}>AI Ölçme (Sınav)</button>
          <button onClick={() => setActiveTab('olcm-manuel')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'olcm-manuel' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Manuel Sınav</button>
       </div>

       <div className="bg-white p-12 rounded-[4rem] shadow-xl border">
          {activeTab === 'sunum' && (
            <div className="space-y-10 animate-fadeIn">
               <div className="bg-indigo-50 p-10 rounded-[3rem] border-4 border-indigo-100">
                  <h4 className="text-xl font-black text-indigo-900 mb-4 uppercase">Sihirli Sunum Oluşturucu (AI)</h4>
                  <textarea className="w-full bg-white p-6 rounded-[2rem] border-2 border-indigo-200 outline-none font-bold text-slate-700 min-h-[150px] mb-6" placeholder="Sunumda neler anlatılsın? (Örn: Işığın kırılmasını eğlenceli, mutfaktan örnekler vererek 4 slaytta anlat.)" value={presentationPrompt} onChange={e => setPresentationPrompt(e.target.value)} />
                  <button onClick={handleAiPresentation} className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl hover:scale-105 transition-all">AI İle Slaytları Hazırla ✨</button>
               </div>
               <div className="space-y-6">
                  {topic.presentationSteps.map((step, idx) => (
                    <div key={step.id} className="bg-slate-50 p-8 rounded-[3rem] flex flex-col md:flex-row gap-8 relative border-2 border-transparent hover:border-indigo-100 group">
                       <div className="w-full md:w-64 aspect-video bg-white rounded-3xl overflow-hidden shadow-inner border-2 border-dashed flex items-center justify-center">
                          {step.imageUrl ? <img src={step.imageUrl} className="w-full h-full object-cover" /> : <i className="fas fa-image text-slate-200 text-4xl"></i>}
                       </div>
                       <div className="flex-1 space-y-4">
                          <input className="w-full bg-white p-4 rounded-xl font-black uppercase text-sm outline-none shadow-sm" value={step.title} onChange={e => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, presentationSteps: t.presentationSteps.map((s, si) => si === idx ? {...s, title: e.target.value} : s)} : t)})))} />
                          <textarea className="w-full bg-white p-4 rounded-xl font-bold text-xs outline-none shadow-sm min-h-[100px]" value={step.content} onChange={e => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, presentationSteps: t.presentationSteps.map((s, si) => si === idx ? {...s, content: e.target.value} : s)} : t)})))} />
                       </div>
                       <button onClick={() => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, presentationSteps: t.presentationSteps.filter((_, si) => si !== idx)} : t)})))} className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><i className="fas fa-trash"></i></button>
                    </div>
                  ))}
                  <button onClick={() => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, presentationSteps: [...t.presentationSteps, { id: `s-${Date.now()}`, title: 'Yeni Slayt', content: 'İçerik buraya...', icon: 'fa-star', color: 'bg-indigo-500' }]} : t)})))} className="w-full py-4 border-4 border-dashed rounded-[2rem] text-slate-300 font-black uppercase text-xs hover:bg-slate-50 transition-all">+ MANUEL SLAYT EKLE</button>
               </div>
            </div>
          )}

          {activeTab === 'oyun' && (
            <div className="space-y-10 animate-fadeIn">
               <div className="bg-emerald-50 p-10 rounded-[3rem] border-4 border-emerald-100">
                  <h4 className="text-xl font-black text-emerald-900 mb-4 uppercase">Oyun Animasyon Laboratuvarı</h4>
                  <textarea className="w-full bg-white p-6 rounded-[2rem] border-2 border-emerald-200 outline-none font-bold text-slate-700 min-h-[120px] mb-6" placeholder="Oyun nasıl olsun? (Örn: Ormanda koşan bir tavşan doğru çarpma işlemlerini toplamalı, yanlışlardan kaçmalı.)" value={activityPrompt} onChange={e => setActivityPrompt(e.target.value)} />
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-emerald-600">Referans Görsel 1 (URL)</label>
                        <input className="w-full bg-white p-4 rounded-xl border text-xs" value={activityImages[0]} placeholder="Görsel URL..." onChange={e => setActivityImages([e.target.value, activityImages[1]])} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-emerald-600">Referans Görsel 2 (URL)</label>
                        <input className="w-full bg-white p-4 rounded-xl border text-xs" value={activityImages[1]} placeholder="Görsel URL..." onChange={e => setActivityImages([activityImages[0], e.target.value])} />
                     </div>
                  </div>
                  <button onClick={handleAiActivity} className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl hover:scale-105 transition-all">AI Oyununu Kodla 🎮</button>
               </div>
            </div>
          )}

          {activeTab === 'olcm-ai' && (
            <div className="space-y-10 animate-fadeIn">
               <div className="bg-orange-50 p-10 rounded-[3rem] border-4 border-orange-100">
                  <h4 className="text-xl font-black text-orange-900 mb-6 uppercase">Akıllı Sınav Fabrikası</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-orange-600 ml-4">Hangi Kazanımı Sorsun?</label>
                        <input className="w-full bg-white p-5 rounded-2xl border-2 border-orange-200 font-bold" value={quizOutcome} onChange={e => setQuizOutcome(e.target.value)} placeholder="Örn: Ritmik sayma becerisi" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-orange-600 ml-4">Soru Sayısı</label>
                        <input type="number" className="w-full bg-white p-5 rounded-2xl border-2 border-orange-200 font-black" value={quizCount} onChange={e => setQuizCount(parseInt(e.target.value) || 5)} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-orange-600 ml-4">Ölçme Türü</label>
                        <select className="w-full bg-white p-5 rounded-2xl border-2 border-orange-200 font-black" value={quizType} onChange={e => setQuizType(e.target.value as any)}>
                           <option value="multiple-choice">Çoktan Seçmeli</option>
                           <option value="mixed">Karma (Açık Uçlu + Seçmeli)</option>
                        </select>
                     </div>
                  </div>
                  <button onClick={handleAiQuiz} className="w-full bg-orange-600 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl hover:scale-105 transition-all">Sınav Sorularını Üret 📝</button>
               </div>
            </div>
          )}

          {activeTab === 'olcm-manuel' && (
            <div className="space-y-10 animate-fadeIn">
               <h4 className="text-xl font-black text-slate-800 uppercase mb-6">Soru Bankası Düzenleyici</h4>
               <div className="space-y-8">
                  {topic.assessment.questions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 space-y-4 relative group">
                       <div className="flex justify-between items-center">
                          <span className="bg-slate-900 text-white px-4 py-1 rounded-xl font-black text-[10px]">SORU {idx + 1}</span>
                          <button onClick={() => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, assessment: {...t.assessment, questions: t.assessment.questions.filter((_, qi) => qi !== idx)}} : t)})))} className="text-red-400 hover:text-red-600"><i className="fas fa-trash"></i></button>
                       </div>
                       <input className="w-full bg-white p-4 rounded-xl font-bold border-2 border-transparent focus:border-indigo-600" value={q.text} onChange={e => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, assessment: {...t.assessment, questions: t.assessment.questions.map((sq, qi) => qi === idx ? {...sq, text: e.target.value} : sq)}} : t)})))} />
                       <div className="grid grid-cols-2 gap-4">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                               <input type="radio" name={`correct-${q.id}`} checked={q.correctAnswer === oi} onChange={() => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, assessment: {...t.assessment, questions: t.assessment.questions.map((sq, qi) => qi === idx ? {...sq, correctAnswer: oi} : sq)}} : t)})))} />
                               <input className="flex-1 bg-white p-3 rounded-xl text-xs border" value={opt} onChange={e => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, assessment: {...t.assessment, questions: t.assessment.questions.map((sq, qi) => qi === idx ? {...sq, options: sq.options.map((o, oxi) => oxi === oi ? e.target.value : o)} : sq)}} : t)})))} />
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
                  <button onClick={() => updateUnits(p => p.map(u => ({...u, topics: u.topics.map(t => t.id === topic.id ? {...t, assessment: {...t.assessment, questions: [...t.assessment.questions, { id: `q-${Date.now()}`, text: 'Soru metni...', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, topic: t.title }]}} : t)})))} className="w-full py-4 border-4 border-dashed rounded-[2rem] text-slate-300 font-black uppercase text-xs hover:bg-slate-50">+ YENİ SORU EKLE</button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

export default AdminWorkspace;
