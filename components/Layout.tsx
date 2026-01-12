
import React from 'react';
import { Grade, UserProfile, SiteSettings } from '../types';
import GradeSymbol from './GradeSymbol';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onAdvisorClick: () => void;
  onProfileClick: () => void;
  onAdminClick: () => void;
  onViewChange?: (view: string) => void;
  currentGrade: Grade | null;
  currentUser?: UserProfile;
  isGuest: boolean;
  siteSettings: SiteSettings;
}

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onAdvisorClick, onProfileClick, onAdminClick, onViewChange, currentGrade, currentUser, isGuest, siteSettings }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center cursor-pointer group" onClick={onHomeClick}>
              <div className="mr-4 h-16 w-16 transition-all group-hover:scale-110 duration-300 drop-shadow-sm">
                <img 
                  src={siteSettings.logoUrl} 
                  alt="WEBİLKOKULU Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 tracking-tighter">
                  WEBİLKOKULU
                </h1>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1 ml-0.5">SANA ÖZEL OKUL</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {currentGrade && !isGuest && (
                <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl shadow-inner">
                    <GradeSymbol grade={currentGrade} size="sm" className="mr-3" />
                    <span className="text-gray-700 font-black text-sm uppercase">{currentGrade}. Sınıf Alanındasın</span>
                </div>
              )}
              <nav className="flex items-center space-x-1">
                <button 
                  onClick={onProfileClick} 
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black shadow-lg ml-2 group active:scale-95 ${isGuest ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                   <i className={`fas ${isGuest ? 'fa-user-astronaut' : 'fa-user-circle'} group-hover:rotate-12 transition-transform`}></i>
                   <span className="text-xs uppercase tracking-widest">{isGuest ? 'KATIL / GİRİŞ YAP' : 'PROFİLİM'}</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">{children}</main>

      <footer className="bg-slate-900 text-white pt-20 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={onHomeClick}>
                  <div className="w-14 h-14 bg-white rounded-2xl p-1 shadow-xl transform transition-transform group-hover:rotate-6">
                    <img src={siteSettings.logoUrl} className="w-full h-full object-contain" alt="W" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">WEBİLKOKULU</h3>
                </div>
                <p className="text-slate-400 font-medium italic leading-relaxed">{siteSettings.footerDescription}</p>
                <div className="flex gap-4">
                  <a href={siteSettings.socialMedia.instagram} target="_blank" rel="noreferrer"><i className="fab fa-instagram text-xl hover:text-pink-500 cursor-pointer transition-colors"></i></a>
                  <a href={siteSettings.socialMedia.youtube} target="_blank" rel="noreferrer"><i className="fab fa-youtube text-xl hover:text-red-500 cursor-pointer transition-colors"></i></a>
                  <a href={siteSettings.socialMedia.twitter} target="_blank" rel="noreferrer"><i className="fab fa-twitter text-xl hover:text-blue-400 cursor-pointer transition-colors"></i></a>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-xs text-indigo-400">Kurumsal</h4>
                <ul className="space-y-3">
                  <li><button onClick={() => onViewChange?.('about')} className="text-slate-300 hover:text-white transition-colors font-bold">Hakkımızda</button></li>
                  <li><button onClick={() => onViewChange?.('kvkk')} className="text-slate-300 hover:text-white transition-colors font-bold">Gizlilik & KVKK</button></li>
                  <li><button onClick={() => onViewChange?.('terms')} className="text-slate-300 hover:text-white transition-colors font-bold">Kullanım Şartları</button></li>
                  <li><button onClick={() => onViewChange?.('contact')} className="text-slate-300 hover:text-white transition-colors font-bold">İletişim</button></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-xs text-emerald-400">Eğitim</h4>
                <ul className="space-y-3">
                  <li><button onClick={onHomeClick} className="text-slate-300 hover:text-white transition-colors font-bold">Sınıflarımız</button></li>
                  <li><button onClick={() => onViewChange?.('library')} className="text-slate-300 hover:text-white transition-colors font-bold">Büyülü Kütüphane</button></li>
                  <li><button onClick={() => onViewChange?.('faq')} className="text-slate-300 hover:text-white transition-colors font-bold">Sıkça Sorulan Sorular</button></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black uppercase tracking-widest text-xs text-orange-400">Destek</h4>
                <p className="text-slate-400 text-sm font-bold">{siteSettings.contactEmail}</p>
                <p className="text-slate-400 text-sm font-bold">{siteSettings.contactPhone}</p>
                <button onClick={onAdminClick} className="text-slate-600 hover:text-orange-400 transition-colors font-black uppercase text-[10px] flex items-center gap-2 mt-4">
                  <i className="fas fa-lock"></i> Sistem Kontrol
                </button>
              </div>
           </div>

           <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-500 font-bold">© 2024 WEBİLKOKULU Tüm hakları saklıdır.</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sistem Durumu: Aktif</span>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
