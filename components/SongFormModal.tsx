
import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import * as api from '../services/firebaseService';

interface SongFormModalProps {
  song: Song | null;
  onClose: () => void;
  onSave: () => void;
}

const SongFormModal: React.FC<SongFormModalProps> = ({ song, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [url, setUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setSubject(song.subject);
      setUrl(song.url);
    }
  }, [song]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      alert("Lütfen başlık ve URL alanlarını doldurun.");
      return;
    }
    setIsSaving(true);
    try {
      if (song) {
        await api.updateSong(song.id, { title, subject, url });
      } else {
        await api.addSong({ title, subject, url });
      }
      onSave();
    } catch (error) {
      console.error("Error saving song:", error);
      alert("Şarkı kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center pb-3 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{song ? 'Şarkıyı Düzenle' : 'Yeni Şarkı Ekle'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Şarkı Başlığı</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Konu</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">Şarkı URL'i</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                required
              />
            </div>
            <div className="pt-4 border-t flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SongFormModal;
