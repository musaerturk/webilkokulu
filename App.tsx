
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AIAdvisor from './components/AIAdvisor';
import TopicWorkspace from './components/TopicWorkspace';
import AdminWorkspace from './components/AdminWorkspace';
import AdminUserManagement from './components/AdminUserManagement';
import AdminGamification from './components/AdminGamification';
import AdminMascotManagement from './components/AdminMascotManagement';
import AdminSiteSettings from './components/AdminSiteSettings';
import AdminLibraryManagement from './components/AdminLibraryManagement';
import AdminMusicManagement from './components/AdminMusicManagement';
import UserProfilePanel from './components/UserProfilePanel';
import BilkusWorkspace from './components/BilkusWorkspace';
import LibraryWorkspace from './components/LibraryWorkspace';
import MusicRoom from './components/MusicRoom';
import Mascot from './components/Mascot';
import { Grade, Subject, Topic, QuizResult, Unit, UserProfile, RankDefinition, Badge, Quest, MascotSettings, SiteSettings, Book, Song } from './types';
import { MOCK_UNITS, GRADE_SUBJECTS, SUBJECT_ICONS, MOCK_BOOKS } from './constants';

const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Misafir Kullanıcı',
  email: '',
  phone: '',
  grade: 1,
  role: 'student',
  badges: [],
  joinDate: '',
  points: 0
};

const DEFAULT_MASCOTS: MascotSettings[] = [
  { role: 'presentation', type: 'turtle', name: 'Bilge Tonti' },
  { role: 'game', type: 'cat', name: 'Mırnav' },
  { role: 'assessment', type: 'rabbit', name: 'Zıpzıp' },
  { role: 'coach', type: 'fox', name: 'Fikir' },
  { role: 'wisdom', type: 'owl', name: 'Bilkuş' }
];

const BRAND_W_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%234f46e5;'/><stop offset='50%' style='stop-color:%233b82f6;'/><stop offset='100%' style='stop-color:%2310b981;'/></linearGradient><filter id='s'><feDropShadow dx='0' dy='2' stdDeviation='2' flood-opacity='0.2'/></filter></defs><rect width='90' height='90' x='5' y='5' rx='28' fill='white' filter='url(%23s)'/><path d='M22 35 L38 72 L50 48 L62 72 L78 35' stroke='url(%23g)' stroke-width='14' stroke-linecap='round' stroke-linejoin='round' fill='none'/><circle cx='38' cy='58' r='3.5' fill='white'/><circle cx='62' cy='58' r='3.5' fill='white'/></svg>`;

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: BRAND_W_LOGO,
  footerDescription: '"Kendin ol, kendi hızında öğren. Senin okulun, senin maceran!"',
  contactEmail: "merhaba@webilkokulu.com",
  contactPhone: "0850 123 45 67",
  socialMedia: {
    instagram: "https://instagram.com/webilkokulu",
    youtube: "https://youtube.com/webilkokulu",
    twitter: "https://twitter.com/webilkokulu"
  },
  aboutUs: "Webilkokulu, Türkiye'deki ilkokul öğrencileri için MEB müfredatına uygun, eğlenceli ve interaktif bir öğrenme deneyimi sunmak amacıyla kurulmuş bir eğitim platformudur.",
  privacyPolicy: "Webilkokulu olarak kişisel verilerinizin güvenliği bizim için çok önemlidir. Verileriniz KVKK uyumlu olarak korunmaktadır.",
  termsOfUse: "Platformumuzu kullanan her birey, eğitim odaklı ve saygılı bir iletişim kurmayı kabul etmiş sayılır.",
  faq: [
    { question: "Nasıl kayıt olabilirim?", answer: "Üst menüdeki Katıl butonuna basarak öğrenci bilgilerinizle kayıt olabilirsiniz." },
    { question: "Platform ücretli mi?", answer: "Webilkokulu'nun temel özellikleri tüm öğrencilerimiz için her zaman ücretsiz kalacaktır." }
  ],
  storageConfig: { provider: 'none' }
};

