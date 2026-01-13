
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
  onLoginClick: () => void;
  isAdmin: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ stats, currentUser, isGuest, onGradeSelect, onLibraryClick, onMusicClick, onLoginClick, isAdmin }) => {
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın Küçük Kaşif!";
    if (hour < 18) return "Tünaydın Bilgi Avcısı!";
    return "İyi Akşamlar Geleceğin Yıldızı!";
  };

  const renderGradeCard = (grade: Grade) => {
    if (grade === 'SC') return null;

    const isLocked = !isAdmin && !isGuest && grade !== currentUser.grade;

    return (
      <button
        key={grade}
        disabled={isLocked}
        onClick={() => onGradeSelect(grade)}
        className={`group bg-white p-6 rounded-[3.5rem] shadow-2xl transition-all duration-300 active:scale-95 flex flex-col items-center border-b-[10px] ${isLocked ? 'opacity-40 grayscale cursor-not-allowed border-gray-200' : 'hover:-translate-y-4 border-blue-100 hover:border-blue-600'} w-full`}
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
          {`${grade}. SINIF`}
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
          
          {/* SAĞ ÜST GİRİŞ BUTONU */}
          {isGuest && (
            <button 
              onClick={onLoginClick}
              className="absolute top-8 right-8 md:top-12 md:right-12 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/30 transition-all active:scale-95 flex items-center gap-2 group"
            >
              <i className="fas fa-user-circle text-lg group-hover:rotate-12 transition-transform"></i>
              Giriş Yap
            </button>
          )}

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
                  ? "Tüm sınıfları ve müfredatı inceleyebilirsin. Dersleri başlatmak için aramıza katıl!" 
                  : `Bugün senin için hazırladığımız ${currentUser.grade}. Sınıf maceralarına atılmaya ne dersin?`}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 <button onClick={onLibraryClick} className="bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 transition-all">
                   📚 Büyülü Kütüphane
                 </button>
                 <button onClick={onMusicClick} className="bg-pink-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 transition-all border-b-4 border-pink-700">
                   🎵 Notalı Bahçe
                 </button>
              </div>
            </div>

            {/* Sadece 1-4. Sınıf Kartları */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-96">
               {[1, 2, 3, 4].map(g => renderGradeCard(g as Grade))}
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

      {/* 3. SESTEN CÜMLEYE - ÖZEL TANITIM BLOĞU */}
      <section className="max-w-7xl mx-auto px-6">
         <div 
           onClick={() => onGradeSelect('SC')}
           className="bg-white rounded-[5rem] overflow-hidden shadow-2xl border-4 border-fuchsia-100 flex flex-col lg:flex-row cursor-pointer group hover:border-fuchsia-400 transition-all duration-500"
         >
            <div className="bg-fuchsia-500 p-12 lg:w-1/3 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-fuchsia-600 transition-colors">
               <GradeSymbol grade="SC" size="lg" className="mb-6 relative z-10" />
               <div className="text-white text-center relative z-10">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">SES DÜNYASI</h3>
                  <p className="text-fuchsia-200 font-bold text-xs uppercase tracking-widest mt-2">Okuma Yazmaya İlk Adım</p>
               </div>
               <div className="absolute -bottom-10 -left-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                  <Mascot type="owl" size="xl" />
               </div>
            </div>

            <div className="p-12 lg:w-2/3 flex flex-col justify-center space-y-6 relative">
               <div className="flex items-center gap-3">
                  <span className="bg-fuchsia-100 text-fuchsia-600 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">YENİ MÜFREDAT UYUMLU</span>
                  <div className="h-1 flex-1 bg-fuchsia-50 rounded-full"></div>
               </div>
               
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                  SESTEN CÜMLEYE: <br/> 
                  <span className="text-fuchsia-600">ANLAYARAK OKUMA</span> SİSTEMİ
               </h2>

               <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                  "Harfler sadece birer çizgi değildir; onlar birer ses, birer duygu ve birer hikayedir. 
                  Yaratıcı metinlerimiz ve etkileşimli oyunlarımızla çocuğunuz okumayı ezberleyerek değil, 
                  <span className="text-slate-800 font-black not-italic"> neşeyle keşfederek ve anlayarak öğrenecek!</span>"
               </p>

               <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                        <i className="fas fa-magic"></i>
                     </div>
                     <span className="font-black text-xs text-slate-600 uppercase">Etkileşimli Hikayeler</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <i className="fas fa-brain"></i>
                     </div>
                     <span className="font-black text-xs text-slate-600 uppercase">Yaratıcı Kavrama</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                        <i className="fas fa-smile-beam"></i>
                     </div>
                     <span className="font-black text-xs text-slate-600 uppercase">Eğlenceli Süreç</span>
                  </div>
               </div>

               <div className="pt-6">
                  <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl group-hover:bg-fuchsia-600 group-hover:scale-105 transition-all">
                     Okumayı Keşfet <i className="fas fa-arrow-right ml-3 animate-bounce-x"></i>
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* 4. STATS SECTION */}
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
    </div>
  );
};

export default LandingPage;
