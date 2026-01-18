
import React, { useState, useEffect } from 'react';
import { Category, Course, Section, Subject, Slide, Question } from '../../types';
import { fetchData, saveData, removeData, updateData } from '../../services/firebaseService';
import { generatePresentationSlides, generateAssessmentQuestions, generateGameLogic, generateStoryImage } from '../../services/geminiService';

const CoursePanel: React.FC = () => {
  const [view, setView] = useState<'CATEGORIES' | 'COURSES' | 'SUBJECTS'>('CATEGORIES');
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'PRESENTATION' | 'GAME' | 'ASSESSMENT'>('PRESENTATION');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // AI Form states
  const [presentationPrompt, setPresentationPrompt] = useState('');
  const [gamePrompt, setGamePrompt] = useState('');
  const [assessmentOutcomes, setAssessmentOutcomes] = useState('');
  const [assessmentCount, setAssessmentCount] = useState(5);
  const [assessmentDifficulty, setAssessmentDifficulty] = useState('Orta');

  useEffect(() => {
    loadData();
  }, [view, activeCourse]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (view === 'CATEGORIES') {
        const data = await fetchData('categories') as Category[];
        setCategories(data);
      } else if (view === 'COURSES') {
        const data = await fetchData('courses') as Course[];
        setCourses(data);
        if (activeCourse) {
            const allSections = await fetchData('sections') as Section[];
            setSections(allSections.filter(s => s.courseId === activeCourse.id));
            const allSubjects = await fetchData('subjects') as Subject[];
            setSubjects(allSubjects.filter(s => s.courseId === activeCourse.id));
        }
      } else if (view === 'SUBJECTS') {
        const data = await fetchData('subjects') as Subject[];
        setSubjects(data);
      }
    } catch (error) {
      console.error("Firebase fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeGrades = async () => {
    if (window.confirm("1, 2, 3 ve 4. Sınıf kategorilerini toplu olarak oluşturmak istiyor musunuz?")) {
      setIsLoading(true);
      const grades = [
        { name: "1. Sınıf", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=200", subCategories: [] },
        { name: "2. Sınıf", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200", subCategories: [] },
        { name: "3. Sınıf", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=200", subCategories: [] },
        { name: "4. Sınıf", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200", subCategories: [] }
      ];
      for (const grade of grades) {
        await saveData('categories', grade);
      }
      await loadData();
      alert("Sınıf kategorileri başarıyla eklendi.");
    }
  };

  const handleAiPresentation = async () => {
    if (!presentationPrompt || !activeSubject) return;
    setIsAiLoading(true);
    try {
      const slides = await generatePresentationSlides(presentationPrompt);
      const updated = { ...activeSubject, presentation: { slides } };
      await updateData('subjects', activeSubject.id, updated);
      setActiveSubject(updated);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiAssessment = async () => {
    if (!assessmentOutcomes || !activeSubject) return;
    setIsAiLoading(true);
    try {
      const questions = await generateAssessmentQuestions(assessmentOutcomes, assessmentCount, assessmentDifficulty);
      const updated = { ...activeSubject, assessment: { questions, outcomes: assessmentOutcomes } };
      await updateData('subjects', activeSubject.id, updated);
      setActiveSubject(updated);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiGame = async () => {
    if (!gamePrompt || !activeSubject) return;
    setIsAiLoading(true);
    try {
      const gameConfig = await generateGameLogic(gamePrompt);
      const updated = { ...activeSubject, game: { managerInstructions: gamePrompt, gameConfig } };
      await updateData('subjects', activeSubject.id, updated);
      setActiveSubject(updated);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSlideEdit = (index: number, text: string) => {
    if (!activeSubject) return;
    const newSlides = [...activeSubject.presentation.slides];
    newSlides[index].text = text;
    setActiveSubject({ ...activeSubject, presentation: { slides: newSlides } });
  };

  const handleAddCategory = async () => {
    const name = prompt("Kategori Adı:");
    if (!name) return;
    const newCat = {
      name,
      image: `https://picsum.photos/200?random=${Math.random()}`,
      subCategories: []
    };
    await saveData('categories', newCat);
    loadData();
  };

  const handleAddCourse = async () => {
    const name = prompt("Kurs Adı:");
    if (!name) return;
    const newCourse = {
      name,
      description: "Yeni bir öğrenme macerası.",
      image: `https://picsum.photos/400/200?random=${Math.random()}`,
      categoryId: categories[0]?.id || '',
      subCategoryId: '',
      info: "Kurs detayları buraya gelecek."
    };
    await saveData('courses', newCourse);
    loadData();
  };

  const handleAddSection = async () => {
    if (!activeCourse) return;
    const name = prompt("Bölüm (Ünite) Adı:");
    if (!name) return;
    const newSection: Omit<Section, 'id'> = {
      courseId: activeCourse.id,
      name,
      order: sections.length + 1
    };
    await saveData('sections', newSection);
    loadData();
  };

  const handleAddSubjectToSection = async (sectionId: string) => {
    if (!activeCourse) return;
    const name = prompt("Konu Başlığı:");
    if (!name) return;
    const newSub: Omit<Subject, 'id'> = {
      courseId: activeCourse.id,
      sectionId: sectionId,
      name,
      presentation: { slides: [] },
      game: { managerInstructions: '', gameConfig: null },
      assessment: { questions: [], outcomes: '' }
    };
    await saveData('subjects', newSub);
    loadData();
  };

  const handleDeleteItem = async (col: string, id: string) => {
    if (window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) {
      await removeData(col, id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {activeSubject ? `Düzenle: ${activeSubject.name}` : activeCourse ? `Kurs: ${activeCourse.name}` : 'Kurs Yönetimi'}
          </h1>
          <p className="text-slate-500">
            {activeSubject ? 'Konu içeriklerini AI desteğiyle hazırlayın.' : activeCourse ? 'Bölümler ve konuları yönetin.' : 'Tüm kategorileri ve kursları yönetin.'}
          </p>
        </div>
        {!activeSubject && !activeCourse && (
          <div className="flex gap-2">
            {view === 'CATEGORIES' && (
              <button 
                onClick={handleInitializeGrades}
                className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all active:scale-95 text-sm"
              >
                Hızlı Sınıf Ekle (1-4)
              </button>
            )}
            <button 
              onClick={view === 'CATEGORIES' ? handleAddCategory : view === 'COURSES' ? handleAddCourse : undefined}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95 text-sm"
            >
              + Yeni Ekle
            </button>
          </div>
        )}
        {activeCourse && !activeSubject && (
            <div className="flex gap-2">
                <button onClick={handleAddSection} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm">
                    + Bölüm (Ünite) Ekle
                </button>
                <button onClick={() => setActiveCourse(null)} className="bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold text-sm">Geri Dön</button>
            </div>
        )}
        {activeSubject && (
          <button onClick={() => setActiveSubject(null)} className="bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold">Vazgeç</button>
        )}
      </header>

      {!activeSubject && !activeCourse ? (
        <>
          <div className="flex gap-2 p-1 bg-slate-200 rounded-2xl w-fit">
            <button onClick={() => setView('CATEGORIES')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'CATEGORIES' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-300'}`}>Kategoriler</button>
            <button onClick={() => setView('COURSES')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'COURSES' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-300'}`}>Kurslar</button>
            <button onClick={() => setView('SUBJECTS')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'SUBJECTS' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-300'}`}>Konular</button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : view === 'CATEGORIES' ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Görsel</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Kategori Adı</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {categories.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-400">Veri bulunamadı.</td></tr>
                  ) : categories.sort((a,b) => a.name.localeCompare(b.name)).map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4"><img src={cat.image} className="w-12 h-12 rounded-xl object-cover" alt={cat.name} /></td>
                      <td className="px-6 py-4 font-bold">{cat.name}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-indigo-600 font-bold hover:underline">Düzenle</button>
                        <button onClick={() => handleDeleteItem('categories', cat.id)} className="text-red-500 font-bold hover:underline">Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : view === 'COURSES' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {courses.map(course => (
                  <div key={course.id} onClick={() => setActiveCourse(course)} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-indigo-400 cursor-pointer transition-all group">
                    <img src={course.image} className="w-full h-32 object-cover rounded-2xl mb-4" alt={course.name} />
                    <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600">{course.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>
                    <button className="mt-4 text-xs font-bold text-indigo-600">Detayları Yönet &rarr;</button>
                  </div>
                ))}
              </div>
            ) : view === 'SUBJECTS' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {subjects.map(sub => (
                  <div key={sub.id} onClick={() => setActiveSubject(sub)} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-indigo-400 cursor-pointer transition-all group">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600">{sub.name}</h3>
                    <div className="flex gap-2 text-xs font-bold text-slate-400">
                      <span>🖼️ {sub.presentation.slides.length} Slayt</span>
                      <span>🎮 Oyun Hazır</span>
                      <span>📝 {sub.assessment.questions.length} Soru</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </>
      ) : activeCourse && !activeSubject ? (
          /* BÖLÜM VE KONU YÖNETİMİ (KURS ALTINDA) */
          <div className="space-y-8 animate-in fade-in duration-500">
              {sections.length === 0 ? (
                  <div className="bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-slate-100">
                      <p className="text-slate-400 font-bold mb-4">Henüz bölüm eklenmemiş.</p>
                      <button onClick={handleAddSection} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold">+ İlk Bölümü Ekle</button>
                  </div>
              ) : (
                  <div className="space-y-6">
                      {sections.sort((a,b) => a.order - b.order).map(section => (
                          <div key={section.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                              <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                                  <h3 className="font-black text-slate-800 text-lg">{section.name}</h3>
                                  <div className="flex gap-4">
                                      <button 
                                        onClick={() => handleAddSubjectToSection(section.id)}
                                        className="text-xs font-black text-indigo-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
                                      >
                                          + Konu Ekle
                                      </button>
                                      <button onClick={() => handleDeleteItem('sections', section.id)} className="text-xs font-bold text-red-400">Sil</button>
                                  </div>
                              </div>
                              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {subjects.filter(s => s.sectionId === section.id).map(subject => (
                                      <div 
                                        key={subject.id} 
                                        onClick={() => setActiveSubject(subject)}
                                        className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-300 cursor-pointer transition-all flex justify-between items-center group"
                                      >
                                          <div>
                                              <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{subject.name}</p>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase">{subject.presentation.slides.length} Slayt</span>
                                          </div>
                                          <button className="text-slate-300 group-hover:text-indigo-400">⚙️</button>
                                      </div>
                                  ))}
                                  {subjects.filter(s => s.sectionId === section.id).length === 0 && (
                                      <p className="text-xs text-slate-400 italic col-span-full">Bu bölümde henüz konu bulunmuyor.</p>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      ) : (
        /* KONU İÇERİK DÜZENLEME (ACTIVE SUBJECT) */
        <div className="space-y-6">
          <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
            <button onClick={() => setActiveSubTab('PRESENTATION')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeSubTab === 'PRESENTATION' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>🎬 Sunum</button>
            <button onClick={() => setActiveSubTab('GAME')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeSubTab === 'GAME' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>🎮 Oyun</button>
            <button onClick={() => setActiveSubTab('ASSESSMENT')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeSubTab === 'ASSESSMENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>📊 Ölçme</button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[600px] relative">
            {isAiLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[2rem]">
                <div className="animate-bounce text-4xl mb-4">✨</div>
                <p className="font-bold text-indigo-600">AI İçeriğinizi Hazırlıyor...</p>
              </div>
            )}

            {activeSubTab === 'PRESENTATION' && activeSubject && (
              <div className="space-y-8">
                <div className="bg-indigo-50 p-6 rounded-3xl space-y-4">
                  <h4 className="font-bold">AI Sunum Oluşturucu</h4>
                  <textarea 
                    value={presentationPrompt}
                    onChange={(e) => setPresentationPrompt(e.target.value)}
                    className="w-full bg-white border border-indigo-100 rounded-2xl p-4 text-sm font-['Quicksand']"
                    placeholder="Sunumun konusu ve stili hakkında detaylı bilgi verin..."
                  />
                  <button onClick={handleAiPresentation} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Slaytları Oluştur</button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {activeSubject.presentation.slides.map((slide, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 border border-slate-100 rounded-3xl bg-slate-50">
                      <div className="w-full md:w-64">
                         <img src={slide.imageUrl} className="w-full aspect-video rounded-2xl object-cover shadow-sm" alt={`Slide ${idx+1}`} />
                         <button className="w-full mt-2 text-xs font-bold text-indigo-600">Görseli Yenile</button>
                      </div>
                      <div className="flex-1 space-y-2">
                         <span className="text-xs font-bold text-slate-400">Slayt {idx+1}</span>
                         <textarea 
                           className="w-full bg-white border border-slate-200 rounded-xl p-4 h-32 font-['Quicksand']"
                           value={slide.text}
                           onChange={(e) => handleSlideEdit(idx, e.target.value)}
                         />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'GAME' && activeSubject && (
              <div className="space-y-8">
                <div className="bg-purple-50 p-6 rounded-3xl space-y-4">
                  <h4 className="font-bold">AI Oyun Tasarımcısı</h4>
                  <textarea 
                    value={gamePrompt}
                    onChange={(e) => setGamePrompt(e.target.value)}
                    className="w-full bg-white border border-purple-100 rounded-2xl p-4 text-sm font-['Quicksand']"
                    placeholder="Oyun evreni, amacı ve puan sistemi hakkında talimatlar girin..."
                  />
                  <button onClick={handleAiGame} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold">Oyunu Hazırla</button>
                </div>
                {activeSubject.game.gameConfig && (
                  <div className="p-8 border-2 border-dashed border-purple-200 rounded-[2rem] text-center space-y-4">
                    <span className="text-5xl">🕹️</span>
                    <h3 className="text-2xl font-black text-purple-800">{activeSubject.game.gameConfig.universeName}</h3>
                    <p className="text-slate-600">{activeSubject.game.gameConfig.mechanics}</p>
                    <div className="bg-slate-50 p-4 rounded-2xl text-left inline-block">
                       <p className="font-bold text-sm mb-2">Puan Sistemi:</p>
                       <p className="text-sm">{activeSubject.game.gameConfig.scoring}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'ASSESSMENT' && activeSubject && (
              <div className="space-y-8">
                <div className="bg-amber-50 p-8 rounded-3xl space-y-6">
                  <h4 className="font-bold text-xl">AI Sınav Hazırlayıcı</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-amber-800">Öğrenme Çıktıları</label>
                       <textarea 
                         value={assessmentOutcomes}
                         onChange={(e) => setAssessmentOutcomes(e.target.value)}
                         className="w-full bg-white border border-amber-100 rounded-xl p-3 h-24 font-['Quicksand']"
                         placeholder="Örn: Ritmik sayma becerisi, 2'şerli gruplama..."
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-amber-800">Soru Sayısı</label>
                          <input type="number" value={assessmentCount} onChange={e => setAssessmentCount(Number(e.target.value))} className="w-full bg-white border border-amber-100 rounded-xl p-3" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-amber-800">Zorluk</label>
                          <select value={assessmentDifficulty} onChange={e => setAssessmentDifficulty(e.target.value)} className="w-full bg-white border border-amber-100 rounded-xl p-3">
                             <option>Kolay</option>
                             <option>Orta</option>
                             <option>Zor</option>
                          </select>
                       </div>
                    </div>
                  </div>
                  <button onClick={handleAiAssessment} className="w-full bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-200">AI Sınavı Hazırla</button>
                </div>

                <div className="space-y-4">
                  {activeSubject.assessment.questions.map((q, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${q.category === 'CONCEPT' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {q.category === 'CONCEPT' ? 'Kavram Ölçme' : 'Bilgi Kullanma'}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{q.type === 'MULTIPLE' ? 'Çoktan Seçmeli' : 'Açık Uçlu'}</span>
                      </div>
                      <p className="font-bold">{q.text}</p>
                      {q.options && (
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="p-2 bg-white border border-slate-200 rounded-lg text-sm">{opt}</div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-slate-500 bg-white p-2 rounded-lg inline-block">Cevap: {q.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePanel;
