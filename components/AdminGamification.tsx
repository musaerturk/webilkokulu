
import React, { useState } from 'react';
import { Badge, RankDefinition, Quest } from '../types';
import Mascot from './Mascot';

interface AdminGamificationProps {
  badges: Badge[];
  onSaveBadges: (b: Badge[]) => void;
  ranks: RankDefinition[];
  onSaveRanks: (r: RankDefinition[]) => void;
  quests: Quest[];
  onSaveQuests: (q: Quest[]) => void;
  onClose: () => void;
}

const AdminGamification: React.FC<AdminGamificationProps> = ({ badges, onSaveBadges, ranks, onSaveRanks, quests, onSaveQuests, onClose }) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'ranks' | 'quests'>('badges');

  const handleImageUpload = (id: string, type: 'badge' | 'rank', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Dosya boyutu 2MB'den küçük olmalıdır.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'badge') {
          onSaveBadges(badges.map(b => b.id === id ? { ...b, imageUrl: reader.result as string } : b));
        } else {
          onSaveRanks(ranks.map(r => r.id === id ? { ...r, imageUrl: reader.result as string } : r));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20 px-4">
      <div className="bg-orange-600 p-8 md:p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl mb-10 border-b-8 border-orange-800 gap-6">
         <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">ÖDÜL STÜDYOSU</h2>
            <p className="text-orange-100 font-bold uppercase text-xs mt-3 tracking-widest">Başarıyı kutlamanın en eğlenceli yolu!</p>
         </div>
         <button onClick={onClose} className="bg-white/10 px-8 py-4 rounded-2xl font-black uppercase text-xs border border-white/20 hover:bg-white/20 transition-all">Paneli Kapat</button>
      </div>

      <div className="flex bg-white p-2 rounded-[2.5rem] shadow-lg mb-10 border overflow-x-auto no-scrollbar">
         <button onClick={() => setActiveTab('badges')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all min-w-[120px] ${activeTab === 'badges' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-400'}`}>ROZETLER</button>
         <button onClick={() => setActiveTab('ranks')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all min-w-[120px] ${activeTab === 'ranks' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>RÜTBELER</button>
         <button onClick={() => setActiveTab('quests')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all min-w-[120px] ${activeTab === 'quests' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400'}`}>GÖREVLER</button>
      </div>

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {badges.map(badge => (
             <div key={badge.id} className="bg-white p-8 rounded-[3.5rem] border-2 border-slate-100 flex flex-col items-center group relative overflow-hidden shadow-sm hover:border-orange-200 transition-all">
                <div className="w-32 h-32 bg-slate-50 rounded-3xl mb-6 relative overflow-hidden border-2 border-dashed border-orange-100 flex items-center justify-center">
                   {badge.imageUrl ? (
                     <img src={badge.imageUrl} className="w-full h-full object-contain p-2" />
                   ) : (
                     <i className={`fas ${badge.icon} text-5xl text-orange-200`}></i>
                   )}
                   <label className="absolute inset-0 bg-orange-600/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all text-white">
                      <i className="fas fa-camera text-2xl mb-1"></i>
                      <span className="text-[8px] font-black uppercase">GÖRSEL YÜKLE</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(badge.id, 'badge', e)} />
                   </label>
                </div>
                <input 
                  className="text-xl font-black text-center text-slate-800 bg-transparent outline-none w-full mb-2 border-b-2 border-transparent focus:border-orange-600" 
                  value={badge.name} 
                  onChange={e => onSaveBadges(badges.map(b => b.id === badge.id ? {...b, name: e.target.value} : b))} 
                  placeholder="Rozet Adı"
                />
                <textarea 
                  className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest bg-transparent outline-none w-full min-h-[40px] resize-none" 
                  value={badge.description} 
                  onChange={e => onSaveBadges(badges.map(b => b.id === badge.id ? {...b, description: e.target.value} : b))} 
                  placeholder="Kazanma Şartı..."
                />
                <button onClick={() => onSaveBadges(badges.filter(b => b.id !== badge.id))} className="absolute top-6 right-6 text-red-300 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
             </div>
           ))}
           <button 
             onClick={() => onSaveBadges([...badges, { id: `B-${Date.now()}`, name: 'Yeni Rozet', icon: 'fa-award', color: 'bg-orange-500', date: '-', description: 'Bir testte 100 puan al.' }])} 
             className="p-12 border-4 border-dashed border-slate-200 rounded-[3.5rem] text-slate-300 flex flex-col items-center justify-center hover:bg-slate-50 transition-all hover:border-orange-200 group"
           >
              <i className="fas fa-plus-circle text-4xl mb-4 group-hover:text-orange-400"></i>
              <span className="font-black uppercase text-xs tracking-widest group-hover:text-orange-600">YENİ ROZET TANIMLA</span>
           </button>
        </div>
      )}

      {activeTab === 'ranks' && (
        <div className="space-y-6">
           {ranks.map(rank => (
             <div key={rank.id} className="bg-white p-8 rounded-[3.5rem] border-2 border-indigo-50 flex flex-col md:flex-row items-center gap-10 shadow-sm relative group">
                <div className="w-28 h-28 bg-indigo-50 rounded-3xl relative overflow-hidden flex items-center justify-center group border-2 border-indigo-100">
                   {rank.imageUrl ? (
                     <img src={rank.imageUrl} className="w-full h-full object-contain p-2" />
                   ) : (
                     <i className="fas fa-shield-alt text-5xl text-indigo-200"></i>
                   )}
                   <label className="absolute inset-0 bg-indigo-600/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all text-white">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(rank.id, 'rank', e)} />
                      <i className="fas fa-upload text-xl mb-1"></i>
                      <span className="text-[8px] font-black uppercase">RÜTBE LOGOSU</span>
                   </label>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Rütbe Ünvanı</label>
                      <input className="text-2xl font-black text-indigo-900 bg-transparent outline-none border-b-2 border-transparent focus:border-indigo-600 w-full" value={rank.title} onChange={e => onSaveRanks(ranks.map(r => r.id === rank.id ? {...r, title: e.target.value} : r))} />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Min. Puan Sınırı</label>
                      <div className="flex items-center gap-3">
                         <input type="number" className="text-2xl font-black text-indigo-900 bg-transparent outline-none border-b-2 border-transparent focus:border-indigo-600 w-32" value={rank.minPoints} onChange={e => onSaveRanks(ranks.map(r => r.id === rank.id ? {...r, minPoints: parseInt(e.target.value) || 0} : r))} />
                         <span className="text-slate-300 font-black">PUAN</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => onSaveRanks(ranks.filter(r => r.id !== rank.id))} className="text-red-300 hover:text-red-500 p-4 transition-colors"><i className="fas fa-trash"></i></button>
             </div>
           ))}
           <button onClick={() => onSaveRanks([...ranks, { id: `R-${Date.now()}`, title: 'Yeni Rütbe', minPoints: 100 }])} className="w-full p-10 border-4 border-dashed border-indigo-50 rounded-[3.5rem] text-indigo-300 flex items-center justify-center gap-4 hover:bg-indigo-50 transition-all hover:text-indigo-600 group">
              <i className="fas fa-plus text-2xl"></i>
              <span className="font-black uppercase text-xs tracking-widest">YENİ RÜTBE KADEMESİ EKLE</span>
           </button>
        </div>
      )}

      {activeTab === 'quests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {quests.map(quest => (
             <div key={quest.id} className="bg-white p-10 rounded-[4rem] border-2 border-emerald-50 relative shadow-sm hover:border-emerald-200 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-emerald-100">
                      <i className="fas fa-rocket"></i>
                   </div>
                   <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-slate-400">YAYINDA</span>
                      <input type="checkbox" checked={quest.isActive} onChange={e => onSaveQuests(quests.map(q => q.id === quest.id ? {...q, isActive: e.target.checked} : q))} className="w-6 h-6 accent-emerald-600 cursor-pointer" />
                   </div>
                </div>
                <input className="text-2xl font-black text-slate-800 bg-transparent outline-none w-full mb-3 border-b-2 border-transparent focus:border-emerald-600" value={quest.title} onChange={e => onSaveQuests(quests.map(q => q.id === quest.id ? {...q, title: e.target.value} : q))} placeholder="Görev Başlığı" />
                <textarea className="w-full bg-slate-50/50 p-5 rounded-3xl font-bold text-slate-500 outline-none min-h-[100px] mb-8 border-2 border-transparent focus:border-emerald-100" value={quest.description} onChange={e => onSaveQuests(quests.map(q => q.id === quest.id ? {...q, description: e.target.value} : q))} placeholder="Görev açıklamasını buraya yaz..." />
                <div className="flex items-center justify-between border-t pt-6">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">PUAN ÖDÜLÜ</span>
                         <input type="number" className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl font-black w-24 outline-none border border-emerald-100" value={quest.points} onChange={e => onSaveQuests(quests.map(q => q.id === quest.id ? {...q, points: parseInt(e.target.value) || 0} : q))} />
                      </div>
                   </div>
                   <button onClick={() => onSaveQuests(quests.filter(q => q.id !== quest.id))} className="text-red-300 hover:text-red-500 p-4 transition-colors"><i className="fas fa-trash"></i></button>
                </div>
             </div>
           ))}
           <button onClick={() => onSaveQuests([...quests, { id: `Q-${Date.now()}`, title: 'Haftalık Görev', description: 'Bu hafta en az 3 test bitir!', points: 50, isActive: true }])} className="p-16 border-4 border-dashed border-emerald-50 rounded-[4rem] text-emerald-300 flex flex-col items-center justify-center hover:bg-emerald-50 transition-all hover:border-emerald-200 group">
              <i className="fas fa-flag-checkered text-4xl mb-4 group-hover:text-emerald-500"></i>
              <span className="font-black uppercase text-xs tracking-widest group-hover:text-emerald-700">YENİ MACERA/GÖREV EKLE</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default AdminGamification;
