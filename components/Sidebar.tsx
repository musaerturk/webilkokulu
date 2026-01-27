
import React from 'react';
import { Page } from '../App';
import { HomeIcon, MusicNoteIcon, BookOpenIcon, CourseIcon, UsersIcon, CogIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Yönetim Paneli', icon: <HomeIcon /> },
    { id: 'music', label: 'Müzik Odası', icon: <MusicNoteIcon /> },
    { id: 'library', label: 'Kütüphane', icon: <BookOpenIcon /> },
    { id: 'courses', label: 'Kurslar', icon: <CourseIcon /> },
    { id: 'users', label: 'Kullanıcılar', icon: <UsersIcon /> },
    { id: 'corporate', label: 'Kurumsal Ayarlar', icon: <CogIcon /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-2xl uppercase text-blue-300 font-bold">Admin</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as Page)}
            className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              currentPage === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
