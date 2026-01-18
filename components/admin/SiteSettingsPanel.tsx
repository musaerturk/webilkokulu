
import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { fetchData, updateData, saveData } from '../../services/firebaseService';

const SiteSettingsPanel: React.FC = () => {
  const [subTab, setSubTab] = useState<'APPEARANCE' | 'FAQ' | 'CORPORATE' | 'CLOUD'>('APPEARANCE');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await fetchData('settings');
    if (data && data.length > 0) {
      setSettings(data[0] as SiteSettings);
    }
    setIsLoading(false);
  };

  const handleUpdate = async (path: string, value: any) => {
    if (!settings) return;
    const updated = { ...settings, [path]: value };
    // @ts-ignore
    await updateData('settings', settings.id, updated);
    setSettings(updated);
    alert("Ayarlar güncellendi.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800">Site Ayarları</h1>
        <p className="text-slate-500">Platform genelindeki görsel ve sistemsel ayarlar.</p>
      </header>

      <div className="flex flex-wrap gap-4 border-b border-slate-200 pb-2">
        {[
          { id: 'APPEARANCE', label: 'Görünüm' },
          { id: 'FAQ', label: 'SSS' },
          { id: 'CORPORATE', label: 'Kurumsal' },
          { id: 'CLOUD', label: 'Bulut - Firebase' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${subTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Yükleniyor...</div>
        ) : (
          <>
            {subTab === 'APPEARANCE' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">Görünüm Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Ana Renk</label>
                    <div className="flex gap-4">
                      <input type="color" className="w-12 h-12 rounded-lg cursor-pointer" defaultValue={settings?.appearance.primaryColor || "#4f46e5"} />
                      <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" defaultValue={settings?.appearance.primaryColor || "#4f46e5"} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Logo URL</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" placeholder="https://..." defaultValue={settings?.appearance.logo} />
                  </div>
                </div>
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Ayarları Kaydet</button>
              </div>
            )}

            {subTab === 'FAQ' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Sıkça Sorulan Sorular</h3>
                  <button className="text-indigo-600 font-bold text-sm">+ Yeni Soru Ekle</button>
                </div>
                <div className="space-y-4">
                  {(settings?.faq || [{question: 'Örnek Soru', answer: 'Örnek Cevap'}]).map((faq, i) => (
                    <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 space-y-2">
                      <input type="text" className="w-full bg-transparent font-bold text-sm" defaultValue={faq.question} />
                      <textarea className="w-full bg-transparent text-slate-600 text-xs" rows={2} defaultValue={faq.answer} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTab === 'CORPORATE' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">Kurumsal Bilgiler</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Hakkımızda Metni</label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" rows={4} placeholder="Kurumsal bilgiler..." defaultValue={settings?.corporate.about} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">İletişim Adresi</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" placeholder="Adres, Telefon, E-posta..." defaultValue={settings?.corporate.contact} />
                  </div>
                </div>
              </div>
            )}

            {subTab === 'CLOUD' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-orange-600">Bulut & Firebase Ayarları</h3>
                <div className="p-4 bg-orange-50 text-orange-800 rounded-2xl text-xs">
                  ⚠️ Bu ayarlar uygulamanın veritabanı bağlantısı için kritiktir.
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Firebase API Key</label>
                    <input type="password" title="API KEY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono" defaultValue={settings?.cloud.apiKey || "AIzaSy..."} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Project ID</label>
                    <input type="text" title="PROJECT ID" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" defaultValue={settings?.cloud.projectId || "webilkokulu-portal"} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SiteSettingsPanel;
