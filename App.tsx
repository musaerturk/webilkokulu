
import React, { useState } from 'react';
import { Course } from './types';
import StudentCourseView from './pages/StudentCourseView';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';

export type Page = 'dashboard' | 'music' | 'library' | 'courses' | 'users' | 'corporate';

type ViewState = 
  | { view: 'login' }
  | { view: 'admin'; page: Page }
  | { view: 'student'; course: Course };

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ view: 'login' });

  const navigateToAdmin = (page: Page) => setViewState({ view: 'admin', page });
  const navigateToStudent = (course: Course) => setViewState({ view: 'student', course });
  const handleLoginSuccess = () => setViewState({ view: 'admin', page: 'dashboard' });

  switch (viewState.view) {
    case 'login':
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    
    case 'admin':
      return (
        <AdminLayout 
          page={viewState.page}
          setPage={navigateToAdmin}
          navigateToStudent={navigateToStudent}
        />
      );
      
    case 'student':
      return (
        <StudentCourseView 
          course={viewState.course} 
          navigateBackToAdmin={() => navigateToAdmin('courses')} 
        />
      );
      
    default:
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
};

export default App;
