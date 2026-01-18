
import React from 'react';
import { InfoPageType } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onNavigateInfo: (type: InfoPageType) => void;
  onAdminClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigateInfo, onAdminClick }) => {
  const features = [
    {
      title: "Tam MEB Uyumu",
      description: "Okul derslerinle %100 uyumlu, güncel MEB müfredatını birebir takip eden içerikler.",
      icon: "🎯",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "İnteraktif Maceralar",
      description: "Sıkıcı dersler yerine oyunlarla pekiştirme ve eğlenceli öğrenme deneyimi.",
      icon: "🎮",
      color: "bg-rose-100 text-rose-600"
    },
    {
      title: "Bireysel Başarı",
      description: "Her çocuğun kendi hızında ilerlediği, başarıyı ödüllendiren kişiye özel sistem.",
      icon: "🏆",
      color: "bg-amber-100 text-amber-600"
    },
    {
      title: "AI Rehberlik",
      description: "Eksiklerini anında analiz eder ve sana özel çalışma planı sunarak gelişimini destekler.",
      icon: "✨",
      color: "bg-emerald-100 text-emerald-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HERO SECTION - Boşluklar Azaltıldı */}
      <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16 bg-white border-b border-slate-50">
        <div className="blob w-96 h-96 bg-indigo-200 top-[-10%] left-[-5%] rounded-full"></div>
        <div className="blob w-80 h-80 bg-rose-100 bottom-[-10%] right-[10%] rounded-full"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left space-y-6 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                <span className="text-xs animate-pulse">🛡️</span>
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Ebeveyn Onaylı & %100 Güvenli</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                Dersler Artık <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500">
                  Bir Macera!
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                MEB müfredatı, eğlenceli oyunlar ve sana özel AI öğretmenle okul başarısı hiç bu kadar keyifli olmamıştı.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
                <button 
                  onClick={onStart}
                  className="group px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-[0_15px_30px_rgba(79,70,229,0.2)] hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3"
                >
                  <span>Hadi Başlayalım!</span>
                  <span className="text-2xl group-hover:translate-x-2 transition-transform">🚀</span>
                </button>
                <div className="flex flex-col items-center lg:items-start opacity-70">
                  <div className="flex -space-x-2 mb-0.5">
                    {[1,2,3,4].map(i => <img key={i} src={`https://picsum.photos/32/32?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="Student" />)}
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">+10.000 Mutlu Öğrenci</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="relative group max-w-md mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 rounded-[3.5rem] blur-xl opacity-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=1000" 
                  alt="Cheerful child learning" 
                  className="relative z-10 w-full rounded-[3rem] shadow-xl border-[8px] border-white transform hover:scale-[1.01] transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EBEVEYNLER İÇİN GÜVEN BÖLÜMÜ - Boşluklar Minimumda */}
      <section className="py-4 bg-indigo-50/50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-indigo-50 flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🤝</div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                Ebeveynler İçin <span className="text-emerald-600">Tam Güven</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Reklamsız, MEB uyumlu ve yapay zeka denetimli sistemimizle çocuğunuzun gelişimini her an takip edin.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['%100 Reklamsız', 'KVKK Uyumlu', 'Haftalık Rapor'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                    <span className="text-emerald-500 text-sm">✔</span> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-4">
              <div className="bg-slate-50 px-6 py-4 rounded-3xl text-center">
                <p className="text-2xl font-black text-indigo-600 leading-none">4.9/5</p>
                <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Veli Puanı</p>
              </div>
              <div className="bg-slate-50 px-6 py-4 rounded-3xl text-center">
                <p className="text-2xl font-black text-emerald-500 leading-none">100%</p>
                <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Güvenli</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÇOCUKLAR İÇİN BLOKLAR */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6 text-center mb-6 space-y-1">
          <h2 className="text-4xl font-black text-slate-900">Dünyanı Keşfet</h2>
          <p className="text-lg text-slate-400 font-medium italic">Hangi odaya girmek istersin?</p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-[2.5rem] p-6 lg:p-8 text-white shadow-xl hover:-translate-y-1 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-[8rem] group-hover:scale-110 transition-transform pointer-events-none">📚</div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center text-2xl shrink-0">✨</div>
                  <h3 className="text-2xl lg:text-3xl font-black leading-tight">Masal & Öykü <br className="hidden sm:block" /> Kütüphanesi</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <p className="text-indigo-100 text-sm leading-relaxed flex-1 font-medium">
                    Kendi kahramanını seç, AI ile oluşturulan masalların içinde kaybol ve okuma becerini geliştir!
                  </p>
                  <button onClick={onStart} className="shrink-0 px-8 py-3.5 bg-white text-indigo-700 rounded-2xl font-black text-base shadow-lg hover:scale-105 transition-all">
                    Kitapları Aç
                  </button>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-rose-400 via-rose-500 to-amber-500 rounded-[2.5rem] p-6 lg:p-8 text-white shadow-xl hover:-translate-y-1 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-[8rem] group-hover:scale-110 transition-transform pointer-events-none">🎵</div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center text-2xl shrink-0">🌈</div>
                  <h3 className="text-2xl lg:text-3xl font-black leading-tight">Eğlenceli <br className="hidden sm:block" /> Müzik Odası</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <p className="text-rose-50 text-sm leading-relaxed flex-1 font-medium">
                    Ritimle öğren, şarkılarla dans et! Notaların dünyasında harika bir yolculuğa çıkmaya hazır mısın?
                  </p>
                  <button onClick={onStart} className="shrink-0 px-8 py-3.5 bg-white text-rose-600 rounded-2xl font-black text-base shadow-lg hover:scale-105 transition-all">
                    Notaları Keşfet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEDEN WEBİLKOKULU SECTION - Boşluklar Optimize Edildi */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-8">
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Neden WEBİLKOKULU?</h3>
          <p className="text-slate-400 mt-1 text-lg font-medium">Eğitimin en eğlenceli hali.</p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Sıkıştırılmış */}
      <footer className="py-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-xl">W</div>
              <span className="text-2xl font-black tracking-tighter">WEBİLKOKULU</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
              Çocukların hayallerini, ebeveynlerin güvenini birleştirdik.
            </p>
            <button onClick={onAdminClick} className="px-5 py-2.5 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors">Yönetici Paneli 🔒</button>
          </div>
          
          <div className="grid grid-cols-2 gap-8 lg:col-span-1">
            <div className="space-y-4">
              <h4 className="font-black text-indigo-400 tracking-widest uppercase text-[10px]">Keşfet</h4>
              <ul className="text-slate-400 text-sm space-y-2 font-bold">
                <li onClick={() => onNavigateInfo('ABOUT')} className="hover:text-white cursor-pointer">Hakkımızda</li>
                <li onClick={() => onNavigateInfo('CONTACT')} className="hover:text-white cursor-pointer">İletişim</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-rose-400 tracking-widest uppercase text-[10px]">Yasal</h4>
              <ul className="text-slate-400 text-sm space-y-2 font-bold">
                <li onClick={() => onNavigateInfo('PRIVACY')} className="hover:text-white cursor-pointer">Gizlilik</li>
                <li onClick={() => onNavigateInfo('FAQ')} className="hover:text-white cursor-pointer">SSS</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <h4 className="font-black text-amber-400 tracking-widest uppercase text-[10px]">E-Bülten</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="E-posta" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              <button className="bg-indigo-600 px-4 rounded-xl text-xs font-black shadow-lg">Katıl</button>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 pt-8 mt-10 border-t border-slate-800/50 text-center text-slate-600 text-[8px] font-black tracking-[0.3em] uppercase">
          &copy; 2025 WEBİLKOKULU.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
