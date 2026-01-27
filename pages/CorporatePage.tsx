
import React, { useState, useEffect, useCallback } from 'react';
import { CorporateContent, CorporatePageName, CorporatePageData, SiteSettings } from '../types';
import * as api from '../services/firebaseService';
import { LogoIcon } from '../components/icons';

const corporatePageNames: Record<CorporatePageName, string> = {
    about: 'Hakkımızda',
    privacy: 'KVKK ve Gizlilik',
    terms: 'Kullanım Şartları',
    contact: 'İletişim',
    faq: 'Sıkça Sorulan Sorular (SSS)',
    social: 'Sosyal Medya'
};

type SettingsSection = CorporatePageName | 'password' | 'logo';

const sectionNames: Record<SettingsSection, string> = {
    ...corporatePageNames,
    password: 'Şifre Değiştir',
    logo: 'Logo Değiştir'
};

const CorporatePage: React.FC = () => {
  const [content, setContent] = useState<CorporateContent | null>(null);
  const [activeSection, setActiveSection] = useState<SettingsSection>('about');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Content editor state
  const [currentData, setCurrentData] = useState<CorporatePageData>({ title: '', content: '' });

  // Password editor state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Logo editor state
  const [logoUrl, setLogoUrl] = useState('');
  
  const isContentPage = (section: SettingsSection): section is CorporatePageName => {
      return Object.keys(corporatePageNames).includes(section);
  }

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        try {
            const [fetchedContent, fetchedSettings] = await Promise.all([
                api.getCorporateContent(),
                api.getSiteSettings()
            ]);
            setContent(fetchedContent);
            setLogoUrl(fetchedSettings.logoUrl);
        } catch (error) {
            console.error("Error fetching settings:", error);
            alert("Ayarlar yüklenirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (content && isContentPage(activeSection)) {
      setCurrentData(content[activeSection]);
    }
  }, [activeSection, content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveContent = async () => {
    if (!content || !isContentPage(activeSection)) return;
    setIsSaving(true);
    try {
      await api.updateCorporateContent(activeSection, currentData);
      setContent(prev => prev ? { ...prev, [activeSection]: currentData } : null);
      alert('Değişiklikler başarıyla kaydedildi!');
    } catch (error) {
      console.error("Error saving corporate content:", error);
      alert("İçerik kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
          alert('Yeni şifreler eşleşmiyor!');
          return;
      }
      if (!oldPassword || !newPassword) {
          alert('Lütfen tüm alanları doldurun.');
          return;
      }
      setIsSaving(true);
      try {
          const result = await api.updateAdminPassword(oldPassword, newPassword);
          alert(result.message);
          if(result.success) {
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
          }
      } catch (error) {
          alert('Şifre güncellenirken bir hata oluştu.');
      } finally {
          setIsSaving(false);
      }
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          await api.updateSiteSettings({ logoUrl });
          alert('Logo başarıyla güncellendi!');
      } catch(error) {
          alert('Logo güncellenirken bir hata oluştu.');
      } finally {
          setIsSaving(false);
      }
  };

  const renderContentEditor = () => (
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">
            '{sectionNames[activeSection]}' Sayfasını Düzenle
          </h2>
          <div className="space-y-4 flex-grow flex flex-col">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Sayfa Başlığı</label>
              <input type="text" id="title" name="title" value={currentData?.title || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
            <div className="flex-grow flex flex-col">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Sayfa İçeriği (Markdown destekler)</label>
              <textarea id="content" name="content" value={currentData?.content || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex-grow" rows={15} placeholder="İçeriği buraya yazın..."/>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-end">
            <button onClick={handleSaveContent} disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed">
              {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
  );
  
  const renderPasswordEditor = () => (
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Şifre Değiştir</h2>
          <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
              <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Eski Şifre</label>
                  <input type="password" id="oldPassword" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
               <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
                  <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
               <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
                  <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                      {isSaving ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                  </button>
              </div>
          </form>
      </div>
  );

  const renderLogoEditor = () => (
       <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Logo Değiştir</h2>
          <form onSubmit={handleSaveLogo} className="space-y-4 max-w-md">
              <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL</label>
                  <input type="url" id="logoUrl" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://ornek.com/logo.png"/>
              </div>
              <div>
                  <h4 className="block text-sm font-medium text-gray-700">Önizleme</h4>
                  <div className="mt-2 p-4 border rounded-md h-24 flex items-center justify-center bg-gray-100">
                      {logoUrl ? <img src={logoUrl} alt="Logo Önizleme" className="max-h-full max-w-full"/> : <LogoIcon />}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Not: Logo değişikliği sitenin tamamına yansıtılması için ek geliştirme gerektirebilir.</p>
              </div>
              <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                      {isSaving ? 'Kaydediliyor...' : 'Logoyu Kaydet'}
                  </button>
              </div>
          </form>
      </div>
  );


  if (isLoading) {
    return <p className="text-center text-gray-500">Kurumsal ayarlar yükleniyor...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 h-full">
      <aside className="w-full md:w-1/4 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 px-1">Ayarlar</h3>
        <div className="space-y-2">
          {Object.entries(sectionNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as SettingsSection)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeSection === key
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </aside>

        {isContentPage(activeSection) && renderContentEditor()}
        {activeSection === 'password' && renderPasswordEditor()}
        {activeSection === 'logo' && renderLogoEditor()}
    </div>
  );
};

export default CorporatePage;
