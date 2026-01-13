
import React, { useState } from 'react';
import { UserProfile, Grade, Subject } from '../types';

interface AdminUserManagementProps {
  users: UserProfile[];
  onAddUser: (user: UserProfile) => void;
  onDeleteUser: (id: string) => void;
  onUpdateUser?: (updatedUsers: UserProfile[]) => void;
  onClose: () => void;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, onAddUser, onDeleteUser, onUpdateUser, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({ grade: 1, role: 'student', status: 'active' });

  const handleStatusToggle = (id: string) => {
    if (!onUpdateUser) return;
    onUpdateUser(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  const handleSubmit = () => {
    if (!newUser.name || !newUser.username || !newUser.password) {
      alert("Lütfen İsim, Kullanıcı Adı ve Şifre alanlarını doldurun.");
      return;
    }
    onAddUser({
      ...newUser,
      id: `USR-${Date.now()}`,
      points: 0,
      badges: [],
      joinDate: new Date().toLocaleDateString('tr-TR'),
      role: newUser.role as any,
      status: 'active'
    } as UserProfile);
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fadeIn">
      <div className="bg-emerald-900 p-12 rounded-[4rem] text-white flex justify-between items-center shadow-2xl mb-12 border-b-8 border-emerald-700">
         <div>
            <h2 className="text-4xl font-black uppercase leading-none">Topluluk Merkezi</h2>
            <p className="text-emerald-400 font-bold uppercase text-xs mt-3 tracking-widest">Kullanıcı Atama ve Güvenlik</p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => setShowModal(true)} className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:scale-105 transition-all">+ Yeni Kullanıcı Ekle</button>
            <button onClick={onClose} className="bg-emerald-800 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Ana Panel</button>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl border overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-10 py-6">Ad Soyad / Kullanıcı Adı</th>
                  <th className="px-10 py-6">Sınıf / Statü</th>
                  <th className="px-10 py-6 text-right">İşlemler</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {users.map(user => (
                 <tr key={user.id} className={`${user.status === 'suspended' ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                    <td className="px-10 py-8">
                       <p className={`font-black uppercase ${user.status === 'suspended' ? 'text-red-400 line-through' : 'text-slate-800'}`}>{user.name}</p>
                       <p className="text-xs font-bold text-slate-400">@{user.username}</p>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-1">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase w-fit ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-600 text-white'}`}>
                             {user.status === 'active' ? `${user.grade}. Sınıf Kaşifi` : 'ASKIYA ALINDI'}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right space-x-2">
                       <button 
                          onClick={() => handleStatusToggle(user.id)} 
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${user.status === 'active' ? 'bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}
                          title={user.status === 'active' ? 'Kullanıcıyı Askıya Al' : 'Kullanıcıyı Aktifleştir'}
                       >
                          <i className={`fas ${user.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                       </button>
                       <button onClick={() => { if(confirm("Üyeyi sistemden tamamen silmek istediğine emin misin?")) onDeleteUser(user.id); }} className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-trash"></i></button>
                    </td>
                 </tr>
               ))}
               {users.length === 0 && (
                 <tr>
                    <td colSpan={3} className="px-10 py-20 text-center text-slate-400 font-bold italic">Sistemde henüz kayıtlı kullanıcı bulunmuyor.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-white p-12 rounded-[4rem] max-w-xl w-full shadow-2xl animate-bounceIn">
             <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase">Yeni Kullanıcı Kaydı</h3>
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Tam Ad Soyad</label>
                      <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-emerald-600 font-bold" placeholder="Örn: Ahmet Yılmaz" onChange={e => setNewUser({...newUser, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Kullanıcı Adı</label>
                      <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-emerald-600 font-bold" placeholder="Örn: ahmet_2024" onChange={e => setNewUser({...newUser, username: e.target.value})} />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Giriş Şifresi</label>
                   <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-emerald-600 font-black text-2xl" type="password" placeholder="••••••••" onChange={e => setNewUser({...newUser, password: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Sınıf Seviyesi</label>
                      <select className="w-full bg-slate-50 p-4 rounded-2xl font-black uppercase text-xs outline-none border-2 border-transparent focus:border-emerald-600" onChange={e => setNewUser({...newUser, grade: parseInt(e.target.value) as Grade})}>
                         {[1,2,3,4].map(g => <option key={g} value={g}>{g}. SINIF</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Yetki Grubu</label>
                      <select className="w-full bg-slate-50 p-4 rounded-2xl font-black uppercase text-xs outline-none border-2 border-transparent focus:border-emerald-600" onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                         <option value="student">ÖĞRENCİ</option>
                         <option value="admin">YÖNETİCİ</option>
                      </select>
                   </div>
                </div>
             </div>
             <div className="mt-12 flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-black uppercase text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Vazgeç</button>
                <button onClick={handleSubmit} className="flex-1 py-4 bg-emerald-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-emerald-700 transition-all">KULLANICIYI KAYDET</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
