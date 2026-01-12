
import React, { useState } from 'react';
import { Book, Grade, BookPage, SiteSettings } from '../types';
import { uploadFile } from '../services/storageService';

interface AdminLibraryManagementProps {
  books: Book[];
  onSave: (b: Book[]) => void;
  onClose: () => void;
}

const AdminLibraryManagement: React.FC<AdminLibraryManagementProps> = ({ books, onSave, onClose }) => {
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'pages'>('details');
  const [isUploading, setIsUploading] = useState(false);

  // Site ayarlarını bulut yükleme için çekiyoruz
  const getSiteSettings = (): SiteSettings => {
    const saved = localStorage.getItem('webilkokulu_settings');
    return saved ? JSON.parse(saved) : ({} as SiteSettings);
  };

  const handleAdd = () => {
    setEditingBook({
      id: `B-${Date.now()}`,
      title: '',
      author: '',
      coverImage: '',
      grade: 1,
      summary: '',
      pages: [],
      keywords: [],
      values: [],
      topics: []
    });
    setActiveTab('details');
  };

  const handleSaveBook = () => {
    if (!editingBook?.title || !editingBook?.author) {
      alert("Lütfen kitap adı ve yazar bilgisini girin. ✍️");
      return;
    }
    const isNew = !books.find(b => b.id === editingBook.id);
    if (isNew) {
      onSave([...books, editingBook as Book]);
    } else {
      onSave(books.map(b => b.id === editingBook.id ? editingBook as Book : b));
    }
    setEditingBook(null);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadFile(file, 'library/covers', getSiteSettings());
        setEditingBook({ ...editingBook!, coverImage: url });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddPage = () => {
    const newPage: BookPage = { id: `p-${Date.now()}`, content: '', imageUrl: '' };
    setEditingBook({ ...editingBook!, pages: [...(editingBook!.pages || []), newPage] });
  };

  const handlePageImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingBook) {
      setIsUploading(true);
      try {
        const url = await uploadFile(file, `library/pages/${editingBook.id}`, getSiteSettings());
        const newPages = [...(editingBook.pages || [])];
        newPages[idx] = { ...newPages[idx], imageUrl: url };
        setEditingBook({ ...editingBook, pages: newPages });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center mb-10 border-b-8 border-purple-700 gap-6 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-white/20">
               <i className="fas fa-feather-alt animate-pulse"></i>
            </div>
            <div>
               <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Kitap İçerik Stüdyosu</h2>
               <p className="text-purple-300 font-bold uppercase text-[10px] mt-2 tracking-widest">Hikayelerini Dünyaya Paylaş</p>
            </div>
         </div>
         <div className="flex gap-4">
           {!editingBook && (
             <button onClick={handleAdd} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-emerald-400 transition-all transform hover:scale-105 active:scale-95">
               + YENİ KİTAP YAZ
             </button>
           )}
           <button onClick={onClose} className="bg-white/10 px-8 py-4 rounded-2xl font-black uppercase text-xs border border-white/20 hover:bg-white/20 transition-all">
             Paneli Kapat
           </button>
         </div>
      </div>

      {editingBook ? (
        <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-4 border-purple-50 animate-slideIn">
           {/* Navigation Tabs */}
           <div className="flex bg-slate-50 p-2 rounded-[2.5rem] mb-12 border shadow-inner">
              <button onClick={() => setActiveTab('details')} className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs transition-all flex items-center justify-center gap-3 ${activeTab === 'details' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                 <i className="fas fa-info-circle"></i> 1. KİTAP KÜNYESİ & YAZAR
              </button>
              <button onClick={() => setActiveTab('pages')} className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs transition-all flex items-center justify-center gap-3 ${activeTab === 'pages' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                 <i className="fas fa-magic"></i> 2. SAYFA VE İÇERİK OLUŞTURMA ({editingBook.pages?.length || 0})
              </button>
           </div>

           {activeTab === 'details' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cover Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <label className="text-xs font-black uppercase text-slate-400">Kitap Kapağı</label>
                      <span className="text-[10px] font-black text-purple-400 uppercase">3:4 Oran Önerilir</span>
                   </div>
                   <div className="aspect-[3/4] bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group shadow-inner">
                      {isUploading ? (
                        <div className="animate-spin text-purple-600 text-4xl"><i className="fas fa-circle-notch"></i></div>
                      ) : (
                        editingBook.coverImage ? (
                          <img src={editingBook.coverImage} className="w-full h-full object-cover" alt="Kapak" />
                        ) : (
                          <div className="text-center p-8">
                             <i className="fas fa-cloud-upload-alt text-5xl text-slate-200 mb-4"></i>
                             <p className="text-[10px] font-black text-slate-300 uppercase leading-tight">Görseli Buraya Sürükle veya Seç</p>
                          </div>
                        )
                      )}
                      <label className="absolute inset-0 bg-purple-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all text-white text-center p-4">
                         <i className="fas fa-camera text-3xl mb-2"></i>
                         <span className="text-xs font-black uppercase leading-tight">Kapak Resmini Güncelle</span>
                         <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                      </label>
                   </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-2 space-y-10">
                   <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Kitap Başlığı</label>
                            <input 
                               className="w-full bg-white p-5 rounded-2xl outline-none font-black text-slate-700 border-2 border-transparent focus:border-purple-200 shadow-sm" 
                               value={editingBook.title} 
                               onChange={e => setEditingBook({...editingBook!, title: e.target.value})} 
                               placeholder="Örn: Meraklı Karınca'nın Macerası" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Yazar / Eğitimci</label>
                            <input 
                               className="w-full bg-white p-5 rounded-2xl outline-none font-black text-slate-700 border-2 border-transparent focus:border-purple-200 shadow-sm" 
                               value={editingBook.author} 
                               onChange={e => setEditingBook({...editingBook!, author: e.target.value})} 
                               placeholder="Adınız Soyadınız..." 
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Hedef Sınıf Seviyesi</label>
                            <select 
                               className="w-full bg-white p-5 rounded-2xl font-black uppercase text-xs outline-none border-2 border-transparent focus:border-purple-200 shadow-sm" 
                               value={editingBook.grade} 
                               onChange={e => setEditingBook({...editingBook!, grade: parseInt(e.target.value) as Grade})}
                            >
                               {[1,2,3,4].map(g => <option key={g} value={g}>{g}. SINIF SEVİYESİ</option>)}
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Ana Temalar (Virgülle Ayır)</label>
                            <input 
                               className="w-full bg-white p-5 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-purple-200 shadow-sm" 
                               value={editingBook.values?.join(', ')} 
                               onChange={e => setEditingBook({...editingBook!, values: e.target.value.split(',').map(s => s.trim())})} 
                               placeholder="Dürüstlük, Yardımlaşma, Doğa..." 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                         <label className="text-xs font-black uppercase text-slate-400">Kitap Arka Kapak Özeti</label>
                         <span className="text-[10px] font-bold text-slate-300">Öğrencilere merak uyandıracak bir özet yazın.</span>
                      </div>
                      <textarea 
                         className="w-full bg-slate-50 p-8 rounded-[2.5rem] outline-none font-medium text-slate-600 min-h-[180px] border-2 border-transparent focus:border-purple-200 shadow-inner" 
                         value={editingBook.summary} 
                         onChange={e => setEditingBook({...editingBook!, summary: e.target.value})} 
                         placeholder="Bu kitapta bizi neler bekliyor?" 
                      />
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'pages' && (
             <div className="space-y-10 animate-fadeIn">
                <div className="flex items-center justify-between bg-purple-50 p-6 rounded-[2.5rem] border border-purple-100">
                   <div>
                      <h4 className="text-2xl font-black text-purple-900 uppercase tracking-tighter">Hikaye Akışını Oluştur</h4>
                      <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mt-1">Sayfa sayfa metin ve görselleri ekleyin</p>
                   </div>
                   <button onClick={handleAddPage} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-purple-500 transition-all flex items-center gap-2">
                      <i className="fas fa-plus"></i> YENİ SAYFA EKLE
                   </button>
                </div>
                
                <div className="grid grid-cols-1 gap-12">
                   {editingBook.pages?.map((page, idx) => (
                     <div key={page.id} className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 flex flex-col lg:flex-row gap-10 relative group hover:border-purple-200 hover:shadow-xl transition-all shadow-sm">
                        
                        {/* Page Number Badge */}
                        <div className="absolute -top-5 -left-5 w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transform rotate-3">
                           {idx + 1}
                        </div>

                        {/* Page Image */}
                        <div className="w-full lg:w-72 aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center group-inner shadow-inner">
                           {page.imageUrl ? (
                             <img src={page.imageUrl} className="w-full h-full object-cover" alt="Sayfa Görseli" />
                           ) : (
                             <div className="text-center p-4">
                                <i className="fas fa-image text-4xl text-slate-200 mb-2"></i>
                                <p className="text-[8px] font-black text-slate-300 uppercase">SAYFA GÖRSELİ</p>
                             </div>
                           )}
                           <label className="absolute inset-0 bg-purple-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all text-white text-center p-4">
                              <i className="fas fa-upload text-2xl mb-2"></i>
                              <span className="text-[10px] font-black uppercase">RESİM SEÇ</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePageImageUpload(idx, e)} />
                           </label>
                        </div>

                        {/* Page Content */}
                        <div className="flex-1 space-y-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase text-purple-400 ml-4 tracking-widest">SAYFA METNİ (İÇERİK)</label>
                              <span className="text-[10px] font-bold text-slate-300 italic">Duygulu ve öğretici bir dil kullanın</span>
                           </div>
                           <textarea 
                              className="w-full bg-slate-50 p-8 rounded-[2.5rem] outline-none font-bold text-slate-700 min-h-[150px] border-2 border-transparent focus:border-purple-200 shadow-inner text-lg leading-relaxed" 
                              value={page.content} 
                              onChange={e => {
                                 const newPages = [...(editingBook.pages || [])];
                                 newPages[idx] = { ...newPages[idx], content: e.target.value };
                                 setEditingBook({ ...editingBook!, pages: newPages });
                              }} 
                              placeholder="Bu sayfada hikaye nasıl devam ediyor?..." 
                           />
                        </div>

                        {/* Delete Button */}
                        <button 
                           onClick={() => setEditingBook({ ...editingBook!, pages: editingBook.pages?.filter((_, i) => i !== idx) })} 
                           className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                           title="Sayfayı Sil"
                        >
                           <i className="fas fa-trash-alt"></i>
                        </button>
                     </div>
                   ))}

                   {editingBook.pages?.length === 0 && (
                     <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
                        <i className="fas fa-book-open text-6xl text-slate-200 mb-4"></i>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Henüz bir sayfa oluşturmadınız.</p>
                        <button onClick={handleAddPage} className="mt-6 text-purple-600 font-black uppercase text-[10px] hover:underline">İlk Sayfayı Şimdi Ekle</button>
                     </div>
                   )}
                </div>
             </div>
           )}

           {/* Save/Cancel Actions */}
           <div className="mt-16 flex flex-col sm:flex-row gap-6 border-t pt-12">
              <button 
                onClick={() => setEditingBook(null)} 
                className="flex-1 py-6 font-black uppercase text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-[2rem] transition-all"
              >
                YAZMAYI BIRAK / İPTAL
              </button>
              <button 
                onClick={handleSaveBook} 
                disabled={isUploading} 
                className="flex-[2] py-6 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isUploading ? 'GÖRSELLER İŞLENİYOR...' : 'HİKAYEYİ KÜTÜPHANEYE KAYDET ✅'}
              </button>
           </div>
        </div>
      ) : (
        /* Library List View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
           {books.map(book => (
             <div key={book.id} className="bg-white p-6 rounded-[3.5rem] shadow-xl border-4 border-transparent hover:border-purple-200 group transition-all flex flex-col relative overflow-hidden">
                <div className="aspect-[3/4] bg-slate-100 rounded-[2.5rem] overflow-hidden mb-6 relative">
                   {book.coverImage ? (
                     <img src={book.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={book.title} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                        <i className="fas fa-book text-6xl"></i>
                     </div>
                   )}
                   <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-xl text-[10px] font-black text-purple-600 shadow-md border border-purple-100">
                      {book.grade}. SINIF
                   </div>
                </div>
                <h4 className="font-black text-slate-800 uppercase text-lg leading-tight mb-2 truncate group-hover:text-purple-600 transition-colors">{book.title}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <i className="fas fa-pen-nib text-[8px]"></i> {book.author}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-8">
                   {book.values?.slice(0, 3).map(v => (
                     <span key={v} className="bg-purple-50 text-purple-600 text-[8px] font-black px-2.5 py-1 rounded-lg border border-purple-100">
                        {v}
                     </span>
                   ))}
                </div>

                <div className="mt-auto flex gap-3">
                   <button onClick={() => setEditingBook(book)} className="flex-1 bg-purple-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-purple-700 transition-all shadow-lg active:scale-95">
                      <i className="fas fa-edit mr-2"></i> Düzenle
                   </button>
                   <button 
                      onClick={() => { if(confirm(`${book.title} kitabını silmek istediğine emin misin?`)) onSave(books.filter(b => b.id !== book.id)); }} 
                      className="w-14 bg-red-50 text-red-500 py-4 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
                      title="Kitabı Sil"
                   >
                      <i className="fas fa-trash-alt"></i>
                   </button>
                </div>
             </div>
           ))}
           
           {/* New Book Card */}
           <button onClick={handleAdd} className="bg-white p-12 border-4 border-dashed border-purple-100 rounded-[3.5rem] text-purple-200 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all group min-h-[450px] shadow-sm">
              <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                 <i className="fas fa-plus-circle text-5xl"></i>
              </div>
              <span className="font-black uppercase tracking-[0.2em] text-sm">YENİ KİTAP EKLE</span>
              <p className="text-[10px] font-bold text-slate-300 mt-4 px-6 text-center">Eğitsel hikayeni bugün yazmaya başla!</p>
           </button>
        </div>
      )}
    </div>
  );
};

export default AdminLibraryManagement;
