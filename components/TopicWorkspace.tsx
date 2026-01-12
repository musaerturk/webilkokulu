
import React, { useState, useRef, useEffect } from 'react';
import { Topic, QuizResult, Grade, Subject, PresentationStep, MascotSettings } from '../types';
import Quiz from './Quiz';
import ActivityEngine from './ActivityEngine';
import Mascot from './Mascot';
import { generateSpeech, decodeBase64, decodeAudioData, gradeOpenEndedAnswers } from '../services/geminiService';

interface TopicWorkspaceProps {
  topic: Topic;
  grade: Grade;
  subject: Subject;
  mascots: MascotSettings[];
  onComplete: (result: QuizResult) => void;
  onBack: () => void;
}

const TopicWorkspace: React.FC<TopicWorkspaceProps> = ({ topic: initialTopic, grade, subject, mascots, onComplete, onBack }) => {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [activeTab, setActiveTab] = useState<'sunum' | 'etkinlik' | 'degerlendirme'>('sunum');
  const [activeDegerlendirmeSubTab, setActiveDegerlendirmeSubTab] = useState<'kavram' | 'acik-uclu'>('kavram');
  const [activeStep, setActiveStep] = useState<number>(0);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);

  const [openEndedAnswers, setOpenEndedAnswers] = useState<{ text: string, image?: string }[]>([]);
  const [gradingResult, setGradingResult] = useState<{ score: number, feedback: string[] } | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  const presentationMascot = mascots.find(m => m.role === 'presentation') || { type: 'turtle', name: 'Tonti' };
  const coachMascot = mascots.find(m => m.role === 'coach') || { type: 'fox', name: 'Fikir' };

  useEffect(() => {
    setTopic(initialTopic);
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  }, [initialTopic]);

  useEffect(() => {
    if (topic.extraAssessments?.openEnded) {
      setOpenEndedAnswers(topic.extraAssessments.openEnded.map(() => ({ text: '' })));
    }
  }, [topic]);

  const currentStep: PresentationStep | undefined = topic.presentationSteps?.[activeStep];

  const handleAISpeech = async () => {
    if (isPlaying) { stopAudio(); return; }
    if (!currentStep) return;

    if (currentStep.audioUrl && currentStep.audioUrl.startsWith('data:audio')) {
      const cacheKey = `stored_${currentStep.id}`;
      if (audioCacheRef.current.has(cacheKey)) {
        playBuffer(audioCacheRef.current.get(cacheKey)!);
      } else {
        setIsGeneratingSpeech(true);
        const base64Data = currentStep.audioUrl.split(',')[1];
        const audioData = decodeBase64(base64Data);
        const audioBuffer = await decodeAudioData(audioData, audioContextRef.current!);
        audioCacheRef.current.set(cacheKey, audioBuffer);
        setIsGeneratingSpeech(false);
        playBuffer(audioBuffer);
      }
      return;
    }

    const cacheKey = currentStep.id || 'default';
    if (audioCacheRef.current.has(cacheKey)) {
      playBuffer(audioCacheRef.current.get(cacheKey)!);
      return;
    }

    try {
      setIsGeneratingSpeech(true);
      const base64Audio = await generateSpeech(currentStep.content);
      if (!base64Audio) { setIsGeneratingSpeech(false); return; }
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioContextRef.current!);
      audioCacheRef.current.set(cacheKey, audioBuffer);
      setIsGeneratingSpeech(false);
      playBuffer(audioBuffer);
    } catch (err) {
      setIsGeneratingSpeech(false);
    }
  };

  const playBuffer = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;
    if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch(e) {}
    }
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => setIsPlaying(false);
    source.start(0);
    sourceNodeRef.current = source;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch(e) {}
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleGradeOpenEnded = async () => {
    if (openEndedAnswers.every(a => !a.text.trim() && !a.image)) return;
    setIsGrading(true);
    try {
      const result = await gradeOpenEndedAnswers(topic.extraAssessments!.openEnded!, openEndedAnswers);
      setGradingResult(result);
    } finally {
      setIsGrading(false);
    }
  };

  const renderVideo = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const vidId = url.split('v=')[1] || url.split('/').pop();
      return (
        <iframe 
          className="w-full h-full rounded-2xl" 
          src={`https://www.youtube.com/embed/${vidId}`} 
          title="Video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      );
    }
    return <video src={url} controls className="w-full h-full object-contain bg-black rounded-2xl" />;
  };

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-500"><i className="fas fa-arrow-left"></i></button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{topic.title}</h2>
          <p className="text-sm text-gray-500">{subject} • {grade}. Sınıf</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-blue-50">
        <div className="flex border-b overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('sunum')} className={`flex-1 min-w-[120px] py-5 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'sunum' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600'}`}><i className="fas fa-book-open"></i> SUNUM</button>
          <button onClick={() => setActiveTab('etkinlik')} className={`flex-1 min-w-[120px] py-5 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'etkinlik' ? 'text-orange-600 border-b-4 border-orange-600 bg-orange-50/50' : 'text-gray-400 hover:text-gray-600'}`}><i className="fas fa-puzzle-piece"></i> ETKİNLİK</button>
          <button onClick={() => setActiveTab('degerlendirme')} className={`flex-1 min-w-[120px] py-5 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'degerlendirme' ? 'text-green-600 border-b-4 border-green-600 bg-green-50/50' : 'text-gray-400 hover:text-gray-600'}`}><i className="fas fa-tasks"></i> TEST</button>
        </div>

        <div className="p-4 md:p-8 min-h-[500px]">
          {activeTab === 'sunum' && (
            <div className="animate-slideIn space-y-8">
              {activeStep === 0 && topic.infographicUrl && (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-4 shadow-xl mb-10 border-4 border-white">
                   <img src={topic.infographicUrl} className="w-full rounded-[2.5rem] shadow-2xl" alt="Konu Özeti" />
                   <p className="text-center text-white font-black text-xs uppercase tracking-[0.3em] py-4">Önce Bi' Göz At: Konu Özeti ✨</p>
                </div>
              )}

              {currentStep ? (
                <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
                    <div className="relative overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px]">
                      {currentStep.videoUrl ? (
                        <div className="w-full h-full p-4">{renderVideo(currentStep.videoUrl)}</div>
                      ) : currentStep.imageUrl ? (
                        <img src={currentStep.imageUrl} className="w-full h-full object-cover" alt="step" />
                      ) : (
                        <div className={`w-full h-full ${currentStep.color} flex items-center justify-center`}>
                          <i className={`fas ${currentStep.icon} text-6xl text-white opacity-20`}></i>
                        </div>
                      )}
                      
                      <button 
                        onClick={handleAISpeech} 
                        disabled={isGeneratingSpeech}
                        className={`absolute bottom-6 right-6 w-16 h-16 rounded-full flex flex-col items-center justify-center text-white shadow-2xl z-20 transition-all ${isGeneratingSpeech ? 'bg-gray-400 animate-pulse' : isPlaying ? 'bg-red-500' : 'bg-blue-600 hover:scale-110'}`}
                      >
                        <i className={`fas ${isGeneratingSpeech ? 'fa-spinner fa-spin' : isPlaying ? 'fa-pause' : 'fa-headset'} text-xl ${!isGeneratingSpeech && 'mb-1'}`}></i>
                        {!isGeneratingSpeech && !isPlaying && <span className="text-[8px] font-black uppercase">DİNLE</span>}
                      </button>
                    </div>
                    <div className="p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                         <Mascot type={presentationMascot.type as any} size="sm" imageUrl={presentationMascot.customImageUrl} />
                         <h3 className="text-3xl font-black uppercase tracking-tighter">{currentStep.title}</h3>
                      </div>
                      <p className="text-xl text-gray-600 font-medium italic leading-relaxed">"{currentStep.content}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400 font-bold italic">Bu konu için henüz bir sunum hazırlanmamış.</div>
              )}
              {topic.presentationSteps && topic.presentationSteps.length > 0 && (
                <div className="flex justify-between items-center px-4">
                  <button disabled={activeStep === 0} onClick={() => { stopAudio(); setActiveStep(prev => prev - 1); }} className="px-8 py-3 rounded-2xl bg-gray-100 font-black uppercase text-xs disabled:opacity-30">Geri</button>
                  <div className="flex gap-2">
                    {topic.presentationSteps.map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i === activeStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>)}
                  </div>
                  <button disabled={activeStep === topic.presentationSteps.length - 1} onClick={() => { stopAudio(); setActiveStep(prev => prev + 1); }} className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs disabled:opacity-30">İleri</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'etkinlik' && (
            <div className="animate-slideIn">
               {topic.activities && topic.activities.length > 0 ? (
                 <ActivityEngine activity={topic.activities[0]} mascots={mascots} onComplete={() => setActiveTab('degerlendirme')} />
               ) : (
                 <div className="text-center py-20"><p className="text-gray-400 font-bold italic">Bu konu için henüz bir etkinlik tanımlanmamış.</p></div>
               )}
            </div>
          )}

          {activeTab === 'degerlendirme' && (
            <div className="animate-slideIn">
              <div className="flex flex-wrap gap-2 mb-8 bg-green-50 p-2 rounded-2xl w-fit mx-auto">
                 <button onClick={() => setActiveDegerlendirmeSubTab('kavram')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase ${activeDegerlendirmeSubTab === 'kavram' ? 'bg-green-600 text-white shadow-md' : 'text-green-400'}`}>Konu Testi</button>
                 {topic.extraAssessments?.openEnded && <button onClick={() => setActiveDegerlendirmeSubTab('acik-uclu')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase ${activeDegerlendirmeSubTab === 'acik-uclu' ? 'bg-amber-600 text-white' : 'text-amber-400'}`}>Açık Uçlu</button>}
              </div>

              {activeDegerlendirmeSubTab === 'kavram' && (
                topic.assessment && topic.assessment.questions && topic.assessment.questions.length > 0 ? (
                  <Quiz assessment={{...topic.assessment, subject, grade, title: topic.title}} mascots={mascots} onComplete={onComplete} />
                ) : (
                  <div className="text-center py-20 flex flex-col items-center">
                    <Mascot type={(mascots.find(m => m.role === 'assessment') || { type: 'rabbit' }).type as any} size="md" imageUrl={(mascots.find(m => m.role === 'assessment') || {}).customImageUrl} className="opacity-20 mb-4" />
                    <p className="text-gray-400 font-bold italic uppercase text-xs">Bu konu için henüz test sorusu üretilmemiş.</p>
                  </div>
                )
              )}
              
              {activeDegerlendirmeSubTab === 'acik-uclu' && topic.extraAssessments?.openEnded && (
                <div className="max-w-3xl mx-auto space-y-12 animate-fadeIn pb-16">
                  {topic.extraAssessments.openEnded.map((q, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                      <h4 className="text-xl font-bold text-gray-800 leading-tight">{q}</h4>
                      <textarea className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 min-h-[150px] outline-none font-medium text-gray-700" placeholder="Cevabını buraya yaz..." value={openEndedAnswers[idx]?.text || ''} onChange={(e) => {
                         const na = [...openEndedAnswers]; na[idx].text = e.target.value; setOpenEndedAnswers(na);
                      }} />
                    </div>
                  ))}
                  <button onClick={handleGradeOpenEnded} disabled={isGrading} className="w-full bg-amber-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl">{isGrading ? 'Puanlanıyor...' : 'ÖĞRETMENE GÖNDER'}</button>
                  {gradingResult && (
                    <div className="mt-12 bg-green-50 rounded-[3rem] p-10 border-4 border-green-200 animate-slideIn">
                      <div className="flex items-center gap-6 mb-8">
                         <Mascot type={coachMascot.type as any} size="md" imageUrl={coachMascot.customImageUrl} />
                         <div><h3 className="text-3xl font-black text-green-900 uppercase">{coachMascot.name}'İN NOTU: {gradingResult.score}</h3></div>
                      </div>
                      <div className="space-y-4">{gradingResult.feedback.map((f, i) => <p key={i} className="bg-white p-4 rounded-xl text-gray-700 italic border border-green-100">"{f}"</p>)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicWorkspace;
