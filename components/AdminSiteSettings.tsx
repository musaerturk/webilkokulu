
import React, { useState, useEffect } from 'react';
import { SiteSettings, FAQItem } from '../types';
import { uploadFile } from '../services/storageService';

interface AdminSiteSettingsProps {
  settings: SiteSettings;
  onSave: (s: SiteSettings) => void;
  onClose: () => void;
}

const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({ settings: initialSettings, onSave, onClose }) => {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<'branding' | 'corporate' | 'faq' | 'storage'>('branding');
  const [isUploading, setIsUploading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'fail' | 'idle'>('idle');

  // Firebase bağlantısını test et
  const testFirebase = async () => {
    const config = settings.storageConfig;
    if ((!config.projectId && !config.databaseUrl) || !config.apiKey) {
      setConnectionStatus('idle');
      return;
    }
    
    setConnectionStatus('testing');
    try {
      const baseUrl = config.databaseUrl || `https://${config.projectId}-default-rtdb.firebaseio.com/`;
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const url = `${cleanBase}.json?auth=${config.apiKey}&shallow=true`;
      
      const res = await fetch(url);
      if (res.ok) setConnectionStatus('success');
      else setConnectionStatus('fail');
    } catch {
      setConnectionStatus('fail');
    }
  };

  useEffect(() => {
    if (activeTab === 'storage') testFirebase();
  }, [activeTab]);

  const handleSave = () => {
    onSave(settings);
    alert("Ayarlar kaydedildi! Artık Avrupa sunucusuyla (firebasedatabase.app) tam uyumlu çalışıyoruz.");
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-20">
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex justify-between items-center mb-10 border-b-8 border-indigo-600 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center">
               <img src={settings.logoUrl} className="max-h-full object-contain" alt="Logo" />
            </div>
            <div>
               <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Site Ayarları</h2>
               <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${connectionStatus === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {connectionStatus === 'success' ? 'Bulut Bağlantısı Başarılı' : 'Bağlantı Bekleniyor'}
                  </span>
               </div>
            </div>
         </div>
         <button onClick={onClose} className="bg-white/10 px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-white/20 transition-all">Kapat</button>
      </div>

      <div className="flex bg-white p-2 rounded-[2.5rem] shadow-lg mb-8 border overflow-x-auto no-scrollbar">
         <button onClick={() => setActiveTab('branding')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'branding' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>GÖRÜNÜM</button>
         <button onClick={() => setActiveTab('corporate')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'corporate' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>KURUMSAL</button>
         <button onClick={() => setActiveTab('faq')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'faq' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>SSS</button>
         <button onClick={() => setActiveTab('storage')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'storage' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>BULUT (FIREBASE)</button>
      </div>

      <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-4 border-slate-50 space-y-12">
         
         {activeTab === 'branding' && (
           <div className="space-y-12 animate-fadeIn">
              <section className="space-y-6">
                 <h3 className="text-xl font-black text-slate-800 uppercase border-b pb-4">Logo ve Slogan</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative group overflow-hidden">
                       <img src={settings.logoUrl} className="max-h-32 mb-4 object-contain" alt="Logo" />
                       <p className="text-[10px] font-black text-slate-400 uppercase">Logo Görseli</p>
                       <label className="absolute inset-0 bg-indigo-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all text-white">
                          <i className="fas fa-camera text-3xl mb-2"></i>
                          <span className="text-xs font-black">LOGOYU DEĞİŞTİR</span>
                          <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               setIsUploading(true);
                               const url = await uploadFile(file, 'branding', settings);
                               setSettings({...settings, logoUrl: url});
                               setIsUploading(false);
                             }
                          }} />
                       </label>
                    </div>
                    <textarea className="w-full bg-slate-50 p-6 rounded-[2rem] outline-none font-bold border-2 focus:border-indigo-100 min-h-[150px]" value={settings.footerDescription} onChange={e => setSettings({...settings, footerDescription: e.target.value})} placeholder="Footer açıklaması..." />
                 </div>
              </section>
           </div>
         )}

         {activeTab === 'storage' && (
           <div className="space-y-8 animate-fadeIn">
              <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-xl border-b-8 border-indigo-950">
                 <div className="flex items-center gap-6 mb-8">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner ${connectionStatus === 'success' ? 'bg-emerald-500' : connectionStatus === 'fail' ? 'bg-red-500' : 'bg-white/10'}`}>
                       <i className={`fas ${connectionStatus === 'success' ? 'fa-cloud-check' : connectionStatus === 'fail' ? 'fa-cloud-slash' : 'fa-cloud-upload-alt'}`}></i>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">Bölgesel Veritabanı</h3>
                       <p className="text-indigo-300 font-bold text-sm">Avrupa sunucusu (firebasedatabase.app) desteği aktif.</p>
                    </div>
                 </div>

                 <div className="space-y-6 mb-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-indigo-300 ml-4">Veritabanı URL (Screenshot'taki Link)</label>
                       <input 
                          className="w-full bg-white/10 p-5 rounded-2xl outline-none font-black text-white border-2 border-white/10 focus:border-indigo-400 placeholder:text-indigo-700" 
                          value={settings.storageConfig.databaseUrl || ''} 
                          onChange={e => setSettings({...settings, storageConfig: {...settings.storageConfig, databaseUrl: e.target.value}})} 
                          placeholder="https://webilkokulu-...-rtdb.europe-west1.firebasedatabase.app/" 
                       />
                       <p className="text-[9px] text-indigo-400 font-bold ml-4">* Firebase ekranındaki o uzun linki buraya olduğu gibi yapıştırın.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-indigo-300 ml-4">Firebase Web API Key</label>
                          <input type="password" className="w-full bg-white/10 p-5 rounded-2xl outline-none font-black text-white border-2 border-white/10 focus:border-indigo-400" value={settings.storageConfig.apiKey || ''} onChange={e => setSettings({...settings, storageConfig: {...settings.storageConfig, apiKey: e.target.value}})} placeholder="AIzaSy..." />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-indigo-300 ml-4">Project ID (Yedek)</label>
                          <input className="w-full bg-white/10 p-5 rounded-2xl outline-none font-black text-white border-2 border-white/10 focus:border-indigo-400" value={settings.storageConfig.projectId || ''} onChange={e => setSettings({...settings, storageConfig: {...settings.storageConfig, projectId: e.target.value}})} placeholder="webilkokulu-abd7f" />
                       </div>
                    </div>
                 </div>

                 <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold leading-relaxed">
                       <i className="fas fa-lightbulb mr-2 text-yellow-400"></i>
                       **İpucu:** Ekran görüntünüzdeki o beyaz linki kopyalayıp "Veritabanı URL" kutusuna yapıştırırsanız sorun çözülecektir.
                    </p>
                 </div>
              </div>
              <button onClick={testFirebase} className="w-full py-4 border-2 border-indigo-100 rounded-2xl font-black uppercase text-[10px] text-indigo-400 hover:bg-indigo-50 transition-all">Sinyali Kontrol Et ⚡</button>
           </div>
         )}

         <div className="pt-8 border-t">
            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
               YAPILANDIRMAYI TAMAMLA 🚀
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
