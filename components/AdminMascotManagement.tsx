
import React, { useState } from 'react';
import { MascotSettings, MascotType, MascotRole, SiteSettings } from '../types';
import Mascot from './Mascot';
import { uploadFile } from '../services/storageService';

interface AdminMascotManagementProps {
  mascots: MascotSettings[];
  onSave: (m: MascotSettings[]) => void;
  onClose: () => void;
}

const AdminMascotManagement: React.FC<AdminMascotManagementProps> = ({ mascots, onSave, onClose }) => {
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const mascotTypes: MascotType[] = ['turtle', 'rabbit', 'fox', 'cat', 'owl'];
  
  const getSiteSettings = (): SiteSettings => {
    const saved = localStorage.getItem('webilkokulu_settings');
    return saved ? JSON.parse(saved) : {};
  };

  const roleLabels: Record<MascotRole, string> = {
    presentation: 'Sunum Sorumlusu',
    game: 'Oyun Laboratuvarı',
    assessment: 'Soru & Ölçme',
    coach: 'Öğrenci Koçu',
    wisdom: 'Analiz & Bilgelik'
  };

  const roleColors: Record<MascotRole, string> = {
    presentation: 'border-blue-500 bg-blue-50',
    game: 'border-purple-500 bg-purple-50',
    assessment: 'border-orange-500 bg-orange-50',
    coach: 'border-red-500 bg-red-50',
    wisdom: 'border-indigo-500 bg-indigo-50'
  };

  const handleUpdate = (role: MascotRole, updates: Partial<MascotSettings>) => {
    onSave(mascots.map(m => m.role === role ? { ...m, ...updates } : m));
  };

  const handleImageUpload = async (role: MascotRole, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(role);
      try {
        const url = await uploadFile(file, `mascots/${role}`, getSiteSettings());
        handleUpdate(role, { customImageUrl: url });
      } finally {
        setIsUploading(null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
      <div className="bg-purple-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl mb-12 border-b-8 border-purple-700 gap-6">
         <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">MASKOT YÖNETİMİ</h2>
            <p className="text-purple-200 font-bold uppercase text-xs mt-3 tracking-widest">Sistemin karakterlerini ve görevlerini özelleştir!</p>
         </div>
         <button onClick={onClose} className="bg-white/10 px-8 py-4 rounded-2xl font-black uppercase text-xs border border-white/20 hover:bg-white/20 transition-all">Paneli Kapat</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mascots.map((m) => (
          <div key={m.role} className={`p-8 rounded-[3.5rem] border-4 shadow-xl flex flex-col items-center ${roleColors[m.role]}`}>
            <span className="bg-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6 shadow-sm border border-slate-100">
               {roleLabels[m.role]}
            </span>
            
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 border-8 border-white relative group overflow-hidden">
               {isUploading === m.role ? <div className="animate-spin text-purple-600 text-3xl"><i className="fas fa-spinner"></i></div> : <Mascot type={m.type} size="lg" imageUrl={m.customImageUrl} />}
               <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer p-4 text-center">
                  <i className="fas fa-camera text-2xl mb-2"></i>
                  <span className="text-[10px] font-black uppercase leading-tight">ÖZEL GÖRSEL / GIF YÜKLE</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(m.role, e)} />
               </label>
               {m.customImageUrl && (
                 <button 
                  onClick={() => handleUpdate(m.role, { customImageUrl: undefined })}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full text-xs shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                 >
                   <i className="fas fa-times"></i>
                 </button>
               )}
            </div>

            <div className="w-full space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Maskot İsmi</label>
                  <input 
                    className="w-full bg-white p-5 rounded-2xl border-2 border-slate-100 focus:border-purple-500 font-black text-center text-xl outline-none" 
                    value={m.name}
                    onChange={(e) => handleUpdate(m.role, { name: e.target.value })}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 text-center block">Veya Hazır Karakter Seç</label>
                  <div className="flex justify-center gap-3">
                     {mascotTypes.map((type) => (
                       <button 
                         key={type}
                         onClick={() => handleUpdate(m.role, { type, customImageUrl: undefined })}
                         className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${m.type === type && !m.customImageUrl ? 'bg-purple-600 text-white scale-110 shadow-lg' : 'bg-white text-slate-300 hover:bg-slate-50 border border-slate-100'}`}
                       >
                         <div className="scale-50">
                            <Mascot type={type} size="sm" />
                         </div>
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMascotManagement;
