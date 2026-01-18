
import React from 'react';

const UserSettingsPanel: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Kullanıcı Ayarları</h1>
        <p className="text-slate-500">Sistemdeki kullanıcıları, rolleri ve yetkileri yönetin.</p>
      </header>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <h4 className="text-indigo-800 font-bold mb-1">Toplam Kullanıcı</h4>
            <span className="text-4xl font-black text-indigo-600">1,284</span>
          </div>
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
            <h4 className="text-emerald-800 font-bold mb-1">Aktif Kursiyer</h4>
            <span className="text-4xl font-black text-emerald-600">842</span>
          </div>
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
            <h4 className="text-amber-800 font-bold mb-1">Yeni Kayıt (Haftalık)</h4>
            <span className="text-4xl font-black text-amber-600">45</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-lg">Kullanıcı Listesi</h3>
             <div className="flex gap-2">
                <input type="text" placeholder="Kullanıcı ara..." className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                <button className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold">Filtrele</button>
             </div>
          </div>
          <div className="border border-slate-100 rounded-2xl overflow-hidden">
             {[
               { name: 'Ayşe Kaya', email: 'ayse@example.com', role: 'Eğitmen', status: 'Aktif' },
               { name: 'Mehmet Öz', email: 'mehmet@example.com', role: 'Öğrenci', status: 'Beklemede' },
               { name: 'Selin Deniz', email: 'selin@example.com', role: 'Öğrenci', status: 'Aktif' }
             ].map((user, i) => (
               <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                       <img src={`https://picsum.photos/40?random=${i}`} alt="user" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-md text-slate-600">{user.role}</span>
                    <span className={`text-xs font-bold ${user.status === 'Aktif' ? 'text-green-500' : 'text-amber-500'}`}>{user.status}</span>
                    <button className="text-slate-400 hover:text-indigo-600">•••</button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPanel;
