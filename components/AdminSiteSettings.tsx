
import React, { useState } from 'react';
import { SiteSettings, FAQItem, CloudStorageConfig } from '../types';
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

  const handleSave = () => {
    onSave(settings);
    alert("Site ayarları başarıyla kaydedildi! ✨\nNot: Firebase ayarlarını girdiyseniz verileriniz artık tüm cihazlarda senkronize edilecektir.");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadFile(file, 'branding', settings);
        setSettings({ ...settings, logoUrl: url });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddFAQ = () => {
    setSettings({
      ...settings,
      faq: [...settings.faq, { id: Date.now().toString(), question: '', answer: '' }]
    });
  };

  const handleUpdateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    const newFaq = [...settings.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setSettings({ ...settings, faq: newFaq });
  };

  const handleRemoveFAQ = (index: number) => {
    setSettings({
      ...settings,
      faq: settings.faq.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-20">
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex justify-between items-center mb-10 border-b-8 border-indigo-600">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl p-2">
               <img src={settings.logoUrl} className="w-full h-full object-contain" alt="W" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Site Yönetim Merkezi</h2>
         </div>
         <button onClick={onClose} className="bg-white/10 px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-white/20">Kapat</button>
      </div>

      <div className="flex bg-white p-2 rounded-[2.5rem] shadow-lg mb-8 border overflow-x-auto no-scrollbar">
         <button onClick={() => setActiveTab('branding')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'branding' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>MARKA & GÖRÜNÜM</button>
         <button onClick={() => setActiveTab('corporate')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'corporate' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>KURUMSAL SAYFALAR</button>
         <button onClick={() => setActiveTab('faq')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'faq' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>SSS YÖNETİMİ</button>
         <button onClick={() => setActiveTab('storage')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] ${activeTab === 'storage' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>BULUT VERİTABANI</button>
      </div>

      <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-4 border-slate-50 space-y-12 min-h-[600px]">
         
         {activeTab === 'branding' && (
           <div className="space-y-12 animate-fadeIn">
              <section className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                    <h3 className="text-xl font-black text-slate-800 uppercase">Logo ve Slogan</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative group overflow-hidden">
                       {isUploading ? <div className="animate-spin text-indigo-600 text-3xl"><i className="fas fa-spinner"></i></div> : <img src={settings.logoUrl} className="max-h-32 mb-4 object-contain" />}
                       <p className="text-[10px] font-black text-slate-400 uppercase">Geçerli Logo</p>
                       <label className="absolute inset-0 bg-indigo-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all text-white">
                          <i className="fas fa-camera text-3xl mb-2"></i>
                          <span className="text-xs font-black uppercase">Logoyu Değiştir</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                       </label>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Footer Sloganı</label>
                       <textarea className="w-full bg-slate-50 p-6 rounded-[2rem] outline-none font-bold min-h-[120px] border-2 border-transparent focus:border-indigo-100" value={settings.footerDescription} onChange={e => setSettings({...settings, footerDescription: e.target.value})} />
                    </div>
                 </div>
              </section>

              <section className="space-y-6 pt-10 border-t">
                 <h3 className="text-xl font-black text-slate-800 uppercase mb-6">İletişim & Sosyal Medya</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-4">E-Posta Adresi</label>
                       <input className="w-full bg-slate-50 p-4 rounded-xl font-bold border-2 border-transparent focus:border-indigo-100" placeholder="E-Posta" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-tighter">Telefon / WhatsApp (905... şeklinde)</label>
                       <input className="w-full bg-slate-50 p-4 rounded-xl font-bold border-2 border-transparent focus:border-indigo-100" placeholder="Örn: 905321234567" value={settings.contactPhone} onChange={e => setSettings({...settings, contactPhone: e.target.value})} />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Instagram URL" value={settings.socialMedia.instagram} onChange={e => setSettings({...settings, socialMedia: {...settings.socialMedia, instagram: e.target.value}})} />
                    <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Youtube URL" value={settings.socialMedia.youtube} onChange={e => setSettings({...settings, socialMedia: {...settings.socialMedia, youtube: e.target.value}})} />
                    <input className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Twitter URL" value={settings.socialMedia.twitter} onChange={e => setSettings({...settings, socialMedia: {...settings.socialMedia, twitter: e.target.value}})} />
                 </div>
              </section>
           </div>
         )}

         {activeTab === 'corporate' && (
           <div className="space-y-12 animate-fadeIn">
              <section className="space-y-4">
                 <label className="text-xs font-black uppercase text-slate-400 ml-2">Hakkımızda Metni</label>
                 <textarea className="w-full bg-slate-50 p-6 rounded-[2rem] outline-none font-bold min-h-[150px] border-2 border-transparent focus:border-indigo-100" value={settings.aboutUs} onChange={e => setSettings({...settings, aboutUs: e.target.value})} />
              </section>
              <section className="space-y-4 pt-10 border-t">
                 <label className="text-xs font-black uppercase text-slate-400 ml-2">Gizlilik Politikası & KVKK</label>
                 <textarea className="w-full bg-slate-50 p-6 rounded-[2rem] outline-none font-bold min-h-[150px] border-2 border-transparent focus:border-indigo-100" value={settings.privacyPolicy} onChange={e => setSettings({...settings, privacyPolicy: e.target.value})} />
              </section>
              <section className="space-y-4 pt-10 border-t">
                 <label className="text-xs font-black uppercase text-slate-400 ml-2">Kullanım Şartları</label>
                 <textarea className="w-full bg-slate-50 p-6 rounded-[2rem] outline-none font-bold min-h-[150px] border-2 border-transparent focus:border-indigo-100" value={settings.termsOfUse} onChange={e => setSettings({...settings, termsOfUse: e.target.value})} />
              </section>
           </div>
         )}

         {activeTab === 'faq' && (
           <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-800 uppercase">Sıkça Sorulan Sorular</h3>
                 <button onClick={handleAddFAQ} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-md">+ YENİ SORU EKLE</button>
              </div>
              <div className="space-y-6">
                 {settings.faq.map((item, idx) => (
                   <div key={idx} className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-100 transition-all relative group">
                      <div className="space-y-4">
                         <input className="w-full bg-white p-4 rounded-xl font-black text-slate-700 outline-none border-2 border-transparent focus:border-indigo-100" placeholder="Soru..." value={item.question} onChange={e => handleUpdateFAQ(idx, 'question', e.target.value)} />
                         <textarea className="w-full bg-white p-4 rounded-xl font-bold text-slate-500 outline-none border-2 border-transparent focus:border-indigo-100 min-h-[80px]" placeholder="Cevap..." value={item.answer} onChange={e => handleUpdateFAQ(idx, 'answer', e.target.value)} />
                      </div>
                      <button onClick={() => handleRemoveFAQ(idx)} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                         <i className="fas fa-trash"></i>
                      </button>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {activeTab === 'storage' && (
           <div className="space-y-8 animate-fadeIn">
              <section className="bg-indigo-50 p-8 rounded-[3rem] border-4 border-indigo-100">
                 <h3 className="text-2xl font-black text-indigo-900 uppercase mb-4">Gerçek Zamanlı Veritabanı (Senkronizasyon)</h3>
                 <p className="text-indigo-600 text-sm font-bold mb-8">
                    Verilerinizin (Üniteler, Ayarlar, Rozetler) her tarayıcıda aynı görünmesi için Firebase Realtime Database kullanmalısınız. 
                    <br/><br/>
                    1. <a href="https://console.firebase.google.com/" target="_blank" className="underline font-black">Firebase Console</a> üzerinden bir proje açın.
                    <br/>
                    2. "Realtime Database" oluşturun ve kuralları "public" yapın.
                    <br/>
                    3. Aşağıdaki bilgileri doldurup "Kaydet" deyin.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Veri Sağlayıcı</label>
                       <select 
                        className="w-full bg-white p-5 rounded-2xl font-black uppercase text-xs outline-none border-2 border-transparent focus:border-indigo-600 shadow-sm"
                        value={settings.storageConfig.provider}
                        onChange={e => setSettings({...settings, storageConfig: {...settings.storageConfig, provider: e.target.value as any}})}
                       >
                          <option value="none">Devre Dışı (Sadece bu bilgisayara kaydeder)</option>
                          <option value="firebase">Firebase (Tüm cihazlarda senkronize eder)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Firebase Project ID</label>
                       <input className="w-full bg-white p-5 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-indigo-600 shadow-sm" value={settings.storageConfig.projectId || ''} onChange={e => setSettings({...settings, storageConfig: {...settings.storageConfig, projectId: e.target.value}})} placeholder="Örn: webilkokulu-99abc" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Firebase Web API Key</label>
                       <input type="password" className="w-full bg-white p-5 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-indigo-600 shadow-sm" value={settings.storageConfig.apiKey || ''} onChange={e => setSettings({...settings, storageConfig: {...settings.storageConfig, apiKey: e.target.value}})} placeholder="AIzaSy..." />
                    </div>
                 </div>
              </section>
           </div>
         )}

         <div className="pt-10 border-t">
            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all">
               YAPILANDIRMAYI TAMAMLA VE KAYDET 🚀
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
