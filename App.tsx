
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import LandingPage from './components/LandingPage.tsx';
import TopicWorkspace from './components/TopicWorkspace.tsx';
import AdminWorkspace from './components/AdminWorkspace.tsx';
import AdminUserManagement from './components/AdminUserManagement.tsx';
import AdminSiteSettings from './components/AdminSiteSettings.tsx';
import AdminLibraryManagement from './components/AdminLibraryManagement.tsx';
import AdminMusicManagement from './components/AdminMusicManagement.tsx';
import AdminMascotManagement from './components/AdminMascotManagement.tsx';
import AdminSubjectManagement from './components/AdminSubjectManagement.tsx';
import LibraryWorkspace from './components/LibraryWorkspace.tsx';
import MusicRoom from './components/MusicRoom.tsx';
import AIAdvisor from './components/AIAdvisor.tsx';
import { Grade, Subject, Topic, Unit, UserProfile, SiteSettings, MascotSettings, Book, Song, QuizResult, SubjectStyle } from './types.ts';
import { MOCK_UNITS, MOCK_BOOKS, INITIAL_GRADE_SUBJECTS, INITIAL_SUBJECT_CONFIG } from './constants.tsx';
import { saveToCloud, loadFromCloud, GlobalState } from './services/dbService';

const BRAND_W_LOGO = "https://raw.githubusercontent.com/Anil-Can/image-storage/main/webilkokulu-logo-new.png";

const DEFAULT_MASCOTS: MascotSettings[] = [
  { role: 'presentation', type: 'turtle', name: 'Bilge Tonti' },
  { role: 'game', type: 'cat', name: 'Mırnav' },
  { role: 'assessment', type: 'rabbit', name: 'Zıpzıp' },
  { role: 'coach', type: 'fox', name: 'Fikir' },
  { role: 'wisdom', type: 'owl', name: 'Bilkuş' }
];

const INITIAL_SITE_SETTINGS: SiteSettings = {
  logoUrl: BRAND_W_LOGO,
  slogan: "Sana Özel Okul",
  footerDescription: '"Kendin ol, kendi hızında öğren. Senin okulun, senin maceran!"',
  contactEmail: "merhaba@webilkokulu.com",
  contactPhone: "905001234567", 
  aboutUs: "Webilkokulu eğitimde yapay zeka devrimidir.",
  privacyPolicy: "Verileriniz güvendedir.",
  termsOfUse: "Eğitim amaçlı kullanım esastır.",
  faq: [],
  socialMedia: { instagram: "", youtube: "", twitter: "" },
  storageConfig: { provider: 'none' }
};

const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Misafir Kullanıcı',
  username: 'guest',
  email: '',
  grade: 1,
  role: 'student',
  status: 'active',
  points: 0,
  badges: [],
  joinDate: new Date().toLocaleDateString('tr-TR')
};

