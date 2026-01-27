
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../pages/Dashboard';
import MusicRoom from '../pages/MusicRoom';
import Library from '../pages/Library';
import CoursesPage from '../pages/CoursesPage';
import UsersPage from '../pages/UsersPage';
import CorporatePage from '../pages/CorporatePage';
import { Page } from '../App';
import { Course } from '../types';

interface AdminLayoutProps {
    page: Page;
    setPage: (page: Page) => void;
    navigateToStudent: (course: Course) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ page, setPage, navigateToStudent }) => {

    const renderAdminPage = () => {
        switch (page) {
            case 'music':
                return <MusicRoom />;
            case 'library':
                return <Library />;
            case 'courses':
                return <CoursesPage navigateToStudent={navigateToStudent} />;
            case 'users':
                return <UsersPage />;
            case 'corporate':
                return <CorporatePage />;
            case 'dashboard':
            default:
                return <Dashboard />;
        }
    };

    const getAdminPageTitle = () => {
        switch (page) {
            case 'music': return 'Müzik Odası';
            case 'library': return 'Kütüphane';
            case 'courses': return 'Kurs Yönetimi';
            case 'users': return 'Kullanıcı Yönetimi';
            case 'corporate': return 'Kurumsal Ayarlar';
            case 'dashboard':
            default: return 'Yönetim Paneli';
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar currentPage={page} setCurrentPage={setPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={getAdminPageTitle()} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                    {renderAdminPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
