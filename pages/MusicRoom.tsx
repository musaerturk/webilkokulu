
import React, { useState, useEffect, useCallback } from 'react';
import { Song } from '../types';
import * as api from '../services/firebaseService';
import SongFormModal from '../components/SongFormModal';
import { PlusIcon, EditIcon, TrashIcon } from '../components/icons';

const MusicRoom: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSongs = await api.getSongs();
      setSongs(fetchedSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      alert("Şarkılar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleAddSong = () => {
    setEditingSong(null);
    setIsModalOpen(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setIsModalOpen(true);
  };

  const handleDeleteSong = async (songId: string) => {
    if (window.confirm("Bu şarkıyı silmek istediğinizden emin misiniz?")) {
      try {
        await api.deleteSong(songId);
        setSongs(prevSongs => prevSongs.filter(s => s.id !== songId));
      } catch (error) {
        console.error("Error deleting song:", error);
        alert("Şarkı silinirken bir hata oluştu.");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchSongs();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Eklenen Şarkılar</h2>
        <button
          onClick={handleAddSong}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <PlusIcon /> <span className="ml-2">Yeni Şarkı Ekle</span>
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Şarkılar yükleniyor...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Henüz şarkı eklenmemiş.</td>
                </tr>
              ) : (
                songs.map(song => (
                  <tr key={song.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{song.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={song.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 truncate max-w-xs block">{song.url}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditSong(song)} className="text-blue-600 hover:text-blue-900 mr-4"><EditIcon/></button>
                      <button onClick={() => handleDeleteSong(song.id)} className="text-red-600 hover:text-red-900"><TrashIcon/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <SongFormModal
          song={editingSong}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MusicRoom;
