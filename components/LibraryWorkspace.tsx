
import React, { useState } from 'react';
import { Book, BookPage, Assessment5N1K } from '../types';
import Mascot from './Mascot';
import { grade5N1K } from '../services/geminiService';

interface LibraryWorkspaceProps {
  onBack: () => void;
  books: Book[];
}

const LibraryWorkspace: React.FC<LibraryWorkspaceProps> = ({ onBack, books }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isReadingFinished, setIsReadingFinished] = useState(false);
  const [assessment, setAssessment] = useState<Assessment5N1K>({ who: '', what: '', where: '', when: '', why: '', how: '' });
  const [grading, setGrading] = useState<{ score: number, feedback: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const reset = () => {
    setSelectedBook(null);
    setCurrentPageIdx(0);
    setIsReadingFinished(false);
    setAssessment({ who: '', what: '', where: '', when: '', why: '', how: '' });
    setGrading(null);
  };

  const handleFinishReading = () => {
    setIsReadingFinished(true);
  };

  const handleGrade = async () => {
    if (!selectedBook) return;
    setIsAnalyzing(true);
    const result = await grade5N1K(selectedBook, assessment);
    setGrading(result);
    setIsAnalyzing(false);
  };

  if (selectedBook) {
    if (isReadingFinished) {
      return (
        <div className="animate-fadeIn max-w-4xl mx-auto py-10">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border-b-8 border-purple-600">
            <div className="text-center mb-10">
              <Mascot type="owl" size="lg" className="mx-auto mb-4" />
              <h2 className="text-4xl font-black text-purple-900 uppercase">5N1K Değerlendirmesi</h2>
              <p className="text-gray-500 font-bold">"{selectedBook.title}" kitabını harika okudun! Şimdi soruları cevaplayalım.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.keys(assessment).map((key) => {
                const labelMap: any = { who: 'KİM?', what: 'NE?', where: 'NEREDE?', when: 'NE ZAMAN?', why: 'NEDEN?', how: 'NASIL?' };
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-black text-purple-400 uppercase tracking-widest ml-4">{labelMap[key]}</label>
                    <textarea 
                      className="w-full bg-purple-50 p-5 rounded-3xl outline-none border-2 border-transparent focus:border-purple-200 font-bold shadow-inner min-h-[100px]"
                      value={(assessment as any)[key]}
                      onChange={(e) => setAssessment({ ...assessment, [key]: e.target.value })}
                      placeholder="Cevabın..."
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              {!grading ? (
                <button 
                  onClick={handleGrade} 
                  disabled={isAnalyzing}
                  className="w-full bg-purple-600 text-white py-6 rounded-3xl font-black text-xl uppercase shadow-xl hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? 'BİLKUŞ ANALİZ EDİYOR...' : 'DEĞERLENDİRMEYİ GÖNDER'}
                </button>
              ) : (
                <div className="bg-emerald-50 p-10 rounded-[3rem] border-4 border-emerald-100 animate-slideIn">
                   <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center text-4xl font-black">{grading.score}</div>
                      <div>
                         <h4 className="text-2xl font-black text-emerald-900 uppercase">TEBRİKLER!</h4>
                         <p className="text-emerald-700 font-medium italic">"{grading.feedback}"</p>
                      </div>
                   </div>
                   <button onClick={reset} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs">KÜTÜPHANEYE DÖN</button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    const page = selectedBook.pages[currentPageIdx];
    return (
      <div className="animate-fadeIn max-w-5xl mx-auto py-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[2.5rem] shadow-sm">
           <div className="flex items-center gap-4">
              <button onClick={reset} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-purple-600"><i className="fas fa-arrow-left"></i></button>
              <div>
                 <h3 className="font-black text-purple-900 text-xl uppercase tracking-tighter leading-none">{selectedBook.title}</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedBook.author}</p>
              </div>
           </div>
           <div className="bg-purple-100 px-6 py-2 rounded-2xl font-black text-purple-600 text-sm">SAYFA {currentPageIdx + 1} / {selectedBook.pages.length}</div>
        </div>

        <div className="flex-grow bg-white rounded-[4rem] shadow-2xl overflow-hidden border-8 border-white grid grid-cols-1 lg:grid-cols-2">
           <div className="bg-slate-100 relative overflow-hidden flex items-center justify-center p-12">
              {page?.imageUrl && <img src={page.imageUrl} className="max-w-full max-h-full rounded-3xl shadow-2xl object-cover" alt="sayfa" />}
           </div>
           <div className="p-16 flex flex-col justify-center bg-white">
              <p className="text-3xl font-bold text-gray-800 leading-[1.6] italic">"{page?.content || 'Bu sayfa henüz doldurulmamış.'}"</p>
              
              <div className="mt-20 flex gap-4">
                 <button 
                  disabled={currentPageIdx === 0} 
                  onClick={() => setCurrentPageIdx(p => p - 1)}
                  className="flex-1 py-5 bg-gray-100 rounded-3xl font-black uppercase text-xs disabled:opacity-30"
                 >GERİ</button>
                 {currentPageIdx >= (selectedBook.pages.length - 1) ? (
                   <button onClick={handleFinishReading} className="flex-[2] py-5 bg-purple-600 text-white rounded-3xl font-black uppercase text-xs shadow-xl">OKUMAYI BİTİR VE ANALİZE GEÇ</button>
                 ) : (
                   <button onClick={() => setCurrentPageIdx(p => p + 1)} className="flex-[2] py-5 bg-purple-600 text-white rounded-3xl font-black uppercase text-xs shadow-xl">SONRAKİ SAYFA</button>
                 )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">BÜYÜLÜ KÜTÜPHANE</h2>
          <p className="text-purple-500 font-bold uppercase tracking-widest text-xs mt-2">Kitaplar dünyasına hoş geldin!</p>
        </div>
        <button onClick={onBack} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Geri Dön</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {books.map(book => (
          <div 
            key={book.id} 
            onClick={() => setSelectedBook(book)}
            className="group cursor-pointer bg-white rounded-[3rem] p-6 shadow-xl hover:-translate-y-4 transition-all duration-300 border-b-8 border-transparent hover:border-purple-600"
          >
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-md relative">
              <img src={book.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={book.title} />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-black text-purple-600">{book.grade}. SINIF</div>
            </div>
            <h4 className="font-black text-slate-800 text-lg uppercase tracking-tighter leading-none mb-2">{book.title}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{book.author}</p>
            <div className="flex flex-wrap gap-1 mt-4">
               {book.values?.slice(0, 2).map(v => <span key={v} className="bg-purple-50 text-purple-600 text-[8px] font-black px-2 py-0.5 rounded-lg">{v}</span>)}
            </div>
          </div>
        ))}
        {books.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">Kütüphane henüz boş.</div>
        )}
      </div>
    </div>
  );
};

export default LibraryWorkspace;
