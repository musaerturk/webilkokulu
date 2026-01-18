
import React, { useState, useEffect } from 'react';
import { generateStoryContent, generateStoryImage } from '../../services/geminiService';
import { Story } from '../../types';
import { fetchData, saveData, removeData } from '../../services/firebaseService';

const LibraryPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState<Partial<Story> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setIsLoading(true);
    const data = await fetchData('stories') as Story[];
    setStories(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setIsLoading(false);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const data = await generateStoryContent(prompt);
      const imageUrl = await generateStoryImage(data.title);
      
      const newStory: Partial<Story> = {
        title: data.title,
        description: data.description,
        content: data.content,
        image: imageUrl,
      };

      setCurrentStory(newStory);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToLibrary = async () => {
    if (currentStory) {
      await saveData('stories', {
        ...currentStory,
        createdAt: new Date().toISOString()
      });
      setCurrentStory(null);
      setPrompt('');
      loadStories();
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (window.confirm("Bu öyküyü kütüphaneden kaldırmak istediğinize emin misiniz?")) {
      await removeData('stories', id);
      loadStories();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">📚 AI Kütüphane (Firebase)</h1>
        <p className="text-slate-500">Gemini ile oluşturulan öyküler Firebase Firestore'da saklanır.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-slate-800">Yeni Öykü Oluştur</h3>
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-600">Öykü Teması</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: Ormanda kaybolan bir robotun eve dönüş yolculuğu..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none h-32 transition-all"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${isGenerating ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg active:scale-95'}`}
          >
            {isGenerating ? 'AI İşliyor...' : 'AI ile Oluştur ✨'}
          </button>

          {currentStory && (
            <div className="mt-6 p-6 border-2 border-indigo-100 bg-indigo-50 rounded-2xl animate-in zoom-in duration-300">
              <img src={currentStory.image} className="w-full aspect-video rounded-xl object-cover mb-4 shadow-sm" alt="Preview" />
              <h4 className="text-xl font-bold mb-2">{currentStory.title}</h4>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4">{currentStory.description}</p>
              <button 
                onClick={saveToLibrary}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
              >
                Firebase'e Kaydet ve Yayınla
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex justify-between">
            Kütüphane Listesi
            {isLoading && <span className="animate-pulse text-indigo-400 text-sm">Yükleniyor...</span>}
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {stories.length === 0 && !isLoading ? (
              <div className="text-center py-20 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                Henüz kayıtlı bir öykü bulunmuyor.
              </div>
            ) : (
              stories.map(story => (
                <div key={story.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 group hover:shadow-md transition-all relative">
                  <img src={story.image} className="w-24 h-24 rounded-2xl object-cover" alt={story.title} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{story.title}</h4>
                    <p className="text-xs text-slate-400 mb-2">{new Date(story.createdAt).toLocaleDateString('tr-TR')}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{story.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteStory(story.id)}
                    className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;
