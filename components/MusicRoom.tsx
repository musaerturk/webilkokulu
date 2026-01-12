
import React, { useState, useRef, useEffect } from 'react';
import { Song, Grade } from '../types';
import Mascot from './Mascot';

interface MusicRoomProps {
  songs: Song[];
  onBack: () => void;
}

const MusicRoom: React.FC<MusicRoomProps> = ({ songs, onBack }) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [filter, setFilter] = useState<string>('Hepsi');
  const [favorites, setFavorites] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedFavs = localStorage.getItem('webilkokulu_fav_songs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem('webilkokulu_fav_songs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const topics = Array.from(new Set(songs.flatMap(s => s.topics || [])));
  const filteredSongs = songs.filter(s => 
    filter === 'Hepsi' ? true : 
    filter === 'Favorilerim' ? favorites.includes(s.id) : 
    s.topics.includes(filter)
  );

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const vidId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${vidId}?autoplay=1`;
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-12 rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl mb-12 border-b-8 border-pink-700 relative overflow-hidden gap-6">
         <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-white/20 animate-wiggle">
               <i className="fas fa-music"></i>
            </div>
            <div>
               <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">NOTALI BAHÇE</h2>
               <p className="text-pink-100 font-bold uppercase text-[10px] mt-2 tracking-widest">Şarkıların Sihirli Dünyasını Keşfet!</p>
            </div>
         </div>
         <button onClick={onBack} className="relative z-10 bg-white/10 px-8 py-4 rounded-2xl font-black uppercase text-xs border border-white/20 hover:bg-white/20 transition-all">Geri Dön</button>
         <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4"><Mascot type="cat" size="xl" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-pink-50">
              <h3 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-6 px-2">KONULARA GÖRE</h3>
              <div className="flex flex-col gap-2">
                 {['Hepsi', 'Favorilerim', ...topics].map(t => (
                   <button 
                    key={t} 
                    onClick={() => setFilter(t)}
                    className={`text-left px-6 py-4 rounded-2xl font-black text-xs uppercase transition-all flex items-center justify-between ${filter === t ? 'bg-pink-600 text-white shadow-lg' : 'bg-pink-50 text-pink-400 hover:bg-pink-100'}`}
                   >
                      <span>{t}</span>
                      {t === 'Favorilerim' && <i className="fas fa-heart text-white"></i>}
                   </button>
                 ))}
              </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl text-pink-400"><i className="fas fa-headphones-alt"></i></div>
              <div><p className="text-[10px] font-black uppercase text-slate-500">Çalma Listem</p><p className="font-bold text-sm">{favorites.length} Şarkı</p></div>
           </div>
        </div>

        {/* Main Song Grid */}
        <div className="lg:col-span-3">
           {selectedSong ? (
             <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border-8 border-white animate-slideIn">
                <div className="aspect-video bg-slate-950 relative group">
                   {selectedSong.youtubeUrl ? (
                     <iframe 
                      className="w-full h-full" 
                      src={getYoutubeEmbedUrl(selectedSong.youtubeUrl)} 
                      title="Song"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                     ></iframe>
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-white gap-8 p-12">
                        <div className="w-64 h-64 rounded-full border-8 border-pink-500/30 p-2 overflow-hidden animate-slowPulse">
                           <img src={selectedSong.coverImage} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="text-center">
                           <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">{selectedSong.title}</h3>
                           <p className="text-pink-400 font-bold uppercase tracking-widest text-sm">{selectedSong.artist}</p>
                        </div>
                        {selectedSong.audioUrl && (
                          <audio ref={audioRef} controls autoPlay src={selectedSong.audioUrl} className="w-full max-w-md filter invert hue-rotate-180" />
                        )}
                     </div>
                   )}
                   <button onClick={() => setSelectedSong(null)} className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur rounded-full text-white flex items-center justify-center hover:bg-white/40 transition-all"><i className="fas fa-chevron-left"></i></button>
                </div>
                <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-pink-50/30">
                   <div className="flex gap-2">
                      {selectedSong.topics.map(t => <span key={t} className="bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase text-pink-600 shadow-sm">{t}</span>)}
                   </div>
                   <button onClick={(e) => toggleFavorite(selectedSong.id, e)} className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-xl transition-all ${favorites.includes(selectedSong.id) ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-100'}`}>
                      <i className={`fas fa-heart ${favorites.includes(selectedSong.id) ? 'animate-wiggle' : ''}`}></i>
                      {favorites.includes(selectedSong.id) ? 'LİSTEMDE' : 'LİSTEYE EKLE'}
                   </button>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredSongs.map(song => (
                  <div 
                    key={song.id} 
                    onClick={() => setSelectedSong(song)}
                    className="group bg-white rounded-[3.5rem] p-6 shadow-xl hover:-translate-y-4 transition-all duration-300 border-4 border-transparent hover:border-pink-200 cursor-pointer flex flex-col"
                  >
                     <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-md">
                        <img src={song.coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-pink-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-pink-600 text-2xl shadow-2xl animate-bounceIn"><i className="fas fa-play ml-1"></i></div>
                        </div>
                        <button onClick={(e) => toggleFavorite(song.id, e)} className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${favorites.includes(song.id) ? 'bg-pink-600 text-white' : 'bg-white/90 text-slate-300'}`}>
                           <i className="fas fa-heart"></i>
                        </button>
                     </div>
                     <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter truncate leading-none mb-2">{song.title}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{song.artist}</p>
                     
                     <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex -space-x-2">
                           {song.topics.slice(0, 2).map(t => <div key={t} className="bg-pink-50 border-2 border-white px-3 py-1 rounded-lg text-[8px] font-black uppercase text-pink-600 shadow-sm">{t}</div>)}
                        </div>
                        <div className="text-[10px] font-black text-slate-300 uppercase">{song.grade}. Sınıf</div>
                     </div>
                  </div>
                ))}
                {filteredSongs.length === 0 && (
                  <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                     <i className="fas fa-music text-6xl text-slate-200 mb-4"></i>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Bu kategoride henüz şarkı yok.</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MusicRoom;
