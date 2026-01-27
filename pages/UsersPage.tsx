
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as api from '../services/firebaseService';
import UserFormModal from '../components/UserFormModal';
import { PlusIcon, EditIcon, TrashIcon } from '../components/icons';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Kullanıcılar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await api.deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Kullanıcı silinirken bir hata oluştu.");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchUsers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Kayıtlı Kullanıcılar</h2>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <PlusIcon /> <span className="ml-2">Yeni Kullanıcı Ekle</span>
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Kullanıcılar yükleniyor...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı Adı</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sınıf</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Henüz kullanıcı eklenmemiş.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900 mr-4"><EditIcon/></button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UsersPage;