const App: React.FC = () => {
  const [view, setView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile>(GUEST_USER);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginInput, setLoginInput] = useState({ user: '', pass: '' });
  const [isSyncing, setIsSyncing] = useState(false);

  // States
  const [unitsData, setUnitsData] = useState<Record<string, Unit[]>>(MOCK_UNITS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [mascots, setMascots] = useState<MascotSettings[]>(DEFAULT_MASCOTS);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [songs, setSongs] = useState<Song[]>([]);
  const [subjectConfig, setSubjectConfig] = useState<Record<Subject, SubjectStyle>>(INITIAL_SUBJECT_CONFIG);
  const [gradeSubjectsMapping, setGradeSubjectsMapping] = useState<Record<Grade, Subject[]>>(INITIAL_GRADE_SUBJECTS);

  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);

  // 1. Verileri Buluttan Yükle (Uygulama açılışında)
  useEffect(() => {
    const initApp = async () => {
      const globalData = await loadFromCloud();
      if (globalData) {
        if (globalData.units) setUnitsData(globalData.units);
        if (globalData.siteSettings) setSiteSettings(globalData.siteSettings);
        if (globalData.mascots) setMascots(globalData.mascots);
        if (globalData.subjectConfig) setSubjectConfig(globalData.subjectConfig);
        if (globalData.gradeSubjectsMapping) setGradeSubjectsMapping(globalData.gradeSubjectsMapping);
      }
    };
    initApp();
  }, []);

  // 2. Global Kaydetme Fonksiyonu
  const handleGlobalSync = async (overrides?: Partial<GlobalState>) => {
    setIsSyncing(true);
    const stateToSave: GlobalState = {
      units: overrides?.units || unitsData,
      siteSettings: overrides?.siteSettings || siteSettings,
      mascots: overrides?.mascots || mascots,
      subjectConfig: overrides?.subjectConfig || subjectConfig,
      gradeSubjectsMapping: overrides?.gradeSubjectsMapping || gradeSubjectsMapping
    };
    
    const success = await saveToCloud(stateToSave);
    if (success) {
      console.log("Global senkronizasyon başarılı.");
    }
    setIsSyncing(false);
  };

  const isAdmin = currentUser.role === 'admin' && isAdminAuthenticated;
  const isGuest = currentUser.id === 'guest';

  const statsData = useMemo(() => {
    const allUnits = Object.values(unitsData).flat() as Unit[];
    const allTopics = allUnits.flatMap(u => u.topics);
    return {
      totalLessons: allTopics.length,
      totalPresentations: allTopics.reduce((acc, t) => acc + (t.presentationSteps?.length || 0), 0),
      totalActivities: allTopics.reduce((acc, t) => acc + (t.activities?.length || 0), 0),
      totalQuestions: allTopics.reduce((acc, t) => acc + (t.assessment?.questions?.length || 0), 0),
    };
  }, [unitsData]);

  const currentUnits = useMemo(() => {
    if (!selectedGrade || !selectedSubject) return [];
    const key = `${selectedGrade}-${selectedSubject}`;
    return unitsData[key] || [];
  }, [selectedGrade, selectedSubject, unitsData]);

  const handleAdminLogin = () => {
    if (adminPasswordInput === 'KocamanFb1907') {
      setIsAdminAuthenticated(true);
      setCurrentUser({ ...GUEST_USER, id: 'admin-1', role: 'admin', name: 'Yönetici' });
      setShowAdminLogin(false);
      setView('admin-dashboard');
    } else {
      alert('Hatalı Şifre!');
    }
  };

  const handleStudentLogin = () => {
    if (loginInput.user === 'ogrenci' && loginInput.pass === '123') {
       setCurrentUser({ ...GUEST_USER, id: 'stud-demo', name: 'Demo Öğrenci', username: 'ogrenci', grade: 1 });
       setShowStudentLogin(false);
       alert("Hoş geldin! 🚀");
    } else {
       alert("Kullanıcı adı veya şifre hatalı! (Demo: ogrenci / 123)");
    }
  };

  const handleGradeSelect = (g: Grade) => {
    if (!isGuest && !isAdmin && g !== currentUser.grade) {
      alert(`Sadece atandığın ${currentUser.grade}. Sınıf alanına erişebilirsin.`);
      return;
    }
    setSelectedGrade(g);
    setView(g === 'SC' ? 'units' : 'subjects');
  };

  return (
    <Layout 
      onHomeClick={() => setView('landing')} 
      onAdminClick={() => isAdminAuthenticated ? setView('admin-dashboard') : setShowAdminLogin(true)}
      onLoginClick={() => setShowStudentLogin(true)}
      siteSettings={siteSettings}
      currentUser={currentUser}
      isGuest={isGuest}
      currentGrade={selectedGrade}
    >
      {isSyncing && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-2xl animate-pulse">
           <i className="fas fa-cloud-upload-alt mr-2"></i> Bulutla Senkronize Ediliyor...
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[3rem] max-w-md w-full shadow-2xl animate-bounceIn">
             <h3 className="text-2xl font-black text-center mb-6 uppercase tracking-tighter">Yönetici Paneli</h3>
             <input type="password" autoFocus className="w-full bg-slate-50 p-5 rounded-2xl border-2 mb-6 text-center text-2xl font-black outline-none focus:border-indigo-600" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} />
             <div className="flex gap-4">
                <button onClick={() => setShowAdminLogin(false)} className="flex-1 py-4 font-black text-slate-400">İptal</button>
                <button onClick={handleAdminLogin} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">Giriş Yap</button>
             </div>
          </div>
        </div>
      )}

      {showStudentLogin && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[4rem] max-w-md w-full shadow-2xl animate-bounceIn border-4 border-indigo-50">
             <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                   <i className="fas fa-rocket text-3xl"></i>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">MACERAYA BAŞLA!</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Giriş Yap</p>
             </div>
             <div className="space-y-4">
                <input type="text" className="w-full bg-slate-50 p-5 rounded-2xl border-2 outline-none focus:border-indigo-600 font-bold" placeholder="Kullanıcı Adı" value={loginInput.user} onChange={e => setLoginInput({...loginInput, user: e.target.value})} />
                <input type="password" className="w-full bg-slate-50 p-5 rounded-2xl border-2 outline-none focus:border-indigo-600 font-bold" placeholder="Şifre" value={loginInput.pass} onChange={e => setLoginInput({...loginInput, pass: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleStudentLogin()} />
             </div>
             <div className="mt-8 space-y-3">
                <button onClick={handleStudentLogin} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl">Giriş Yap 🚀</button>
                <button onClick={() => setShowStudentLogin(false)} className="w-full py-3 font-black text-slate-400 uppercase text-[10px]">Geri Dön</button>
             </div>
          </div>
        </div>
      )}

      {view === 'landing' && (
        <LandingPage stats={statsData} onGradeSelect={handleGradeSelect} onLibraryClick={() => setView('library')} onMusicClick={() => setView('music-room')} onLoginClick={() => setShowStudentLogin(true)} currentUser={currentUser} isAdmin={isAdmin} isGuest={isGuest} />
      )}

      {view === 'subjects' && selectedGrade && (
        <div className="max-w-7xl mx-auto py-12 animate-fadeIn px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">{selectedGrade}. Sınıf Branşları</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">Dersini seç ve maceraya başla!</p>
            </div>
            <button onClick={() => setView('landing')} className="group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl border-b-4 border-slate-100 hover:bg-slate-900 hover:text-white transition-all">
              <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Ana Sayfaya Dön
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {gradeSubjectsMapping[selectedGrade].map(subject => {
              const config = subjectConfig[subject];
              if (!config) return null;
              return (
                <button key={subject} onClick={() => { setSelectedSubject(subject); setView('units'); }} className="group relative bg-white rounded-[4rem] shadow-2xl overflow-hidden transition-all hover:-translate-y-4 flex flex-col items-start text-left h-[450px]">
                  <div className="relative w-full h-[60%] overflow-hidden">
                    <img src={config.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={subject} />
                    <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-30 group-hover:opacity-10 transition-opacity`}></div>
                    <div className={`absolute -bottom-10 right-10 w-20 h-20 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-3xl transform group-hover:rotate-12 transition-all`}>
                      <i className={`fas ${config.icon}`} style={{ color: config.color }}></i>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col justify-end w-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-40">MÜFREDAT UYUMLU</span>
                    <h3 className="text-3xl font-black uppercase text-slate-800 tracking-tighter mb-4">{subject}</h3>
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest" style={{ color: config.color }}>
                      Dersleri İncele <i className="fas fa-chevron-right text-[10px] animate-bounce-x"></i>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-4" style={{ backgroundColor: config.color }}></div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === 'units' && selectedGrade && selectedSubject && (
        <div className="max-w-6xl mx-auto py-12 animate-fadeIn">
          <div className="flex justify-between items-center mb-12 bg-white p-8 rounded-[3rem] shadow-xl border">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-slate-50">
                  <i className={`fas ${subjectConfig[selectedSubject].icon}`} style={{ color: subjectConfig[selectedSubject].color }}></i>
               </div>
               <div>
                  <p className="font-black text-[10px] uppercase tracking-widest" style={{ color: subjectConfig[selectedSubject].color }}>{selectedGrade}. Sınıf / {selectedSubject}</p>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Üniteler ve Konular</h3>
               </div>
            </div>
            <div className="flex gap-4">
               {isAdmin && <button onClick={() => setView('admin-workspace')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-lg">Müfredatı Düzenle</button>}
               <button onClick={() => setView(selectedGrade === 'SC' ? 'landing' : 'subjects')} className="bg-slate-100 text-slate-400 px-8 py-3 rounded-2xl font-black uppercase text-xs">Geri</button>
            </div>
          </div>
          {currentUnits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentUnits.map((unit) => (
                <div key={unit.id} className="bg-white rounded-[3.5rem] shadow-xl p-8 border hover:shadow-2xl transition-all">
                   {unit.coverImage && <img src={unit.coverImage} className="w-full h-32 object-cover rounded-3xl mb-6 shadow-sm" />}
                   <h4 className="text-xl font-black mb-6 uppercase border-b-4 border-slate-50 pb-4" style={{ color: subjectConfig[selectedSubject].color }}>{unit.title}</h4>
                   <div className="space-y-3">
                      {unit.topics.map((topic) => (
                        <button key={topic.id} onClick={() => { setSelectedTopic(topic); setView('workspace'); }} className="w-full text-left bg-slate-50 p-5 rounded-2xl font-bold hover:text-white transition-all shadow-sm flex items-center justify-between group" style={{'--hover-bg': subjectConfig[selectedSubject].color} as any}>
                          <span className="flex-1 group-hover:translate-x-1 transition-transform">{topic.title}</span>
                          <i className="fas fa-play-circle opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </button>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed">
               <p className="text-slate-400 font-black uppercase tracking-widest">Henüz bu branş için içerik eklenmemiş.</p>
               {isAdmin && <button onClick={() => setView('admin-workspace')} className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase">İçerik Ekle</button>}
            </div>
          )}
        </div>
      )}

      {view === 'admin-dashboard' && isAdmin && (
        <div className="max-w-6xl mx-auto py-10 animate-fadeIn grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <button onClick={() => setView('admin-mufredat')} className="p-12 bg-white rounded-[4rem] shadow-xl border-4 border-indigo-50 hover:border-indigo-600 transition-all flex flex-col items-center">
              <i className="fas fa-book-open text-6xl text-indigo-600 mb-6"></i>
              <span className="font-black uppercase tracking-tighter text-xl">Müfredat Stüdyosu</span>
           </button>
           <button onClick={() => setView('admin-subjects')} className="p-12 bg-white rounded-[4rem] shadow-xl border-4 border-blue-50 hover:border-blue-600 transition-all flex flex-col items-center">
              <i className="fas fa-palette text-6xl text-blue-600 mb-6"></i>
              <span className="font-black uppercase tracking-tighter text-xl">Ders Yönetimi</span>
           </button>
           <button onClick={() => setView('admin-users')} className="p-12 bg-white rounded-[4rem] shadow-xl border-4 border-emerald-50 hover:border-emerald-600 transition-all flex flex-col items-center">
              <i className="fas fa-users text-6xl text-emerald-600 mb-6"></i>
              <span className="font-black uppercase tracking-tighter text-xl">Kullanıcı Yönetimi</span>
           </button>
           <button onClick={() => setView('admin-mascots')} className="p-12 bg-white rounded-[4rem] shadow-xl border-4 border-purple-50 hover:border-purple-600 transition-all flex flex-col items-center">
              <i className="fas fa-cat text-6xl text-purple-600 mb-6"></i>
              <span className="font-black uppercase tracking-tighter text-xl">Maskot Lab</span>
           </button>
           <button onClick={() => setView('admin-library')} className="p-12 bg-white rounded-[4rem] shadow-xl border-4 border-orange-50 hover:border-orange-600 transition-all flex flex-col items-center">
              <i className="fas fa-feather-alt text-6xl text-orange-600 mb-6"></i>
              <span className="font-black uppercase tracking-tighter text-xl">Büyülü Kütüphane</span>
           </button>
           <button onClick={() => setView('admin-music')} className="p-12 bg-white rounded-[4rem] shadow-xl border-4 border-pink-50 hover:border-pink-600 transition-all flex flex-col items-center">
              <i className="fas fa-music text-6xl text-pink-600 mb-6"></i>
              <span className="font-black uppercase tracking-tighter text-xl">Notalı Bahçe</span>
           </button>
           <button onClick={() => setView('admin-site')} className="p-12 bg-white rounded-[4rem] shadow-xl border-4 border-slate-50 hover:border-slate-600 transition-all flex flex-col items-center">
              <i className="fas fa-cog text-6xl text-slate-600 mb-6"></i>
              <span className="font-black uppercase tracking-tighter text-xl">Site Ayarları</span>
           </button>
        </div>
      )}

      {view === 'admin-subjects' && isAdmin && (
        <AdminSubjectManagement 
          subjectConfig={subjectConfig}
          gradeSubjects={gradeSubjectsMapping}
          onSave={(conf, map) => { setSubjectConfig(conf); setGradeSubjectsMapping(map); handleGlobalSync({subjectConfig: conf, gradeSubjectsMapping: map}); }}
          onClose={() => setView('admin-dashboard')}
        />
      )}

      {view === 'admin-mufredat' && isAdmin && (
        <div className="max-w-6xl mx-auto py-10 animate-fadeIn">
          <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[3rem] shadow-xl border">
             <h2 className="text-3xl font-black uppercase">Müfredat Planlama</h2>
             <button onClick={() => setView('admin-dashboard')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs">Geri</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             {[1,2,3,4,'SC'].map(g => (
               <button key={g} onClick={() => { setSelectedGrade(g as Grade); setView('admin-mufredat-subjects'); }} className="bg-white p-8 rounded-3xl shadow-md font-black text-2xl hover:bg-indigo-600 hover:text-white transition-all">
                  {g}
               </button>
             ))}
          </div>
        </div>
      )}

      {view === 'admin-mufredat-subjects' && selectedGrade && isAdmin && (
        <div className="max-w-6xl mx-auto py-10 animate-fadeIn">
          <div className="flex justify-between items-center mb-10">
             <h2 className="text-3xl font-black uppercase">{selectedGrade}. Sınıf Branş Seçimi</h2>
             <button onClick={() => setView('admin-mufredat')} className="text-indigo-600 font-black uppercase">Geri</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {gradeSubjectsMapping[selectedGrade].map(sub => (
               <button key={sub} onClick={() => { setSelectedSubject(sub as Subject); setView('admin-workspace'); }} className="bg-white p-10 rounded-[3rem] shadow-xl border hover:border-indigo-600 flex flex-col items-center">
                  <span className="text-2xl font-black uppercase">{sub}</span>
               </button>
             ))}
          </div>
        </div>
      )}

      {view === 'admin-workspace' && isAdmin && (
        <AdminWorkspace 
          units={currentUnits} 
          grade={selectedGrade!} 
          subject={selectedSubject!} 
          onSaveUnits={u => { const newData = {...unitsData, [`${selectedGrade}-${selectedSubject}`]: u}; setUnitsData(newData); handleGlobalSync({units: newData}); }} 
          onBack={() => setView('units')} 
        />
      )}

      {view === 'admin-users' && isAdmin && (
        <AdminUserManagement users={users} onAddUser={u => setUsers([...users, u])} onUpdateUser={setUsers} onDeleteUser={id => setUsers(users.filter(u => u.id !== id))} onClose={() => setView('admin-dashboard')} />
      )}

      {view === 'admin-mascots' && isAdmin && (
        <AdminMascotManagement mascots={mascots} onSave={m => { setMascots(m); handleGlobalSync({mascots: m}); }} onClose={() => setView('admin-dashboard')} />
      )}

      {view === 'admin-site' && isAdmin && (
        <AdminSiteSettings settings={siteSettings} onSave={s => { setSiteSettings(s); handleGlobalSync({siteSettings: s}); }} onClose={() => setView('admin-dashboard')} />
      )}

      {view === 'admin-library' && isAdmin && (
        <AdminLibraryManagement books={books} onSave={setBooks} onClose={() => setView('admin-dashboard')} />
      )}

      {view === 'admin-music' && isAdmin && (
        <AdminMusicManagement songs={songs} onSave={setSongs} onClose={() => setView('admin-dashboard')} />
      )}

      {view === 'workspace' && selectedTopic && (
        <TopicWorkspace topic={selectedTopic} grade={selectedGrade!} subject={selectedSubject!} mascots={mascots} onBack={() => setView('units')} onComplete={(res) => { setLastQuizResult(res); setView('ai-advisor'); }} />
      )}

      {view === 'ai-advisor' && lastQuizResult && (
        <AIAdvisor result={lastQuizResult} user={currentUser} onClose={() => setView('landing')} />
      )}

      {view === 'library' && <LibraryWorkspace books={books} onBack={() => setView('landing')} />}
      {view === 'music-room' && <MusicRoom songs={songs} onBack={() => setView('landing')} />}
    </Layout>
  );
};

export default App;
