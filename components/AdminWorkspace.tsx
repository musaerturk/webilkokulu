
import React, { useState } from 'react';
import { Topic, Grade, Subject, PresentationStep, Activity, Unit, ActivityType, Question } from '../types';
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
  const [activeTab, setActiveTab] = useState<'content' | 'visuals' | 'activities' | 'assessment'>('content');
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  const [wizardConcepts, setWizardConcepts] = useState('');
  const [wizardOutcomes, setWizardOutcomes] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [gameImage, setGameImage] = useState<string | undefined>(undefined);
  const [learningOutcome, setLearningOutcome] = useState('');
  const [questionCount, setQuestionCount] = useState(4);

  // Manuel Soru State
  const [manualQuestion, setManualQuestion] = useState<Partial<Question>>({ text: '', options: ['', '', ''], correctAnswer: 0, topic: '' });

  const handleSave = () => {
    onSaveUnits(units);
    setHasUnsavedChanges(false);
    alert("Değişiklikler başarıyla kaydedildi!");
  };

  const updateTopicData = (data: Partial<Topic>) => {
    if (selectedUnitIdx === null || selectedTopicIdx === null) return;
    setHasUnsavedChanges(true);
    setUnits(prev => prev.map((unit, uIdx) => {
      if (uIdx !== selectedUnitIdx) return unit;
      return {
        ...unit,
        topics: unit.topics.map((topic, tIdx) => {
          if (tIdx !== selectedTopicIdx) return topic;
          return { ...topic, ...data };
        })
      };
    }));
  };

  const handleAiPresentationWizard = async () => {
    if (selectedUnitIdx === null || selectedTopicIdx === null) return;
    const topic = units[selectedUnitIdx].topics[selectedTopicIdx];
    if (!wizardConcepts) { alert("Lütfen ana kavramları girin."); return; }
    
    setIsAiLoading(true);
    try {
      setLoadingStep('Pedagojik Kurgu Hazırlanıyor...');
      const slides = await generatePresentationAI(grade, subject, topic.title, wizardConcepts, wizardOutcomes);
      const enrichedSlides: PresentationStep[] = [];
      
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        setLoadingStep(`Slayt ${i+1}/${slides.length}: Görsel ve Ses İşleniyor...`);
        const imageUrl = await generateSlideImage((slide as any).imageDescription);
        const audioBase64 = await generateAISpeech((slide as any).audioScript || slide.content);
        enrichedSlides.push({
          ...slide,
          imageUrl: imageUrl || undefined,
          audioUrl: audioBase64 ? `data:audio/pcm;base64,${audioBase64}` : undefined
        });
      }
      updateTopicData({ presentationSteps: enrichedSlides });
    } finally {
      setIsAiLoading(false);
      setLoadingStep('');
    }
  };

  const handleManualQuestionAdd = () => {
    if (!manualQuestion.text || manualQuestion.options?.some(o => !o)) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    const topic = units[selectedUnitIdx!].topics[selectedTopicIdx!];
    const newQ: Question = {
      id: `q-manual-${Date.now()}`,
      text: manualQuestion.text!,
      options: manualQuestion.options!,
      correctAnswer: manualQuestion.correctAnswer!,
      topic: manualQuestion.topic || 'Genel'
    };
    updateTopicData({ assessment: { ...topic.assessment, questions: [...(topic.assessment.questions || []), newQ] } });
    setManualQuestion({ text: '', options: ['', '', ''], correctAnswer: 0, topic: '' });
  };

  if (selectedUnitIdx === null) {
    return (
      <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
         <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl border-b-8 border-indigo-600 gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Müfredat Stüdyosu</h2>
              <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mt-2">{grade}. Sınıf / {subject}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setHasUnsavedChanges(true); setUnits([...units, { id: `U-${Date.now()}`, title: 'Yeni Ünite', topics: [] }]); }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg">+ ÜNİTE EKLE</button>
              <button onClick={onBack} className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Geri Dön</button>
            </div>
         </div>
         <div className="mt-12 space-y-10">
            {units.map((unit, uIdx) => (
              <div key={unit.id} className="bg-white rounded-[3rem] shadow-xl border overflow-hidden">
                <div className="bg-slate-50 p-8 flex flex-col gap-6 border-b">
                   <div className="flex items-center justify-between gap-6">
                      <input className="bg-transparent text-2xl font-black text-slate-800 outline-none w-full border-b-2 border-transparent focus:border-indigo-600" value={unit.title} onChange={e => {
                        setHasUnsavedChanges(true);
                        setUnits(prev => prev.map((un, i) => i === uIdx ? { ...un, title: e.target.value } : un));
                      }} />
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setHasUnsavedChanges(true);
                          setUnits(prev => prev.map((un, i) => i === uIdx ? { ...un, topics: [...un.topics, { id: `T-${Date.now()}`, title: 'Yeni Konu', presentationSteps: [], activities: [], assessment: { id: `as-${Date.now()}`, questions: [] } }] } : un));
                        }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-md">+ KONU EKLE</button>
                        <button onClick={() => { if(confirm("Silmek istiyor musun?")) setUnits(prev => prev.filter((_, i) => i !== uIdx)); }} className="bg-red-50 text-red-500 px-4 py-3 rounded-xl"><i className="fas fa-trash"></i></button>
                      </div>
                   </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {unit.topics.map((topic, tIdx) => (
                     <div key={topic.id} className="bg-slate-50 p-6 rounded-[2.5rem] flex flex-col justify-between group border-2 border-transparent hover:border-indigo-100 transition-all">
                        <p className="font-black text-slate-700 text-lg mb-4">{topic.title}</p>
                        <button onClick={() => { setSelectedUnitIdx(uIdx); setSelectedTopicIdx(tIdx); }} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg hover:bg-indigo-600 transition-all">İÇERİĞİ DÜZENLE</button>
                     </div>
                   ))}
                </div>
              </div>
            ))}
         </div>
         {hasUnsavedChanges && (
           <button onClick={handleSave} className="fixed bottom-10 right-10 px-12 py-6 rounded-[3rem] bg-orange-500 text-white font-black text-xl uppercase shadow-2xl z-50 animate-bounce">KAYDET VE YAYINLA</button>
         )}
      </div>
    );
  }

  const topic = units[selectedUnitIdx].topics[selectedTopicIdx!];

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-32">
      {isAiLoading && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-white text-center p-10">
           <Mascot type="fox" size="lg" className="animate-bounce" />
           <h3 className="text-3xl font-black uppercase mt-8">AI Stüdyosu Aktif ⚡</h3>
           <p className="text-indigo-400 font-bold italic text-xl mt-2">{loadingStep}</p>
        </div>
      )}

      <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl mb-10 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button onClick={() => { setSelectedUnitIdx(null); setSelectedTopicIdx(null); }} className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center hover:bg-white/20"><i className="fas fa-arrow-left"></i></button>
            <div>
               <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">KONU EDİTÖRÜ</span>
               <h3 className="text-3xl font-black">{topic.title}</h3>
            </div>
         </div>
      </div>

      <div className="flex bg-white p-2 rounded-[2.5rem] shadow-lg mb-10 border overflow-x-auto no-scrollbar">
         <button onClick={() => setActiveTab('content')} className={`flex-1 min-w-[120px] py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'content' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>AI SUNUM</button>
         <button onClick={() => setActiveTab('activities')} className={`flex-1 min-w-[120px] py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'activities' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-400'}`}>OYUN LAB</button>
         <button onClick={() => setActiveTab('assessment')} className={`flex-1 min-w-[120px] py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'assessment' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400'}`}>SORU FABRİKASI</button>
         <button onClick={() => setActiveTab('visuals')} className={`flex-1 min-w-[120px] py-5 rounded-3xl font-black text-[10px] uppercase transition-all ${activeTab === 'visuals' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-400'}`}>GÖRSELLER</button>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-10">
           <div className="bg-indigo-50 p-10 rounded-[3.5rem] border-4 border-indigo-100 shadow-xl">
              <h3 className="text-2xl font-black text-indigo-900 uppercase mb-4">Pedagojik Sunum Sihirbazı</h3>
              <p className="text-indigo-400 text-xs font-bold uppercase mb-6">AI; sesli anlatım, pedagojik kurgu ve görsellerle profesyonel bir akış hazırlar.</p>
              <textarea value={wizardConcepts} onChange={e => setWizardConcepts(e.target.value)} placeholder="Dersin ana kavramları ve alt başlıkları (Örn: Çıkarma İşlemi, Eksilen, Çıkan, Fark)..." className="w-full bg-white p-6 rounded-[2rem] border-2 border-indigo-200 outline-none mb-6 font-bold min-h-[120px]" />
              <button onClick={handleAiPresentationWizard} className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-2xl hover:bg-indigo-700 transition-all">AI İLE SUNUMU TASARLA 🚀</button>
           </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-10">
           <div className="bg-orange-50 p-10 rounded-[4rem] border-4 border-orange-100 shadow-xl">
              <h3 className="text-2xl font-black text-orange-900 uppercase mb-4">Görsel Destekli Oyun Laboratuvarı</h3>
              <p className="text-orange-400 text-xs font-bold uppercase mb-8">AI artık mekanikleri ve kuralları tasarlıyor. İstersen bir resim yükleyerek onu oyuna çevir!</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-4">
                    <label className="text-xs font-black text-orange-600 uppercase ml-2">Oyun Teması & Mekanik İsteği</label>
                    <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Örn: Ormanda kaybolan bir sincap doğru meyveleri toplayarak yuvasına ulaşıyor..." className="w-full bg-white p-6 rounded-[2.5rem] border-2 border-orange-200 outline-none font-bold min-h-[150px]" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs font-black text-orange-600 uppercase ml-2">Referans Resim (Multimodal)</label>
                    <div className="bg-white border-2 border-dashed border-orange-200 rounded-[2.5rem] h-[150px] flex items-center justify-center relative overflow-hidden group">
                       {gameImage ? <img src={gameImage} className="w-full h-full object-cover" /> : <div className="text-center text-orange-300"><i className="fas fa-camera text-3xl mb-2"></i><p className="text-[10px] font-black">RESİM ANALİZİ İÇİN SEÇ</p></div>}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => {
                         const file = e.target.files?.[0];
                         if(file) { const reader = new FileReader(); reader.onload = () => setGameImage(reader.result as string); reader.readAsDataURL(file); }
                       }} />
                    </div>
                 </div>
              </div>
              <button onClick={async () => {
                setIsAiLoading(true);
                try {
                  const act = await generateActivityAI(grade, subject, 'animated-adventure', aiPrompt, gameImage?.split(',')[1]);
                  updateTopicData({ activities: [...topic.activities, act] });
                  setAiPrompt(''); setGameImage(undefined);
                } finally { setIsAiLoading(false); }
              }} className="w-full bg-orange-600 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-2xl">OYUNU MEKANİKLERİYLE TASARLA 🕹️</button>
           </div>
        </div>
      )}

      {activeTab === 'assessment' && (
        <div className="space-y-12">
           {/* Manuel Soru Paneli */}
           <div className="bg-white p-10 rounded-[4rem] border-4 border-emerald-100 shadow-xl">
              <h3 className="text-2xl font-black text-emerald-900 uppercase mb-6 flex items-center gap-3"><i className="fas fa-pencil-alt"></i> Manuel Soru Ekle</h3>
              <div className="space-y-6">
                 <input className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 font-bold" placeholder="Soru Metni..." value={manualQuestion.text} onChange={e => setManualQuestion({...manualQuestion, text: e.target.value})} />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {manualQuestion.options?.map((opt, i) => (
                      <input key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-bold" placeholder={`${String.fromCharCode(65+i)} Şıkkı`} value={opt} onChange={e => {
                        const newOpts = [...(manualQuestion.options || [])];
                        newOpts[i] = e.target.value;
                        setManualQuestion({...manualQuestion, options: newOpts});
                      }} />
                    ))}
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <select className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-black text-[10px] uppercase" value={manualQuestion.correctAnswer} onChange={e => setManualQuestion({...manualQuestion, correctAnswer: parseInt(e.target.value)})}>
                       <option value={0}>Doğru Cevap: A</option>
                       <option value={1}>Doğru Cevap: B</option>
                       <option value={2}>Doğru Cevap: C</option>
                    </select>
                    <input className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-sm" placeholder="Kazanım Etiketi (Örn: Toplama)" value={manualQuestion.topic} onChange={e => setManualQuestion({...manualQuestion, topic: e.target.value})} />
                 </div>
                 <button onClick={handleManualQuestionAdd} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg">BANKAYA EKLE</button>
              </div>
           </div>

           {/* AI Soru Paneli */}
           <div className="bg-emerald-900 p-10 rounded-[4rem] text-white shadow-2xl">
              <h3 className="text-2xl font-black uppercase mb-4">AI Soru Fabrikası</h3>
              <textarea value={learningOutcome} onChange={e => setLearningOutcome(e.target.value)} placeholder="Ölçülecek kazanım detayı..." className="w-full bg-white/10 p-6 rounded-[2rem] border-2 border-white/20 outline-none mb-6 font-bold" />
              <button onClick={async () => {
                if(!learningOutcome) return;
                setIsAiLoading(true);
                try {
                  const result = await generateAssessmentAI(grade, subject, questionCount, learningOutcome);
                  updateTopicData({ assessment: { ...topic.assessment, questions: [...(topic.assessment.questions || []), ...result.questions] } });
                  setLearningOutcome('');
                } finally { setIsAiLoading(false); }
              }} className="w-full bg-emerald-500 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-2xl">AI İLE SORU ÜRET ⚡</button>
           </div>
        </div>
      )}

      {activeTab === 'visuals' && (
        <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 max-w-2xl mx-auto">
           <h3 className="text-xl font-black text-slate-800 uppercase mb-8">Konu Kapak Görseli</h3>
           <div className="aspect-video bg-slate-50 rounded-[3rem] relative overflow-hidden group flex items-center justify-center">
              {topic.coverImage ? <img src={topic.coverImage} className="w-full h-full object-cover" /> : <i className="fas fa-image text-slate-200 text-6xl"></i>}
              <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                 <span className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black uppercase text-xs">YÜKLE</span>
                 <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                   const file = e.target.files?.[0];
                   if(file) { const r = new FileReader(); r.onload = () => updateTopicData({ coverImage: r.result as string }); r.readAsDataURL(file); }
                 }} />
              </label>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkspace;
