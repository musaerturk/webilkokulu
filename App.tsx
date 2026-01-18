
import React, { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
import { PanelType, UserProfile, InfoPageType } from './types';

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('HOME');
  const [activeInfoPage, setActiveInfoPage] = useState<InfoPageType>('ABOUT');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Ahmet Yılmaz',
    interests: ['Yazılım', 'Müzik', 'Edebiyat'],
    photo: 'https://picsum.photos/200',
    bio: 'Öğrenmeyi seven bir yazılımcı.'
  });

  const handleNavigateInfo = (type: InfoPageType) => {
    setActiveInfoPage(type);
    setActivePanel('INFO');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Quicksand']">
      {/* 
        GÜNCELLENMİŞ NAVİGASYON (GÖRSELDEKİ TASARIM) 
      */}
      <nav className="bg-white border-b border-slate-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        {/* Sol Taraf: Logo ve Slogan */}
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => setActivePanel('HOME')}
        >
          <div className="relative flex items-center justify-center">
            {/* Özel Logo İkonu (Görseldekine benzer şekilde zenginleştirildi) */}
            <div className="relative w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100 transform group-hover:scale-105 transition-transform">
              W
              <span className="absolute -top-1 -right-1 text-xs animate-bounce">🚀</span>
              <span className="absolute -bottom-1 -left-1 text-xs">🏠</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter leading-none">
              <span className="text-indigo-600">WEB</span>
              <span className="text-emerald-500">İLKOKULU</span>
            </h1>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mt-1">
              SANA ÖZEL OKUL
            </span>
          </div>
        </div>
        
        {/* Sağ Taraf: Aksiyon İkonları */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActivePanel('ADMIN')}
            title="Yönetici Paneli"
            className={`p-2.5 rounded-xl transition-all ${activePanel === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </button>
          
          <button 
            onClick={() => setActivePanel('USER')}
            title="Kullanıcı Paneli"
            className={`p-1.5 rounded-full border-2 transition-all ${activePanel === 'USER' ? 'border-emerald-500 bg-emerald-50' : 'border-transparent hover:border-slate-200'}`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {activePanel === 'HOME' && (
          <LandingPage 
            onStart={() => setActivePanel('USER')} 
            onNavigateInfo={handleNavigateInfo}
            onAdminClick={() => {
              setActivePanel('ADMIN');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {activePanel === 'ADMIN' && (
          <AdminPanel />
        )}
        {activePanel === 'USER' && (
          <UserPanel profile={userProfile} onUpdate={setUserProfile} />
        )}
        {activePanel === 'INFO' && (
          <InfoPage type={activeInfoPage} onBack={() => setActivePanel('HOME')} />
        )}
      </main>
    </div>
  );
};

export default App;
