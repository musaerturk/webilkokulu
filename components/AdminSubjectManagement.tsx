
import React, { useState } from 'react';
import { Subject, SubjectStyle, Grade } from '../types';
import { INITIAL_SUBJECT_CONFIG } from '../constants';

interface AdminSubjectManagementProps {
  subjectConfig: Record<Subject, SubjectStyle>;
  gradeSubjects: Record<Grade, Subject[]>;
  onSave: (config: Record<Subject, SubjectStyle>, mapping: Record<Grade, Subject[]>) => void;
  onClose: () => void;
}

const AdminSubjectManagement: React.FC<AdminSubjectManagementProps> = ({ subjectConfig, gradeSubjects, onSave, onClose }) => {
  const [config, setConfig] = useState(subjectConfig);
  const [mapping, setMapping] = useState(gradeSubjects);
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');

  const grades: Grade[] = [1, 2, 3, 4, 'SC'];

  const handleUpdateStyle = (subject: string, updates: Partial<SubjectStyle>) => {
    setConfig({
      ...config,
      [subject]: { ...config[subject], ...updates }
    });
  };

  const toggleSubjectForGrade = (grade: Grade, subject: string) => {
    const currentList = mapping[grade] || [];
    const newList = currentList.includes(subject)
      ? currentList.filter(s => s !== subject)
      : [...currentList, subject];
    
    setMapping({ ...mapping, [grade]: newList });
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    if (config[newSubjectName]) {
      alert("Bu ders zaten mevcut!");
      return;
    }

    const newStyle: SubjectStyle = {
      color: '#4f46e5',
      icon: 'fa-star',
      gradient: 'from-indigo-500 to-indigo-700',
      coverImage: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=800&auto=format&fit=crop'
    };

    setConfig({ ...config, [newSubjectName]: newStyle });
    setNewSubjectName('');
    setEditingSubject(newSubjectName);
  };

  const handleDeleteSubject = (subject: string) => {
    if (!confirm(`"${subject}" dersini tamamen silmek istediğine emin misin? Bu işlem tüm sınıflardan dersi kaldırır.`)) return;

    const newConfig = { ...config };
    delete newConfig[subject];

    const newMapping = { ...mapping };
    Object.keys(newMapping).forEach(key => {
      newMapping[key as unknown as Grade] = newMapping[key as unknown as Grade].filter(s => s !== subject);
    });

    setConfig(newConfig);
    setMapping(newMapping);
    if (editingSubject === subject) setEditingSubject(null);
  };

  const handleSaveAll = () => {
    onSave(config, mapping);
    alert("Tüm ders yapılandırmaları başarıyla kaydedildi! 🚀");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fadeIn px-4">
      <div className="bg-indigo-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl mb-12 border-b-8 border-indigo-700 gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Ders & Branş Editörü</h2>
          <p className="text-indigo-300 font-bold uppercase text-xs mt-3 tracking-widest">Derslerin renklerini, görsellerini ve dağılımını yönet.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSaveAll} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl">Değişiklikleri Kaydet</button>
          <button onClick={onClose} className="bg-white/10 px-8 py-4 rounded-2xl font-black uppercase text-xs border border-white/20">Paneli Kapat</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sol Panel: Ders Listesi ve Ekleme */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Ders Listesi</h3>
            <div className="space-y-3 mb-8">
              {Object.keys(config).map(subject => (
                <div key={subject} className={`group flex items-center justify-between p-4 rounded-2xl transition-all ${editingSubject === subject ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <button onClick={() => setEditingSubject(subject)} className="flex items-center gap-4 flex-1 text-left">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: config[subject].color }}>
                      <i className={`fas ${config[subject].icon}`}></i>
                    </div>
                    <span className="font-black text-slate-700 uppercase text-xs">{subject}</span>
                  </button>
                  <button onClick={() => handleDeleteSubject(subject)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                className="flex-1 bg-slate-50 p-4 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-indigo-600" 
                placeholder="Yeni Ders Adı..." 
                value={newSubjectName}
                onChange={e => setNewSubjectName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
              />
              <button onClick={handleAddSubject} className="bg-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Orta/Sağ Panel: Düzenleme Alanı */}
        <div className="lg:col-span-2 space-y-8">
          {editingSubject ? (
            <div className="bg-white p-10 rounded-[4rem] shadow-xl border animate-slideIn">
              <div className="flex items-center gap-6 mb-10 pb-6 border-b">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl text-white shadow-lg" style={{ backgroundColor: config[editingSubject].color }}>
                  <i className={`fas ${config[editingSubject].icon}`}></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase text-slate-800">{editingSubject}</h3>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ders Ayarlarını Düzenle</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">İkon (FontAwesome)</label>
                  <input 
                    className="w-full bg-slate-50 p-4 rounded-xl font-bold border-2 border-transparent focus:border-indigo-600" 
                    value={config[editingSubject].icon}
                    onChange={e => handleUpdateStyle(editingSubject, { icon: e.target.value })}
                    placeholder="fa-book"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Ana Renk (HEX)</label>
                  <div className="flex gap-3">
                    <input type="color" className="w-14 h-14 rounded-xl cursor-pointer" value={config[editingSubject].color} onChange={e => handleUpdateStyle(editingSubject, { color: e.target.value })} />
                    <input 
                      className="flex-1 bg-slate-50 p-4 rounded-xl font-bold border-2 border-transparent focus:border-indigo-600" 
                      value={config[editingSubject].color}
                      onChange={e => handleUpdateStyle(editingSubject, { color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Kapak Görseli URL (6-12 Yaş Dostu)</label>
                  <input 
                    className="w-full bg-slate-50 p-4 rounded-xl font-bold border-2 border-transparent focus:border-indigo-600" 
                    value={config[editingSubject].coverImage}
                    onChange={e => handleUpdateStyle(editingSubject, { coverImage: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-dashed">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-6 flex items-center gap-2">
                  <i className="fas fa-layer-group"></i> SINIF ATAMALARI
                </h4>
                <div className="flex flex-wrap gap-4">
                  {grades.map(g => (
                    <button 
                      key={g} 
                      onClick={() => toggleSubjectForGrade(g, editingSubject)}
                      className={`px-8 py-3 rounded-2xl font-black text-xs transition-all ${mapping[g]?.includes(editingSubject) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                      {g}. SINIF
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[4rem] border-4 border-dashed h-full flex flex-col items-center justify-center p-20 text-center">
              <i className="fas fa-mouse-pointer text-5xl text-slate-200 mb-6"></i>
              <h4 className="text-xl font-black text-slate-400 uppercase">Düzenlemek İçin Bir Ders Seç</h4>
              <p className="text-slate-300 font-bold mt-2">Derslerin görsellerini ve sınıflara olan atamasını buradan yönetebilirsin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubjectManagement;
