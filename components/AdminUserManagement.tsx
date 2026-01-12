
import React, { useState } from 'react';
import { UserProfile, Grade } from '../types';
import Mascot from './Mascot';

interface AdminUserManagementProps {
  users: UserProfile[];
  onAddUser: (user: UserProfile) => void;
  onDeleteUser: (id: string) => void;
  onClose: () => void;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, onAddUser, onDeleteUser, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState<{ id: string, name: string } | null>(null);
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({ grade: 1, role: 'student' });
  const [msgText, setMsgText] = useState('');
  const [msgType, setMsgType] = useState<'email' | 'sms' | 'app'>('app');

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddSubmit = () => {
    if (!newUser.name || !newUser.email) return;
    const user: UserProfile = {
      id: `USR-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '',
      grade: newUser.grade as Grade,
      role: newUser.role as 'student' | 'admin',
      badges: [],
      joinDate: new Date().toLocaleDateString('tr-TR')
    };
    onAddUser(user);
    setShowAddModal(false);
    setNewUser({ grade: 1, role: 'student' });
  };

  const handleSendMsg = () => {
    alert(`${showMsgModal?.name} kullanıcısına ${msgType.toUpperCase()} gönderildi: ${msgText}`);
    setShowMsgModal(null);
    setMsgText('');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
      <div className="flex items-center justify-between mb-12 bg-emerald-900 p-10 rounded-[4rem] shadow-2xl relative overflow-hidden text-white border-b-8 border-emerald-700">
        <div className="relative z-10">
           <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">TOPLULUK MERKEZİ</h2>
           <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mt-3 flex items-center gap-2">
             <i className="fas fa-users"></i> KULLANICI & İLETİŞİM YÖNETİMİ
           </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={() => setShowAddModal(true)} className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-50 transition-all uppercase tracking-widest text-xs">
            + YENİ KİŞİ EKLE
          </button>
          <button onClick={onClose} className="bg-emerald-800 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all uppercase tracking-widest text-xs">ANA PANEL</button>
        </div>
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
           <Mascot type="cat" size="xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
         <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-emerald-50 text-center">
            <span className="block text-4xl font-black text-emerald-600 leading-none">{users.length}</span>
            <span className="block text-[10px] font-black text-emerald-300 uppercase mt-2 tracking-widest">Toplam Kullanıcı</span>
         </div>
         <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-blue-50 text-center">
            <span className="block text-4xl font-black text-blue-600 leading-none">{users.filter(u => u.role === 'student').length}</span>
            <span className="block text-[10px] font-black text-blue-300 uppercase mt-2 tracking-widest">Öğrenci</span>
         </div>
         <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-red-50 text-center">
            <span className="block text-4xl font-black text-red-600 leading-none">{users.filter(u => u.role === 'admin').length}</span>
            <span className="block text-[10px] font-black text-red-300 uppercase mt-2 tracking-widest">Yönetici</span>
         </div>
         <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-indigo-50 text-center">
            <span className="block text-4xl font-black text-indigo-600 leading-none">{users.filter(u => u.grade === 3).length}</span>
            <span className="block text-[10px] font-black text-indigo-300 uppercase mt-2 tracking-widest">3. Sınıf Yoğunluğu</span>
         </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-50 overflow-hidden">
        <div className="p-10 border-b bg-slate-50/50">
          <div className="relative">
            <i className="fas fa-search absolute left-8 top-1/2 -translate-y-1/2 text-emerald-300 text-xl"></i>
            <input 
              className="w-full bg-white pl-16 pr-8 py-5 rounded-3xl outline-none border-2 border-slate-100 focus:border-emerald-500 font-bold text-lg shadow-inner"
              placeholder="İsim, e-posta veya telefon ile hızlıca bul..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-10 py-6">KULLANICI BİLGİSİ</th>
                <th className="px-10 py-6">STATÜ / SINIF</th>
                <th className="px-10 py-6">KATILIM TARİHİ</th>
                <th className="px-10 py-6 text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-emerald-50/20 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg uppercase shadow-sm ${u.role === 'admin' ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                        {u.name.substring(0,2)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 uppercase tracking-tighter leading-none text-lg">{u.name}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                      {u.role === 'admin' ? 'YÖNETİCİ' : `${u.grade}. SINIF`}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-xs font-bold text-slate-400">{u.joinDate}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3">
                       <button onClick={() => setShowMsgModal({ id: u.id, name: u.name })} className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center justify-center"><i className="fas fa-paper-plane"></i></button>
                       <button onClick={() => { if(confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) onDeleteUser(u.id); }} className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center"><i className="fas fa-user-slash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[4rem] p-12 max-w-xl w-full shadow-2xl animate-bounceIn border-8 border-white">
            <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">YENİ ÜYE KAYDI</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">İsim Soyisim</label>
                 <input className="w-full bg-slate-50 p-5 rounded-3xl outline-none border-2 border-slate-100 focus:border-emerald-500 font-bold" onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">İletişim Bilgileri</label>
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="E-posta" className="bg-slate-50 p-5 rounded-3xl outline-none border-2 border-slate-100 focus:border-emerald-500 font-bold text-sm" onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    <input placeholder="Telefon" className="bg-slate-50 p-5 rounded-3xl outline-none border-2 border-slate-100 focus:border-emerald-500 font-bold text-sm" onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Sınıf</label>
                    <select className="w-full bg-slate-50 p-5 rounded-3xl outline-none border-2 border-slate-100 focus:border-emerald-500 font-black uppercase text-xs" value={newUser.grade} onChange={e => setNewUser({...newUser, grade: parseInt(e.target.value) as Grade})}>
                      {[1,2,3,4].map(g => <option key={g} value={g}>{g}. SINIF</option>)}
                      <option value="SC">SES DÜNYASI</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Sistem Rolü</label>
                    <select className="w-full bg-slate-50 p-5 rounded-3xl outline-none border-2 border-slate-100 focus:border-emerald-500 font-black uppercase text-xs" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                      <option value="student">ÖĞRENCİ</option>
                      <option value="admin">YÖNETİCİ</option>
                    </select>
                 </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-3xl font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">İPTAL</button>
                <button onClick={handleAddSubmit} className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-500 transition-all">ÜYEYİ KAYDET</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {showMsgModal && (
        <div className="fixed inset-0 z-[100] bg-indigo-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[4rem] p-12 max-w-xl w-full shadow-2xl animate-bounceIn border-8 border-white">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center text-2xl shadow-inner"><i className="fas fa-paper-plane"></i></div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">İLETİŞİM MERKEZİ</h3>
                <p className="text-indigo-400 font-bold text-xs uppercase mt-1">Alıcı: {showMsgModal.name}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl">
                 <button onClick={() => setMsgType('app')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${msgType === 'app' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>UYGULAMA İÇİ</button>
                 <button onClick={() => setMsgType('email')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${msgType === 'email' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>E-POSTA</button>
                 <button onClick={() => setMsgType('sms')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${msgType === 'sms' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>SMS</button>
              </div>
              <textarea 
                placeholder="Mesajınızı buraya yazın..."
                className="w-full bg-slate-50 p-8 rounded-[2.5rem] min-h-[200px] outline-none border-2 border-slate-100 focus:border-indigo-500 font-medium text-slate-700 shadow-inner"
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowMsgModal(null)} className="flex-1 py-5 rounded-3xl font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">KAPAT</button>
                <button onClick={handleSendMsg} className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-500 transition-all">MESAJI GÖNDER</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
