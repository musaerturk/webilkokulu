
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/firebaseService';

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSave }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState<User['level']>('1. Sınıf');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setLevel(user.level);
      setPassword(''); // Don't pre-fill password for security
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert("Lütfen kullanıcı adını girin.");
      return;
    }
    if (!user && !password) {
        alert("Yeni kullanıcı için lütfen bir şifre belirleyin.");
        return;
    }

    setIsSaving(true);
    const payload: Partial<User> = { username, level };
    if (password) {
        payload.password = password;
    }

    try {
      if (user) {
        await api.updateUser(user.id, payload);
      } else {
        await api.addUser(payload as Omit<User, 'id' | 'createdAt'>);
      }
      onSave();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Kullanıcı kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-semibold border-b pb-3 text-gray-900">{user ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" required />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 placeholder:text-gray-400" placeholder={user ? 'Değiştirmek için yeni şifre girin' : 'Yeni şifre belirleyin'} />
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700">Sınıf Seviyesi</label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value as User['level'])} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>1. Sınıf</option>
                  <option>2. Sınıf</option>
                  <option>3. Sınıf</option>
                  <option>4. Sınıf</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
            <button type="button" onClick={onClose} disabled={isSaving} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">İptal</button>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
