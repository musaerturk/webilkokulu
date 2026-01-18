
import React, { useState } from 'react';
import SiteSettingsPanel from './admin/SiteSettingsPanel';
import CoursePanel from './admin/CoursePanel';
import LibraryPanel from './admin/LibraryPanel';
import MusicPanel from './admin/MusicPanel';
import UserSettingsPanel from './admin/UserSettingsPanel';

type AdminTab = 'SITE' | 'COURSES' | 'LIBRARY' | 'MUSIC' | 'USERS';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('COURSES');

  const menuItems = [
    { id: 'SITE', label: 'Site Ayarları', icon: '⚙️' },
    { id: 'COURSES', label: 'Kurslar Paneli', icon: '🎓' },
    { id: 'LIBRARY', label: 'Kütüphane (AI)', icon: '📚' },
    { id: 'MUSIC', label: 'Müzik Paneli', icon: '🎵' },
    { id: 'USERS', label: 'Kullanıcı Ayarları', icon: '👤' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100-72px)] bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Menü</h2>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AdminTab)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left font-medium ${
              activeTab === item.id 
              ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Content Area */}
      <section className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'SITE' && <SiteSettingsPanel />}
        {activeTab === 'COURSES' && <CoursePanel />}
        {activeTab === 'LIBRARY' && <LibraryPanel />}
        {activeTab === 'MUSIC' && <MusicPanel />}
        {activeTab === 'USERS' && <UserSettingsPanel />}
      </section>
    </div>
  );
};

export default AdminPanel;
