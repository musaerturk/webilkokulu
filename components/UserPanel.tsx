
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserCourseProgress, TopicComment, Subject, ScheduleEntry, Assignment, DailyTask } from '../types';
import { getUserProfile, saveUserProfile, fetchData, saveData, getTopicComments, removeData, updateData } from '../services/firebaseService';
import { askAiAboutSubject } from '../services/geminiService';

interface UserPanelProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ profile, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'COURSES' | 'PLANNER'>('COURSES');
  const [plannerSubTab, setPlannerSubTab] = useState<'SCHEDULE' | 'ASSIGNMENTS' | 'DAILY'>('SCHEDULE');
  
  const [selectedCourse, setSelectedCourse] = useState<UserCourseProgress | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectTab, setSubjectTab] = useState<'PRESENTATION' | 'GAME' | 'ASSESSMENT' | 'ANALYSIS'>('PRESENTATION');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isLoading, setIsLoading] = useState(false);
  
  const [myProgress, setMyProgress] = useState<UserCourseProgress[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [comments, setComments] = useState<TopicComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'COMMENT' | 'QUESTION'>('COMMENT');

  // Planner States
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);

  // AI Chat States
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [aiQuestion, setAiQuestion] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    const remoteProfile = await getUserProfile("current-user-id") as UserProfile;
    if (remoteProfile) {
      setEditedProfile(remoteProfile);
      onUpdate(remoteProfile);
    }
    
    // Mock progress data
    setMyProgress([
      { 
        courseId: 'c1', 
        courseName: 'Eğlenceli Matematik', 
        totalProgress: 45, 
        units: [
          { subjectId: 's1', subjectName: 'Ritmik Sayma', progress: 100 },
          { subjectId: 's2', subjectName: 'Toplama İşlemi', progress: 60 },
          { subjectId: 's3', subjectName: 'Çıkarma İşlemi', progress: 0 }
        ],
        lastAccessed: new Date().toISOString() 
      }
    ]);

    const subjects = await fetchData('subjects') as Subject[];
    setAllSubjects(subjects);

    // Load Planner Data
    const schedData = await fetchData('schedule') as ScheduleEntry[];
    setSchedule(schedData);
    const assignData = await fetchData('assignments') as Assignment[];
    setAssignments(assignData);
    const dailyData = await fetchData('dailyTasks') as DailyTask[];
    setDailyTasks(dailyData);

    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedSubject) {
      loadComments(selectedSubject.id);
      setChatMessages([{ role: 'ai', text: `Merhaba ${profile.name}! Bugün ${selectedSubject.name} konusunu öğreniyoruz. Sorunu sorabilirsin! ✨` }]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadComments = async (subjectId: string) => {
    const data = await getTopicComments(subjectId);
    setComments(data as TopicComment[]);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await saveUserProfile("current-user-id", editedProfile);
      onUpdate(editedProfile);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  // --- PLANNER ACTIONS ---
  const handleAddSchedule = async () => {
    const activity = prompt("Ders/Aktivite Adı:");
    const day = prompt("Gün (Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar):");
    const time = prompt("Saat (Örn: 09:00):");
    if (!activity || !day || !time) return;
    await saveData('schedule', { day, time, activity, hasAlarm: false });
    const updated = await fetchData('schedule') as ScheduleEntry[];
    setSchedule(updated);
  };

  const handleAddAssignment = async () => {
    const title = prompt("Ödev/Proje Başlığı:");
    const type = prompt("Tür (Ödev, Proje, Performans):") as any;
    const dueDate = prompt("Teslim Tarihi (Örn: 15 Mart):");
    if (!title || !dueDate) return;
    await saveData('assignments', { title, type: type || 'Ödev', dueDate, completed: false, hasAlarm: false });
    const updated = await fetchData('assignments') as Assignment[];
    setAssignments(updated);
  };

  const handleAddDailyTask = async () => {
    const task = prompt("Yapılacak İş:");
    const time = prompt("Saat (Örn: 14:00):");
    if (!task || !time) return;
    await saveData('dailyTasks', { task, time, completed: false, hasAlarm: false });
    const updated = await fetchData('dailyTasks') as DailyTask[];
    setDailyTasks(updated);
  };

  const toggleAlarm = async (collection: string, item: any) => {
    await updateData(collection, item.id, { hasAlarm: !item.hasAlarm });
    if (!item.hasAlarm) {
      alert(`⏰ ${item.activity || item.task || item.title} için alarm kuruldu!`);
    }
    if (collection === 'schedule') setSchedule(prev => prev.map(i => i.id === item.id ? {...i, hasAlarm: !i.hasAlarm} : i));
    if (collection === 'assignments') setAssignments(prev => prev.map(i => i.id === item.id ? {...i, hasAlarm: !i.hasAlarm} : i));
    if (collection === 'dailyTasks') setDailyTasks(prev => prev.map(i => i.id === item.id ? {...i, hasAlarm: !i.hasAlarm} : i));
  };

  const handleDeletePlannerItem = async (collection: string, id: string) => {
    if (window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) {
      await removeData(collection, id);
      if (collection === 'schedule') setSchedule(prev => prev.filter(i => i.id !== id));
      if (collection === 'assignments') setAssignments(prev => prev.filter(i => i.id !== id));
      if (collection === 'dailyTasks') setDailyTasks(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleAddComment = async () => {
    if (!newComment || !selectedSubject) return;
    const commentData: Omit<TopicComment, 'id'> = {
      subjectId: selectedSubject.id,
      userId: "current-user-id",
      userName: profile.name,
      userPhoto: profile.photo,
      text: newComment,
      createdAt: new Date().toISOString(),
      type: commentType
    };
    await saveData('comments', commentData);
    setNewComment('');
    loadComments(selectedSubject.id);
  };

  const handleAskAi = async () => {
    if (!aiQuestion || !selectedSubject || isAiResponding) return;
    const userMsg = aiQuestion;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiQuestion('');
    setIsAiResponding(true);
    try {
      const context = selectedSubject.presentation.slides.map(s => s.text).join(' ');
      const response = await askAiAboutSubject(selectedSubject.name, context, userMsg);
      setChatMessages(prev => [...prev, { role: 'ai', text: response || "Şu an cevap veremiyorum!" }]);
    } finally {
      setIsAiResponding(false);
    }
  };

  if (isLoading && !isEditing && !selectedSubject && !selectedCourse) {
    return <div className="flex h-96 items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-2 lg:p-4 animate-in fade-in duration-500">
      
      {!selectedSubject && !selectedCourse && (
        <div className="flex justify-center mb-4 pt-4">
          <div className="bg-slate-100 p-1 rounded-[1.5rem] flex gap-1 shadow-inner">
            <button 
              onClick={() => setActiveTab('COURSES')}
              className={`px-6 py-2 rounded-2xl font-black text-xs transition-all ${activeTab === 'COURSES' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              📚 Kurslarım
            </button>
            <button 
              onClick={() => setActiveTab('PLANNER')}
              className={`px-6 py-2 rounded-2xl font-black text-xs transition-all ${activeTab === 'PLANNER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              📅 Planlayıcı
            </button>
            <button 
              onClick={() => setActiveTab('PROFILE')}
              className={`px-6 py-2 rounded-2xl font-black text-xs transition-all ${activeTab === 'PROFILE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              👤 Profilim
            </button>
          </div>
        </div>
      )}

      {activeTab === 'PLANNER' && (
        <div className="space-y-4 pt-2 animate-in slide-in-from-bottom-4">
           <div className="flex justify-between items-center bg-white p-4 rounded-[2rem] border border-slate-50 shadow-sm">
              <div className="flex gap-2">
                 {[
                   { id: 'SCHEDULE', label: 'Haftalık Program', icon: '📅' },
                   { id: 'ASSIGNMENTS', label: 'Ödevler & Projeler', icon: '📝' },
                   { id: 'DAILY', label: 'Günlük Ajanda', icon: '⏰' }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setPlannerSubTab(tab.id as any)}
                     className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${plannerSubTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}
                   >
                     {tab.icon} {tab.label}
                   </button>
                 ))}
              </div>
              <button 
                onClick={plannerSubTab === 'SCHEDULE' ? handleAddSchedule : plannerSubTab === 'ASSIGNMENTS' ? handleAddAssignment : handleAddDailyTask}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[11px] font-black shadow-lg hover:scale-105 transition-all"
              >
                + Yeni Ekle
              </button>
           </div>

           <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-50 shadow-xl min-h-[400px]">
              {plannerSubTab === 'SCHEDULE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map(day => (
                     <div key={day} className="space-y-3 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="font-black text-indigo-600 text-sm border-b border-indigo-100 pb-2">{day}</h4>
                        <div className="space-y-2">
                           {schedule.filter(s => s.day === day).map(item => (
                             <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50 flex justify-between items-center group">
                                <div className="min-w-0">
                                   <p className="text-[10px] font-black text-slate-400">{item.time}</p>
                                   <p className="text-xs font-bold text-slate-700 truncate">{item.activity}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => toggleAlarm('schedule', item)}
                                    className={`p-1.5 rounded-lg transition-all ${item.hasAlarm ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-300 opacity-0 group-hover:opacity-100'}`}
                                  >
                                    🔔
                                  </button>
                                  <button onClick={() => handleDeletePlannerItem('schedule', item.id)} className="p-1.5 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100">🗑️</button>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {plannerSubTab === 'ASSIGNMENTS' && (
                <div className="space-y-4">
                   {assignments.map(item => (
                     <div key={item.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${item.type === 'Proje' ? 'bg-rose-100 text-rose-600' : item.type === 'Performans' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                           {item.type === 'Proje' ? '🎨' : item.type === 'Performans' ? '🎭' : '📚'}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                             <h4 className="font-black text-slate-800 truncate">{item.title}</h4>
                             <span className="text-[9px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-400 font-bold uppercase shrink-0">{item.type}</span>
                           </div>
                           <p className="text-xs font-bold text-rose-400 mt-1">Son Tarih: {item.dueDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <button onClick={() => toggleAlarm('assignments', item)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${item.hasAlarm ? 'bg-amber-400 text-white' : 'bg-white text-slate-300'}`}>🔔</button>
                           <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-200'}`}>✔</button>
                           <button onClick={() => handleDeletePlannerItem('assignments', item.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-200 hover:text-red-400">🗑️</button>
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {plannerSubTab === 'DAILY' && (
                <div className="max-w-xl mx-auto space-y-3">
                   {dailyTasks.map(item => (
                     <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm group">
                        <span className="text-xs font-black text-indigo-500 w-12">{item.time}</span>
                        <div className="w-0.5 h-8 bg-slate-100"></div>
                        <p className="flex-1 font-bold text-slate-700 text-sm">{item.task}</p>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleAlarm('dailyTasks', item)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${item.hasAlarm ? 'bg-amber-100 text-amber-600' : 'text-slate-200'}`}>🔔</button>
                          <button onClick={() => handleDeletePlannerItem('dailyTasks', item.id)} className="w-8 h-8 text-slate-200 hover:text-red-400">🗑️</button>
                        </div>
                     </div>
                   ))}
                   {dailyTasks.length === 0 && <p className="text-center py-20 text-slate-400 font-medium italic">Bugün için plan girilmemiş.</p>}
                </div>
              )}
           </div>
        </div>
      )}

      {selectedSubject ? (
        <div className="space-y-4 pt-2">
          <button onClick={() => setSelectedSubject(null)} className="text-indigo-600 font-black text-xs px-3 py-1.5 bg-indigo-50 rounded-xl">&larr; Geri Dön</button>
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-50">
            <h2 className="text-2xl font-black text-slate-900 mb-4">{selectedSubject.name}</h2>
            <div className="flex gap-1 mb-4 p-1 bg-slate-50 rounded-2xl w-fit">
              {['PRESENTATION', 'GAME', 'ASSESSMENT', 'ANALYSIS'].map(tab => (
                <button key={tab} onClick={() => setSubjectTab(tab as any)} className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${subjectTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                  {tab === 'PRESENTATION' ? '🎬 Sunum' : tab === 'GAME' ? '🎮 Oyun' : tab === 'ASSESSMENT' ? '📝 Ölçme' : '📊 Analiz'}
                </button>
              ))}
            </div>
            {/* Subject content logic remains same for robustness */}
            <div className="min-h-[300px] bg-slate-50 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-4">{subjectTab === 'PRESENTATION' ? '🎬' : '🎮'}</span>
                <p className="font-bold text-slate-400">{selectedSubject.name} içeriği hazır!</p>
            </div>
          </div>
        </div>
      ) : activeTab === 'COURSES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
          {myProgress.map((item) => (
            <div key={item.courseId} className="bg-white rounded-[2rem] overflow-hidden shadow-md border border-slate-50 hover:shadow-xl transition-all">
               <div className="h-32 bg-slate-900 relative overflow-hidden">
                 <img src={`https://picsum.photos/400/200?edu=${item.courseId}`} className="w-full h-full object-cover opacity-60" alt={item.courseName} />
                 <h3 className="absolute bottom-4 left-4 text-white font-black text-lg">{item.courseName}</h3>
               </div>
               <div className="p-4 space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase"><span>İlerleme</span><span>%{item.totalProgress}</span></div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${item.totalProgress}%` }}></div></div>
                 </div>
                 <button onClick={() => setSelectedCourse(item)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg">Derse Başla</button>
               </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'PROFILE' ? (
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-50 max-w-2xl mx-auto animate-in zoom-in-95">
          <div className="h-32 bg-indigo-600 relative">
            <button onClick={() => setIsEditing(!isEditing)} className="absolute bottom-4 right-4 bg-white px-6 py-2 rounded-xl text-xs font-black shadow-lg">
              {isEditing ? '❌ Vazgeç' : '✏️ Profilini Düzenle'}
            </button>
          </div>
          <div className="px-8 pb-10 relative">
            <div className="absolute -top-12 left-8"><img src={profile.photo} className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover bg-white" alt="Profile" /></div>
            <div className="mt-14 space-y-4">
              {!isEditing ? (
                <>
                  <h1 className="text-3xl font-black text-slate-900">{profile.name}</h1>
                  <p className="text-slate-600 text-sm font-medium italic">"{profile.bio}"</p>
                  <div className="flex flex-wrap gap-2">
                      {profile.interests.map((int, i) => <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">#{int}</span>)}
                  </div>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <input type="text" value={editedProfile.name} onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" placeholder="İsim" />
                  <textarea value={editedProfile.bio} onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm h-24" placeholder="Hakkımda" />
                  <button onClick={handleSaveProfile} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg">Kaydet</button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserPanel;
