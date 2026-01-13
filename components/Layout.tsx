
import React, { useState, useEffect } from 'react';
import { Grade, UserProfile, SiteSettings } from '../types';
import GradeSymbol from './GradeSymbol';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onAdvisorClick?: () => void;
  onProfileClick?: () => void;
  onAdminClick: () => void;
  onViewChange?: (view: string) => void;
  onLoginClick?: () => void; // Giriş butonu için yeni prop
  currentGrade: Grade | null;
  currentUser?: UserProfile;
  isGuest: boolean;
  siteSettings: SiteSettings;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onHomeClick, 
  onAdminClick, 
  onViewChange, 
  onLoginClick,
  currentGrade, 
  currentUser, 
  isGuest, 
  siteSettings 
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // Sayfa açıldıktan 2 saniye sonra karşılama balonunu göster
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppRedirect = () => {
    const cleanPhone = siteSettings.contactPhone.replace(/\D/g, '');
    const message = encodeURIComponent("Merhaba Webilkokulu! Bir sorum olacaktı...");
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center cursor-pointer group" onClick={onHomeClick}>
              <div className="mr-4 h-14 w-14 transition-all group-hover:scale-110 duration-300 drop-shadow-sm">
                <img 
                  src={siteSettings.logoUrl} 
                  alt="WEBİLKOKULU Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 tracking-tighter">
                  WEBİLKOKULU
                </h1>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1 ml-0.5">{siteSettings.slogan || 'SANA ÖZEL OKUL'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {currentGrade && !isGuest && (
                <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl shadow-inner">
                    <GradeSymbol grade={currentGrade} size="sm" className="mr-3" />
                    <span className="text-gray-700 font-black text-xs uppercase">{currentGrade}. Sınıf Alanındasın</span>
                </div>
              )}
              <nav className="flex items-center space-x-2">
                {/* GLOBAL BANNER GİRİŞ BUTONU */}
                {isGuest && (
                  <button 
                    onClick={onLoginClick}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
                  >
                    <i className="fas fa-user-circle text-sm"></i>
                    Giriş Yap
                  </button>
                )}

                {isAdmin && (
                  <button 
                    onClick={onAdminClick}
                    className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Yönetim Paneli"
                  >
                    <i className="fas fa-tools text-xl"></i>
                  </button>
                )}
                {!isGuest && (
                  <button className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                    <i className="fas fa-user-circle text-xl"></i>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">{children}</main>

      {/* WHATSAPP CHAT PANEL */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
        {/* Chat Window */}
        {isChatOpen && (
          <div className="mb-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-bounceIn origin-bottom-right">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600">
                  <i className="fab fa-whatsapp text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">Destek Hattı</h4>
                  <p className="text-[10px] font-bold text-emerald-100 opacity-80 uppercase">Genellikle 5dk içinde döneriz</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                <p className="text-sm font-bold text-slate-700 italic">"Merhaba! Ben Webilkokulu Asistanı. Size nasıl yardımcı olabilirim? 😊"</p>
              </div>
              <button 
                onClick={handleWhatsAppRedirect}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <i className="fab fa-whatsapp text-lg"></i> WHATSAPP İLE BAĞLAN
              </button>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <div className="relative group">
          {showBubble && !isChatOpen && (
            <div className="absolute bottom-full right-0 mb-4 bg-white px-6 py-3 rounded-2xl rounded-br-none shadow-xl border border-slate-50 text-slate-700 font-black text-xs whitespace-nowrap animate-fadeIn">
              Nasıl yardımcı olabilirim? 👋
              <button onClick={() => setShowBubble(false)} className="ml-3 text-slate-300 hover:text-slate-500"><i className="fas fa-times"></i></button>
            </div>
          )}
          <button 
            onClick={() => { setIsChatOpen(!isChatOpen); setShowBubble(false); }}
            className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-90 ${isChatOpen ? 'bg-slate-900' : 'bg-emerald-500'}`}
          >
            <i className={`fas ${isChatOpen ? 'fa-times' : 'fa-comments'} text-2xl`}></i>
            {!isChatOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
          </button>
        </div>
      </div>

      <footer className="bg-slate-900 text-white pt-20 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={onHomeClick}>
                  <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-xl transform transition-transform group-hover:rotate-6">
                    <img src={siteSettings.logoUrl} className="w-full h-full object-contain" alt="W" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">WEBİLKOKULU</h3>
                </div>
                <p className="text-slate-400 font-medium italic leading-relaxed text-sm">{siteSettings.footerDescription}</p>
                <div className="flex gap-4">
                  <a href={siteSettings.socialMedia.instagram} target="_blank" rel="noreferrer"><i className="fab fa-instagram text-xl hover:pink-500 transition-colors"></i></a>
                  <a href={siteSettings.socialMedia.youtube} target="_blank" rel="noreferrer"><i className="fab fa-youtube text-xl hover:text-red-500 transition-colors"></i></a>
                  <a href={siteSettings.socialMedia.twitter} target="_blank" rel="noreferrer"><i className="fab fa-twitter text-xl hover:text-blue-400 transition-colors"></i></a>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-xs text-indigo-400">Kurumsal</h4>
                <ul className="space-y-3">
                  <li><button onClick={() => onViewChange?.('about')} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">Hakkımızda</button></li>
                  <li><button onClick={() => onViewChange?.('kvkk')} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">Gizlilik & KVKK</button></li>
                  <li><button onClick={() => onViewChange?.('terms')} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">Kullanım Şartları</button></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-xs text-emerald-400">Eğitim</h4>
                <ul className="space-y-3">
                  <li><button onClick={() => onViewChange?.('library')} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">Büyülü Kütüphane</button></li>
                  <li><button onClick={() => onViewChange?.('music')} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">Notalı Bahçe</button></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-xs text-orange-400">İletişim</h4>
                <p className="text-slate-400 text-xs font-bold">{siteSettings.contactEmail}</p>
                <p className="text-slate-400 text-xs font-bold">{siteSettings.contactPhone}</p>
                <button onClick={onAdminClick} className="text-slate-600 hover:text-orange-400 transition-colors font-black uppercase text-[10px] flex items-center gap-2 mt-4">
                  <i className="fas fa-lock"></i> Sistem Kontrol
                </button>
              </div>
           </div>
           <div className="pt-8 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">© 2024 WEBİLKOKULU • TÜRKİYE'NİN DİJİTAL İLKOKULU</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