type AppView = 
  | 'landing' | 'home' | 'subjects' | 'units' | 'workspace' | 'advisor-list' | 'bilkus' 
  | 'admin' | 'admin-users' | 'admin-gamification' | 'admin-mascots' | 'admin-settings' | 'admin-library' | 'admin-music' 
  | 'profile' | 'library' | 'music-room' 
  | 'about' | 'kvkk' | 'terms' | 'contact' | 'faq';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [unitsData, setUnitsData] = useState<Record<string, Unit[]>>(MOCK_UNITS);
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [songs, setSongs] = useState<Song[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(GUEST_USER);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);

  const [badgeDefinitions, setBadgeDefinitions] = useState<Badge[]>([]);
  const [rankDefinitions, setRankDefinitions] = useState<RankDefinition[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [mascotSettings, setMascotSettings] = useState<MascotSettings[]>(DEFAULT_MASCOTS);

  // Persistence
  useEffect(() => {
    const savedUnits = localStorage.getItem('webilkokulu_units');
    if (savedUnits) setUnitsData(JSON.parse(savedUnits));
    const savedBooks = localStorage.getItem('webilkokulu_books');
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    const savedSongs = localStorage.getItem('webilkokulu_songs');
    if (savedSongs) setSongs(JSON.parse(savedSongs));
    const savedSettings = localStorage.getItem('webilkokulu_settings');
    if (savedSettings) setSiteSettings(JSON.parse(savedSettings));
    const savedUser = localStorage.getItem('webilkokulu_current_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setCurrentUser(u);
      if (u.role === 'admin') setIsAdminAuthenticated(true);
    }
    const savedGamification = localStorage.getItem('webilkokulu_gamification');
    if (savedGamification) {
      const data = JSON.parse(savedGamification);
      setBadgeDefinitions(data.badges || []);
      setRankDefinitions(data.ranks || []);
      setQuests(data.quests || []);
    }
    const savedMascots = localStorage.getItem('webilkokulu_mascots');
    if (savedMascots) setMascotSettings(JSON.parse(savedMascots));
  }, []);

  useEffect(() => { localStorage.setItem('webilkokulu_units', JSON.stringify(unitsData)); }, [unitsData]);
  useEffect(() => { localStorage.setItem('webilkokulu_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('webilkokulu_songs', JSON.stringify(songs)); }, [songs]);
  useEffect(() => { localStorage.setItem('webilkokulu_settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => {
    localStorage.setItem('webilkokulu_gamification', JSON.stringify({
      badges: badgeDefinitions,
      ranks: rankDefinitions,
      quests: quests
    }));
  }, [badgeDefinitions, rankDefinitions, quests]);
  useEffect(() => { localStorage.setItem('webilkokulu_mascots', JSON.stringify(mascotSettings)); }, [mascotSettings]);

  const isAdmin = currentUser.role === 'admin' && isAdminAuthenticated;

  const currentUnits = useMemo(() => {
    if (!selectedGrade || !selectedSubject) return [];
    const key = `${selectedGrade}-${selectedSubject}`;
    return unitsData[key] || [];
  }, [selectedGrade, selectedSubject, unitsData]);

  const handleAdminLogin = () => {
    if (adminPasswordInput === 'KocamanFb1907') {
      setIsAdminAuthenticated(true);
      const adminUser: UserProfile = { ...GUEST_USER, id: 'admin-1', role: 'admin', name: 'Yönetici' };
      setCurrentUser(adminUser);
      localStorage.setItem('webilkokulu_current_user', JSON.stringify(adminUser));
      setShowAdminLogin(false);
      setAdminPasswordInput('');
      setView('home');
    } else {
      alert('Hatalı Şifre!');
    }
  };

  const renderCorporatePage = (title: string, content: string) => (
    <div className="max-w-4xl mx-auto py-20 animate-fadeIn">
       <div className="bg-white p-16 rounded-[4rem] shadow-2xl border-b-8 border-indigo-600">
          <h2 className="text-4xl font-black text-slate-900 uppercase mb-8 tracking-tighter">{title}</h2>
          <div className="prose prose-indigo prose-lg text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
             {content}
          </div>
          <button onClick={() => setView('landing')} className="mt-12 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl">Geri Dön</button>
       </div>
    </div>
  );

  return (
    <Layout 
      onHomeClick={() => { setView('landing'); setSelectedGrade(null); setSelectedSubject(null); }} 
      onAdvisorClick={() => setView('advisor-list')}
      onProfileClick={() => setView('profile')}
      onAdminClick={() => isAdminAuthenticated ? setView('home') : setShowAdminLogin(true)}
      onViewChange={(v) => setView(v as AppView)}
      currentGrade={selectedGrade}
      currentUser={currentUser}
      isGuest={currentUser.id === 'guest'}
      siteSettings={siteSettings}
    >
      {showAdminLogin && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl animate-bounceIn">
             <div className="text-center mb-8">
                <i className="fas fa-lock text-5xl text-indigo-600 mb-4"></i>
                <h3 className="text-2xl font-black text-slate-900 uppercase">Yönetici Girişi</h3>
             </div>
             <input type="password" autoFocus className="w-full bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 font-black text-center text-xl mb-6" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} />
             <div className="flex gap-3">
                <button onClick={() => setShowAdminLogin(false)} className="flex-1 py-4 font-black uppercase text-xs text-slate-400">İptal</button>
                <button onClick={handleAdminLogin} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Giriş Yap</button>
             </div>
          </div>
        </div>
      )}

      {view === 'landing' && (
        <LandingPage stats={{totalLessons: Object.keys(unitsData).length, totalPresentations: 0, totalQuestions: 0, totalActivities: 0}} currentUser={currentUser} isGuest={currentUser.id === 'guest'} onGradeSelect={(g) => { setSelectedGrade(g); g === 'SC' ? (setSelectedSubject('Sesten Cümleye'), setView('units')) : setView('subjects'); }} onLibraryClick={() => setView('library')} onMusicClick={() => setView('music-room')} isAdmin={isAdmin} />
      )}

      {view === 'home' && isAdmin && (
        <div className="max-w-6xl mx-auto py-10 space-y-8 animate-fadeIn">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-lg">
                    <img src={siteSettings.logoUrl} className="w-full h-full object-contain" alt="W" />
                 </div>
                 <h2 className="text-4xl font-black uppercase tracking-tighter">Yönetim Kulesi</h2>
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                 <button onClick={() => setView('admin-settings')} className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg hover:bg-slate-700">⚙️ Ayarlar</button>
                 <button onClick={() => setView('admin-library')} className="bg-purple-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg">📚 Kitaplık</button>
                 <button onClick={() => setView('admin-music')} className="bg-pink-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg">🎵 Müzik</button>
                 <button onClick={() => setView('admin-users')} className="bg-indigo-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg">👥 Üyeler</button>
                 <button onClick={() => setView('admin-gamification')} className="bg-orange-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg">🏆 Ödüller</button>
                 <button onClick={() => setView('admin-mascots')} className="bg-pink-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg">🦊 Maskotlar</button>
                 <button onClick={() => { setIsAdminAuthenticated(false); setCurrentUser(GUEST_USER); localStorage.removeItem('webilkokulu_current_user'); setView('landing'); }} className="bg-red-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px]">Çıkış</button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                 <h3 className="text-2xl font-black uppercase mb-6 text-slate-800">Müfredat Editörü</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 'SC'].map(g => (
                      <button key={g} onClick={() => { setSelectedGrade(g as Grade); g === 'SC' ? (setSelectedSubject('Sesten Cümleye'), setView('units')) : setView('subjects'); }} className="py-4 rounded-2xl bg-slate-50 font-black text-xs uppercase hover:bg-indigo-600 hover:text-white transition-all border-2 border-slate-100">
                        {g === 'SC' ? 'SES DÜNYASI' : `${g}. SINIF`}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="bg-indigo-50 p-10 rounded-[3rem] border-4 border-white shadow-inner flex flex-col justify-center text-center">
                 <h4 className="text-xl font-black text-indigo-900 uppercase mb-2">Sistem Durumu</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl"><span className="block text-2xl font-black text-indigo-600">{books.length}</span><span className="text-[10px] font-black uppercase text-slate-400">Kitap</span></div>
                    <div className="bg-white p-4 rounded-2xl"><span className="block text-2xl font-black text-pink-500">{songs.length}</span><span className="text-[10px] font-black uppercase text-slate-400">Şarkı</span></div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {view === 'about' && renderCorporatePage('Hakkımızda', siteSettings.aboutUs)}
      {view === 'kvkk' && renderCorporatePage('Gizlilik ve KVKK', siteSettings.privacyPolicy)}
      {view === 'terms' && renderCorporatePage('Kullanım Şartları', siteSettings.termsOfUse)}
      {view === 'contact' && (
        <div className="max-w-4xl mx-auto py-20 animate-fadeIn">
           <div className="bg-white p-16 rounded-[4rem] shadow-2xl border-b-8 border-indigo-600 text-center">
              <h2 className="text-4xl font-black text-slate-900 uppercase mb-8 tracking-tighter">İLETİŞİM</h2>
              <div className="space-y-6">
                 <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-envelope text-indigo-600 text-3xl mb-2"></i>
                    <p className="text-2xl font-black text-slate-800">{siteSettings.contactEmail}</p>
                 </div>
                 <div className="flex flex-col items-center gap-2 pt-6">
                    <i className="fas fa-phone text-emerald-600 text-3xl mb-2"></i>
                    <p className="text-2xl font-black text-slate-800">{siteSettings.contactPhone}</p>
                 </div>
              </div>
              <button onClick={() => setView('landing')} className="mt-12 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl">Geri Dön</button>
           </div>
        </div>
      )}
      {view === 'faq' && (
        <div className="max-w-4xl mx-auto py-20 animate-fadeIn">
           <div className="bg-white p-16 rounded-[4rem] shadow-2xl border-b-8 border-emerald-600">
              <h2 className="text-4xl font-black text-slate-900 uppercase mb-10 tracking-tighter text-center">Sıkça Sorulan Sorular</h2>
              <div className="space-y-6">
                 {siteSettings.faq.map((f, i) => (
                   <div key={i} className="bg-slate-50 p-8 rounded-3xl border-2 border-transparent hover:border-emerald-100 transition-all">
                      <h4 className="text-xl font-black text-emerald-900 mb-2">? {f.question}</h4>
                      <p className="text-slate-600 font-bold">{f.answer}</p>
                   </div>
                 ))}
              </div>
              <div className="text-center mt-12">
                 <button onClick={() => setView('landing')} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl">Geri Dön</button>
              </div>
           </div>
        </div>
      )}

      {view === 'admin-settings' && isAdmin && (
        <AdminSiteSettings settings={siteSettings} onSave={setSiteSettings} onClose={() => setView('home')} />
      )}
      {view === 'admin-library' && isAdmin && (
        <AdminLibraryManagement books={books} onSave={setBooks} onClose={() => setView('home')} />
      )}
      {view === 'admin-music' && isAdmin && (
        <AdminMusicManagement songs={songs} onSave={setSongs} onClose={() => setView('home')} />
      )}
      {view === 'admin-users' && <AdminUserManagement users={[]} onAddUser={()=>{}} onDeleteUser={()=>{}} onClose={() => setView('home')} />}
      {view === 'admin-gamification' && <AdminGamification badges={badgeDefinitions} onSaveBadges={setBadgeDefinitions} ranks={rankDefinitions} onSaveRanks={setRankDefinitions} quests={quests} onSaveQuests={setQuests} onClose={() => setView('home')} />}
      {view === 'admin-mascots' && <AdminMascotManagement mascots={mascotSettings} onSave={setMascotSettings} onClose={() => setView('home')} />}
      
      {view === 'subjects' && selectedGrade && (
        <div className="animate-fadeIn max-w-6xl mx-auto py-6">
          <div className="mb-12 flex items-center gap-6">
             <button onClick={() => setView('landing')} className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-indigo-600 hover:scale-110 transition-all"><i className="fas fa-arrow-left"></i></button>
             <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{selectedGrade === 'SC' ? 'SES DÜNYASI' : `${selectedGrade}. SINIF BRANŞLARI`}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {GRADE_SUBJECTS[selectedGrade].map((subject) => (
              <button key={subject} onClick={() => { setSelectedSubject(subject); setView('units'); }} className="bg-white p-6 rounded-[3.5rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-all flex flex-col items-center">
                <div className="w-full aspect-video bg-slate-50 rounded-[2.5rem] mb-6 flex items-center justify-center text-5xl">{SUBJECT_ICONS[subject]}</div>
                <h3 className="text-2xl font-black text-gray-800 uppercase">{subject}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'units' && selectedGrade && selectedSubject && (
        <div className="animate-fadeIn max-w-6xl mx-auto py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <button onClick={() => selectedGrade === 'SC' ? setView('landing') : setView('subjects')} className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-indigo-600"><i className="fas fa-chevron-left"></i></button>
              <div><h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{selectedSubject}</h3><p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{selectedGrade === 'SC' ? 'ÖZEL' : `${selectedGrade}. SINIF`}</p></div>
            </div>
            {isAdmin && <button onClick={() => setView('admin')} className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase shadow-xl hover:bg-indigo-700 transition-all"><i className="fas fa-edit mr-2"></i> MÜFREDATI DÜZENLE</button>}
          </div>
          
          {currentUnits.length > 0 ? (
            <div className="grid grid-cols-1 gap-12">
              {currentUnits.map((unit) => (
                <div key={unit.id} className="bg-white rounded-[3.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                   <div className="relative h-64 bg-slate-100">
                      {unit.coverImage && <img src={unit.coverImage} className="w-full h-full object-cover" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-10"><h4 className="text-3xl font-black text-white uppercase tracking-tighter">{unit.title}</h4></div>
                   </div>
                   <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(unit.topics || []).map((topic) => (
                        <div key={topic.id} className="rounded-[3rem] bg-gray-50 border-2 border-transparent hover:border-indigo-200 transition-all shadow-sm flex flex-col p-8">
                             <h5 className="font-black text-gray-800 text-xl mb-6 uppercase tracking-tighter">{topic.title}</h5>
                             <button onClick={() => { setSelectedTopic(topic); setView('workspace'); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg">Dersi Başlat</button>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
               <Mascot type="fox" size="md" className="mx-auto opacity-30 mb-4" />
               <p className="text-slate-400 font-black uppercase tracking-widest text-sm mb-6">Henüz içerik eklenmemiş.</p>
               {isAdmin && <button onClick={() => setView('admin')} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs shadow-xl"><i className="fas fa-plus mr-2"></i> MÜFREDATI DÜZENLE</button>}
            </div>
          )}
        </div>
      )}

      {view === 'admin' && selectedGrade && selectedSubject && (
        <AdminWorkspace units={currentUnits} onSaveUnits={(u) => { setUnitsData(prev => ({...prev, [`${selectedGrade}-${selectedSubject}`]: u})); setView('units'); }} onBack={() => setView('units')} grade={selectedGrade} subject={selectedSubject} />
      )}

      {view === 'workspace' && selectedTopic && <TopicWorkspace topic={selectedTopic} grade={selectedGrade!} subject={selectedSubject!} mascots={mascotSettings} onBack={() => setView('units')} onComplete={(res) => { setHistory([res, ...history]); setLastQuizResult(res); setView('advisor-list'); }} />}
      {view === 'advisor-list' && lastQuizResult && <AIAdvisor result={lastQuizResult} user={currentUser} onClose={() => setView('landing')} onBilkusClick={() => setView('bilkus')} />}
      {view === 'bilkus' && lastQuizResult && <BilkusWorkspace result={lastQuizResult} mascots={mascotSettings} onBack={() => setView('landing')} />}
      {view === 'library' && <LibraryWorkspace onBack={() => setView('landing')} books={books} />}
      {view === 'music-room' && <MusicRoom onBack={() => setView('landing')} songs={songs} />}
      {view === 'profile' && <UserProfilePanel user={currentUser} history={history} onUpdate={(u) => { setCurrentUser(u); localStorage.setItem('webilkokulu_current_user', JSON.stringify(u)); }} onClose={() => setView('landing')} />}
    </Layout>
  );
};

export default App;
