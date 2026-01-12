
import React, { useState } from 'react';
import { Song, Grade, SiteSettings } from '../types';
import { uploadFile } from '../services/storageService';

interface AdminMusicManagementProps {
  songs: Song[];
  onSave: (s: Song[]) => void;
  onClose: () => void;
}

const AdminMusicManagement: React.FC<AdminMusicManagementProps> = ({ songs, onSave, onClose }) => {
  const [editingSong, setEditingSong] = useState<Partial<Song> | null>(null);
  const [isUploading, setIsUploading] = useState<'cover' | 'audio' | null>(null);

  const getSiteSettings = (): SiteSettings => {
    const saved = localStorage.getItem('webilkokulu_settings');
    return saved ? JSON.parse(saved) : ({} as SiteSettings);
  };

  const handleAdd = () => {
    setEditingSong({
      id: `S-${Date.now()}`,
      title: '',
      artist: '',
      coverImage: '',
      topics: [],
      grade: 1
    });
  };

  const handleSave = () => {
    if (!editingSong?.title || !editingSong?.artist) {
      alert("Lütfen en azından başlık ve sanatçı bilgisini girin. 🎵");
      return;
    }
    const isNew = !songs.find(s => s.id === editingSong.id);
    if (isNew) {
      onSave([...songs, editingSong as Song]);
    } else {
      onSave(songs.map(s => s.id === editingSong.id ? editingSong as Song : s));
    }
    setEditingSong(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading('cover');
      try {
        const url = await uploadFile(file, 'music/covers', getSiteSettings());
        setEditingSong({ ...editingSong!, coverImage: url });
      } finally {
        setIsUploading(null);
      }
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading('audio');
      try {
        const url = await uploadFile(file, 'music/audio', getSiteSettings());
        setEditingSong({ ...editingSong!, audioUrl: url, youtubeUrl: undefined });
      } finally {
        setIsUploading(null);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-20">
      <div className="bg-pink-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center mb-10 border-b-8 border-pink-700 gap-6 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl"><i className="fas fa-compact-disc animate-spin-slow"></i></div>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Müzik Odası Editörü</h2>
         </div>
         <div className="flex gap-4">
           {!editingSong && <button onClick={handleAdd} className="bg-white text-pink-900 px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-pink-50 transition-all">+ YENİ ŞARKI EKLE</button>}
           <button onClick={onClose} className="bg-white/10 px-8 py-4 rounded-2xl font-black uppercase text-xs border border-white/20 hover:bg-white/20 transition-all">Paneli Kapat</button>
         </div>
      </div>

      {editingSong ? (
        <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-4 border-pink-50 animate-slideIn space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Şarkı Kapağı</label>
                 <div className="aspect-square bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group shadow-inner">
                    {isUploading === 'cover' ? <div className="animate-spin text-pink-600 text-3xl"><i className="fas fa-spinner"></i></div> : (editingSong.coverImage ? <img src={editingSong.coverImage} className="w-full h-full object-cover" /> : <i className="fas fa-image text-4xl text-slate-200"></i>)}
                    <label className="absolute inset-0 bg-pink-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all text-white text-center p-4">
                       <i className="fas fa-camera text-2xl mb-2"></i>
                       <span className="text-[10px] font-black uppercase">RESİM YÜKLE</span>
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                 </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Şarkı Adı</label>
                       <input className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-black text-slate-700 border-2 border-transparent focus:border-pink-200 shadow-sm" value={editingSong.title} onChange={e => setEditingSong({...editingSong!, title: e.target.value})} placeholder="Örn: Yaşasın Okulumuz" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Sanatçı / Seslendiren</label>
                       <input className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-black text-slate-700 border-2 border-transparent focus:border-pink-200 shadow-sm" value={editingSong.artist} onChange={e => setEditingSong({...editingSong!, artist: e.target.value})} placeholder="Sanatçı..." />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Hedef Sınıf Seviyesi</label>
                       <select className="w-full bg-slate-50 p-5 rounded-2xl font-black uppercase text-xs outline-none border-2 border-transparent focus:border-pink-200 shadow-sm" value={editingSong.grade} onChange={e => setEditingSong({...editingSong!, grade: parseInt(e.target.value) as Grade})}>
                          {[1,2,3,4].map(g => <option key={g} value={g}>{g}. SINIF</option>)}
                          <option value="SC">SES DÜNYASI</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Şarkı Konuları (Virgülle Ayır)</label>
                       <input className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-pink-200 shadow-sm" value={editingSong.topics?.join(', ')} onChange={e => setEditingSong({...editingSong!, topics: e.target.value.split(',').map(s => s.trim())})} placeholder="Okul, Hayvanlar, Ritim..." />
                    </div>
                 </div>

                 <div className="bg-pink-50 p-8 rounded-[2.5rem] border-2 border-pink-100 space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-pink-600 tracking-widest text-center">ŞARKI KAYNAĞI</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Buluttan Yükle (MP3)</label>
                          <div className="relative">
                             <button className={`w-full py-4 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${editingSong.audioUrl ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                <i className={`fas ${isUploading === 'audio' ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
                                {editingSong.audioUrl ? 'DOSYA YÜKLENDİ ✅' : 'DOSYA SEÇ'}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="audio/*" onChange={handleAudioUpload} />
                             </button>
                             {editingSong.audioUrl && <p className="text-[8px] font-bold text-center mt-2 text-emerald-600 truncate">{editingSong.audioUrl}</p>}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Veya YouTube Linki</label>
                          <input className="w-full bg-white p-4 rounded-xl outline-none font-bold text-xs border-2 border-transparent focus:border-pink-200 shadow-inner" value={editingSong.youtubeUrl || ''} onChange={e => setEditingSong({...editingSong!, youtubeUrl: e.target.value, audioUrl: undefined})} placeholder="https://youtube.com/..." />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4 pt-10 border-t">
              <button onClick={() => setEditingSong(null)} className="flex-1 py-5 font-black uppercase text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">VAZGEÇ</button>
              <button onClick={handleSave} disabled={!!isUploading} className="flex-[2] py-5 bg-pink-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-pink-700 transition-all active:scale-95 disabled:opacity-50">ŞARKIYI KAYDET 🎹</button>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {songs.map(song => (
             <div key={song.id} className="bg-white p-6 rounded-[3.5rem] shadow-xl border-4 border-transparent hover:border-pink-200 group transition-all flex flex-col relative">
                <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden mb-6 relative">
                   <img src={song.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-black text-pink-600 shadow-sm">{song.grade}. SINIF</div>
                   <div className="absolute bottom-4 left-4 bg-slate-900/80 px-3 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                      {song.youtubeUrl ? <><i className="fab fa-youtube text-red-500 mr-1"></i> VIDEO</> : <><i className="fas fa-music text-pink-400 mr-1"></i> SES</>}
                   </div>
                </div>
                <h4 className="font-black text-slate-800 uppercase text-lg leading-tight mb-2 truncate">{song.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{song.artist}</p>
                <div className="mt-auto flex gap-2">
                   <button onClick={() => setEditingSong(song)} className="flex-1 bg-pink-50 text-pink-600 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-pink-600 hover:text-white transition-all">Düzenle</button>
                   <button onClick={() => { if(confirm("Şarkıyı silmek istediğine emin misin?")) onSave(songs.filter(s => s.id !== song.id)); }} className="w-12 bg-red-50 text-red-500 py-3 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash-alt"></i></button>
                </div>
             </div>
           ))}
           <button onClick={handleAdd} className="bg-white p-12 border-4 border-dashed border-pink-100 rounded-[3.5rem] text-pink-200 flex flex-col items-center justify-center hover:bg-pink-50 hover:border-pink-300 transition-all group min-h-[300px]">
              <i className="fas fa-plus-circle text-6xl mb-4 group-hover:scale-110 transition-transform"></i>
              <span className="font-black uppercase tracking-widest text-sm text-center">YENİ ŞARKI EKLE</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default AdminMusicManagement;
