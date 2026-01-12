
import React from 'react';
import Mascot from './Mascot';
import GradeSymbol from './GradeSymbol';
import { Grade, UserProfile } from '../types';

interface LandingPageProps {
  stats: {
    totalLessons: number;
    totalPresentations: number;
    totalQuestions: number;
    totalActivities: number;
  };
  currentUser: UserProfile;
  isGuest: boolean;
  onGradeSelect: (grade: Grade) => void;
  onLibraryClick: () => void;
  onMusicClick: () => void;
  isAdmin: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ stats, currentUser, isGuest, onGradeSelect, onLibraryClick, onMusicClick, isAdmin }) => {
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın Küçük Kaşif!";
    if (hour < 18) return "Tünaydın Bilgi Avcısı!";
    return "İyi Akşamlar Geleceğin Yıldızı!";
  };

  const renderGradeCard = (grade: Grade, isFullWidth: boolean = false) => {
    const isLocked = !isAdmin && !isGuest && grade !== currentUser.grade;

    return (
      <button
        key={grade}
        disabled={isLocked}
        onClick={() => onGradeSelect(grade)}
        className={`group bg-white p-6 rounded-[3.5rem] shadow-2xl transition-all duration-300 active:scale-95 flex flex-col items-center border-b-[10px] ${isLocked ? 'opacity-40 grayscale cursor-not-allowed border-gray-200' : 'hover:-translate-y-4 border-blue-100 hover:border-blue-600'} ${isFullWidth ? 'w-full md:w-80' : 'w-full'}`}
      >
        <div className="relative">
          <GradeSymbol grade={grade} size="md" className="mb-4 transform group-hover:scale-110 transition-transform" />
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
               <i className="fas fa-lock text-3xl"></i>
            </div>
          )}
        </div>
        <span className="text-slate-800 font-black text-sm uppercase tracking-tighter">
          {grade === 'SC' ? 'Sesten Cümleye Dünyası' : `${grade}. SINIF`}
        </span>
        {isLocked && <span className="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Senin Kursun Değil</span>}
      </button>
    );
  };

  return (
    <div className="space-y-24 animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section className="relative">
        <div className="bg-gradient-to-br from-indigo-600 via-blue-500 to-emerald-400 rounded-[5rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
              <div className="inline-block bg-white/20 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
                {isGuest ? 'KEŞİF MODU AKTİF! ✨' : `SELAM ${currentUser.name.split(' ')[0]}! 🍎`}
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-6">
                {getWelcomeMessage()}
              </h1>
              <p className="text-xl md:text-2xl font-medium text-blue-50/90 italic max-w-2xl mb-12">
                {isGuest 
                  ? "Uygulamadaki tüm üniteleri ve ders içeriklerini önizleyebilirsin. Dersleri başlatmak için aramıza katıl!" 
                  : `Bugün senin için hazırladığımız ${currentUser.grade}. Sınıf maceralarına atılmaya ne dersin?`}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 <button onClick={onLibraryClick} className="bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 transition-all">
                   📚 Büyülü Kütüphane
                 </button>
                 <button onClick={onMusicClick} className="bg-pink-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 transition-all border-b-4 border-pink-700">
                   🎵 Notalı Bahçe
                 </button>
                 <a href="#kesfet" className="bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                   Neler Var? <i className="fas fa-chevron-down ml-2"></i>
                 </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-auto">
               <div className="grid grid-cols-2 gap-4">
                  {renderGradeCard(1)}
                  {renderGradeCard(2)}
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {renderGradeCard(3)}
                  {renderGradeCard(4)}
               </div>
               <div className="flex justify-center">
                  {renderGradeCard('SC', true)}
               </div>
            </div>
          </div>
          <div className="absolute top-10 left-10 opacity-20"><Mascot type="rabbit" size="xl" className="rotate-12" /></div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="kesfet" className="max-w-7xl mx-auto px-6">
         <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">NEDEN WEBİLKOKULU?</h2>
            <div className="h-2 w-40 bg-blue-600 mx-auto rounded-full"></div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-50 hover:shadow-2xl transition-all group">
               <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:bg-orange-600 group-hover:text-white transition-all">
                 <i className="fas fa-check-double"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-800 uppercase mb-4 leading-none">Tam MEB Uyumu</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Okul derslerinle %100 uyumlu, güncel MEB müfredatını birebir takip eden içerikler.</p>
            </div>

            <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-50 hover:shadow-2xl transition-all group">
               <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                 <i className="fas fa-gamepad"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-800 uppercase mb-4 leading-none">İnteraktif Maceralar</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Sıkıcı dersler yerine oyunlar ve sürükle-bırak etkinliklerle keşfederek öğrenme.</p>
            </div>

            <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-50 hover:shadow-2xl transition-all group">
               <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
                 <i className="fas fa-award"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-800 uppercase mb-4 leading-none">Bireysel Başarı Modeli</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Her çocuğun kendi hızında ilerlediği, başarıyı ödüllendiren kişiye özel sistem.</p>
            </div>

            <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-50 hover:shadow-2xl transition-all group">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <i className="fas fa-brain"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-800 uppercase mb-4 leading-none">AI Rehberlik</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Fikir ve Bilkuş, eksiklerini anında analiz eder ve sana özel çalışma planı sunar.</p>
            </div>
         </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="bg-slate-900 rounded-[6rem] p-16 md:p-24 text-white relative overflow-hidden mx-4">
         <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="space-y-4">
               <i className="fas fa-book-open text-blue-400 text-4xl mb-2"></i>
               <div className="text-6xl font-black tracking-tighter leading-none">{stats.totalLessons}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Toplam Kurs</div>
            </div>
            <div className="space-y-4">
               <i className="fas fa-photo-video text-emerald-400 text-4xl mb-2"></i>
               <div className="text-6xl font-black tracking-tighter leading-none">{stats.totalPresentations}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sunum Kartı</div>
            </div>
            <div className="space-y-4">
               <i className="fas fa-puzzle-piece text-orange-400 text-4xl mb-2"></i>
               <div className="text-6xl font-black tracking-tighter leading-none">{stats.totalActivities}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">İnteraktif Oyun</div>
            </div>
            <div className="space-y-4">
               <i className="fas fa-tasks text-purple-400 text-4xl mb-2"></i>
               <div className="text-6xl font-black tracking-tighter leading-none">{stats.totalQuestions}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Soru Bankası</div>
            </div>
         </div>
         <div className="absolute right-[-10%] bottom-[-10%] opacity-10"><Mascot type="owl" size="xl" /></div>
      </section>

      {/* 4. FOOTER CTA */}
      <section className="text-center py-20 bg-white rounded-[5rem] border-8 border-blue-50 shadow-2xl mx-6">
         <Mascot type="fox" size="lg" className="mx-auto mb-8 animate-slowPulse" />
         <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6">Maceraya Katılmaya Hazır mısın?</h2>
         <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto px-6">Binlerce kaşif burada öğreniyor. Sen de sınıfını seç ve hemen başla!</p>
         <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-blue-600 text-white px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-lg shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
           BAŞLIYORUZ! <i className="fas fa-rocket ml-3"></i>
         </button>
      </section>
    </div>
  );
};

export default LandingPage;
