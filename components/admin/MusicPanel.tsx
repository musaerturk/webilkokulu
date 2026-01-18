
import React, { useState, useEffect } from 'react';
import { Music } from '../../types';
import { fetchData, saveData, removeData } from '../../services/firebaseService';

const MusicPanel: React.FC = () => {
  const [musics, setMusics] = useState<Music[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newMusic, setNewMusic] = useState<Partial<Music>>({ title: '', artist: '', subject: '' });

  useEffect(() => {
    loadMusics();
  }, []);

  const loadMusics = async () => {
    setIsLoading(true);
    const data = await fetchData('musics') as Music[];
    setMusics(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!newMusic.title || !newMusic.artist) return;
    await saveData('musics', { ...newMusic, url: '#' });
    setNewMusic({ title: '', artist: '', subject: '' });
    setIsAdding(false);
    loadMusics();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu şarkıyı silmek istediğinize emin misiniz?")) {
      await removeData('musics', id);
      loadMusics();
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Müzik Yönetimi</h1>
          <p className="text-slate-500">Eğitim müzikleri ve ses dosyalarını düzenleyin.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-md"
        >
          + Yeni Şarkı Ekle
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
          <h3 className="text-lg font-bold">Yeni Ses Kaydı</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input 
              type="text" 
              value={newMusic.title}
              onChange={e => setNewMusic({...newMusic, title: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" 
              placeholder="Şarkı Adı" 
            />
             <input 
              type="text" 
              value={newMusic.artist}
              onChange={e => setNewMusic({...newMusic, artist: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" 
              placeholder="Sanatçı / Eğitmen" 
            />
             <input 
              type="text" 
              value={newMusic.subject}
              onChange={e => setNewMusic({...newMusic, subject: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" 
              placeholder="Konu / Tür" 
            />
             <div className="flex items-center gap-2">
                <input type="file" className="hidden" id="audio-upload" />
                <label htmlFor="audio-upload" className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl px-4 py-3 text-center cursor-pointer font-bold text-xs">
                  Audio Dosyası Seç (.mp3)
                </label>
             </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-500 font-bold text-sm">Vazgeç</button>
            <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm">Firebase'e Kaydet</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400">Yükleniyor...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Parça Adı</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Konu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Eylem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {musics.length === 0 ? (
                <tr><td colSpan={3} className="p-10 text-center text-slate-300 italic">Henüz müzik eklenmemiş.</td></tr>
              ) : musics.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">{m.title}</p>
                    <p className="text-[10px] text-slate-400">{m.artist}</p>
                  </td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-bold text-indigo-600 uppercase">{m.subject || 'Genel'}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600 font-bold text-xs">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MusicPanel;
