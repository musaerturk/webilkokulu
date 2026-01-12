
import React, { useState } from 'react';
import { UserProfile, Badge, QuizResult } from '../types';
import Mascot from './Mascot';
import GradeSymbol from './GradeSymbol';

interface UserProfilePanelProps {
  user: UserProfile;
  history: QuizResult[];
  onUpdate: (updatedUser: UserProfile) => void;
  onClose: () => void;
}

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ user, history, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'interests' | 'achievements'>('info');
  const [editUser, setEditUser] = useState<UserProfile>(user);

  const handleSave = () => {
    onUpdate(editUser);
    alert("Profil bilgilerin güncellendi!");
  };

  // Calculate stats for graph
  const last5Results = history.slice(0, 5).reverse();
  const maxScore = 100;

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-blue-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-full bg-white border-8 border-blue-400 overflow-hidden flex items-center justify-center">
              <Mascot type="rabbit" size="lg" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{user.name}</h2>
              <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mt-2">{user.grade}. Sınıf Kaşifi • Katılım: {user.joinDate}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-md">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        </div>

        <div className="flex border-b overflow-x-auto no-scrollbar bg-gray-50/50">
          <button onClick={() => setActiveTab('info')} className={`flex-1 min-w-[150px] py-6 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'info' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>Kişisel Bilgiler</button>
          <button onClick={() => setActiveTab('interests')} className={`flex-1 min-w-[150px] py-6 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'interests' ? 'text-purple-600 border-b-4 border-purple-600' : 'text-gray-400 hover:text-gray-600'}`}>İlgi Alanlarım</button>
          <button onClick={() => setActiveTab('achievements')} className={`flex-1 min-w-[150px] py-6 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'achievements' ? 'text-emerald-600 border-b-4 border-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>Başarılarım</button>
        </div>

        <div className="p-8 md:p-12">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideIn">
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Tam Adın</label>
                <input className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-200 outline-none font-bold" value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">E-posta Adresin</label>
                <input className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-200 outline-none font-bold" value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Telefon</label>
                <input className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-200 outline-none font-bold" value={editUser.phone} onChange={e => setEditUser({...editUser, phone: e.target.value})} />
              </div>
              <div className="flex items-center justify-end">
                <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">Güncelle</button>
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-10 animate-slideIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs font-black text-purple-400 uppercase tracking-widest">Tuttuğun Takım</label>
                  <input className="w-full bg-purple-50 p-4 rounded-2xl outline-none font-black text-purple-700 placeholder:text-purple-200" placeholder="Örn: Galatasaray, Beşiktaş..." value={editUser.team} onChange={e => setEditUser({...editUser, team: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-black text-purple-400 uppercase tracking-widest">İlgi Alanları (Virgülle Ayır)</label>
                  <input className="w-full bg-purple-50 p-4 rounded-2xl outline-none font-black text-purple-700" value={editUser.interests?.join(', ')} onChange={e => setEditUser({...editUser, interests: e.target.value.split(',').map(s => s.trim())})} />
                </div>
              </div>
              <div className="p-8 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-purple-100">
                <h4 className="font-black text-gray-700 uppercase text-xs mb-4">Sevdiğin Sporlar ve Müzikler</h4>
                <div className="flex flex-wrap gap-4">
                   {['Basketbol', 'Yüzme', 'Resim', 'Pop Müzik', 'Klasik Müzik', 'Lego'].map(item => (
                     <button 
                        key={item}
                        onClick={() => {
                          const current = editUser.sports || [];
                          const updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
                          setEditUser({...editUser, sports: updated});
                        }}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${editUser.sports?.includes(item) ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-400 border border-purple-100'}`}
                     >
                       {item}
                     </button>
                   ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl">Kaydet</button>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-12 animate-slideIn">
              <div>
                <h4 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tighter">Başarı Grafiğin</h4>
                <div className="h-64 flex items-end justify-between gap-4 px-4 bg-gray-50/50 rounded-[2.5rem] p-8 relative">
                   {last5Results.length > 0 ? last5Results.map((res, i) => {
                     const height = (res.score / res.totalQuestions) * 100;
                     return (
                       <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                          <div className="relative w-full flex justify-center items-end h-full">
                            <div 
                              className="w-12 bg-blue-500 rounded-t-xl transition-all duration-1000 group-hover:bg-blue-400 shadow-lg relative"
                              style={{ height: `${height}%` }}
                            >
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">%{Math.round(height)}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase text-center leading-tight truncate w-full">{res.topicTitle}</span>
                       </div>
                     );
                   }) : (
                     <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold italic">Henüz sınav verisi yok.</div>
                   )}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Rozet Vitrini</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {user.badges.map(badge => (
                    <div key={badge.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 flex flex-col items-center gap-4 group hover:border-emerald-200 transition-all shadow-sm">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg transform group-hover:rotate-12 transition-all ${badge.color}`}>
                        <i className={`fas ${badge.icon}`}></i>
                      </div>
                      <div className="text-center">
                        <p className="font-black text-gray-800 text-xs uppercase leading-tight">{badge.name}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">{badge.date}</p>
                      </div>
                    </div>
                  ))}
                  {user.badges.length === 0 && (
                     <div className="col-span-full py-10 bg-gray-50 rounded-[2rem] text-center text-gray-400 font-bold italic">Henüz rozet kazanmadın. İlk sınavını tamamla!</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;
