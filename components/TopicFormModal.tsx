
import React, { useState, useEffect } from 'react';
import { Topic, PresentationPage, Question, MultipleChoiceOption, Assessment, Activity, ActivityType, activityTypeNames, Game, GameEngineType, gameEngineNames, gameThemes } from '../types';
import * as api from '../services/firebaseService';
import { GoogleGenAI } from '@google/genai';
import { PlusIcon, TrashIcon } from './icons';

interface TopicFormModalProps {
  topic: Topic | null;
  courseId: string;
  sectionId: string;
  onClose: () => void;
  onSave: () => void;
}

const TopicFormModal: React.FC<TopicFormModalProps> = ({ topic, courseId, sectionId, onClose, onSave }) => {
    const emptyTopic: Omit<Topic, 'id'> = {
        title: '',
        presentation: { type: 'manual', pages: [], aiPrompt: '' },
        games: [],
        assessment: { type: 'manual', questions: [], examType: 'topic_scan' },
        activities: [],
    };

    const [activeTab, setActiveTab] = useState<'presentation' | 'activity' | 'game' | 'assessment'>('presentation');
    const [formData, setFormData] = useState<Omit<Topic, 'id'>>(emptyTopic);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);

    useEffect(() => {
        if (topic) {
            setFormData(topic);
        } else {
            setFormData(emptyTopic);
        }
    }, [topic]);

    const handleTopicTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, title: e.target.value }));
    };
    
    // --- Presentation Logic ---
     const handlePresentationPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, presentation: { ...prev.presentation, aiPrompt: e.target.value } }));
    };

    const handleGeneratePresentation = async () => {
        if (!formData.presentation.aiPrompt) {
            alert("Lütfen sunum için bir komut girin.");
            return;
        }
        setIsGeneratingPresentation(true);
        const systemInstruction = `You are an expert instructional designer creating engaging, audio-visual presentations for primary school students in TURKISH. Your response MUST be a valid JSON object, without any markdown formatting like \`\`\`json.
The JSON schema is:
{
  "pages": [
    {
      "pageNumber": "number",
      "text": "string (concise, engaging text for the page, suitable for a 7-10 year old)",
      "imageDescription": "string (a short, descriptive prompt for an image generation AI, e.g., 'A cartoon sun smiling over green hills')",
      "audioScript": "string (The narration script for this page. It must be captivating, intriguing, and like storytelling. The tone should be soft and warm, suitable for a 25-30 year old narrator, with emphasis on key words to make it remarkable.)"
    }
  ]
}`;

        try {
            // FIX: Use process.env.API_KEY as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: formData.presentation.aiPrompt,
                config: { systemInstruction },
            });
            const jsonResponse = JSON.parse(response.text);
            
            if (jsonResponse.pages && Array.isArray(jsonResponse.pages)) {
                const newPages: PresentationPage[] = jsonResponse.pages.map((p: any) => ({
                    id: Math.random().toString(36).substring(2, 9),
                    pageNumber: p.pageNumber,
                    text: p.text,
                    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(p.imageDescription.slice(0, 20))}/600/400`,
                    audioScript: p.audioScript,
                }));
                 setFormData(prev => ({ ...prev, presentation: { ...prev.presentation, pages: newPages } }));
            } else {
                throw new Error("Invalid JSON structure from AI.");
            }

        } catch (error) {
            console.error("AI Presentation generation error:", error);
            alert("Sunum oluşturulurken bir hata oluştu. Lütfen komutunuzu kontrol edip tekrar deneyin. AI'dan gelen format hatalı olabilir.");
        } finally {
            setIsGeneratingPresentation(false);
        }
    };

    const addPresentationPage = () => {
        const newPage: PresentationPage = { id: Math.random().toString(36).substring(2, 9), pageNumber: formData.presentation.pages.length + 1, text: '' };
        setFormData(prev => ({ ...prev, presentation: { ...prev.presentation, pages: [...prev.presentation.pages, newPage] } }));
    };
    const removePresentationPage = (id: string) => {
        setFormData(prev => ({ ...prev, presentation: { ...prev.presentation, pages: prev.presentation.pages.filter(p => p.id !== id) } }));
    };
    const handlePresentationPageChange = (id: string, field: keyof Omit<PresentationPage, 'id' | 'pageNumber'>, value: string) => {
        const newPages = formData.presentation.pages.map(p => p.id === id ? { ...p, [field]: value } : p);
        setFormData(prev => ({...prev, presentation: {...prev.presentation, pages: newPages }}));
    };

    // --- Activity Logic ---
    const addActivity = () => {
        const newActivity: Activity = {
            id: Math.random().toString(36).substring(2, 9),
            type: 'matching',
            title: '',
            aiPrompt: '',
        };
        setFormData(prev => ({...prev, activities: [...prev.activities, newActivity]}));
    }
    const removeActivity = (id: string) => {
        setFormData(prev => ({...prev, activities: prev.activities.filter(a => a.id !== id)}));
    }
    const handleActivityChange = (id: string, field: keyof Activity, value: any) => {
        const newActivities = formData.activities.map(a => a.id === id ? { ...a, [field]: value } : a);
        setFormData(prev => ({...prev, activities: newActivities}));
    }
    const handleGenerateActivity = async (id: string) => {
        const activity = formData.activities.find(a => a.id === id);
        if (!activity || !activity.aiPrompt) {
            alert("Lütfen etkinlik için bir komut girin.");
            return;
        }

        handleActivityChange(id, 'isGenerating', true);

        const systemInstruction = `You are an AI assistant creating educational activities for primary school students in TURKISH. Your response MUST be a valid JSON object, containing only the generated content, without any markdown formatting like \`\`\`json.`;
        
        let userPrompt = '';
        switch (activity.type) {
            case 'matching':
                userPrompt = `Create a matching activity with 5 pairs for the topic: "${activity.aiPrompt}". JSON schema: { "pairs": [{ "item1": "string", "item2": "string" }] }`;
                break;
            case 'ordering':
                userPrompt = `Create a sequencing activity with 5 items in correct order for the topic: "${activity.aiPrompt}". JSON schema: { "items": ["string"] }`;
                break;
            case 'grouping':
                userPrompt = `Create a grouping activity with 2 categories and 4 items per category for the topic: "${activity.aiPrompt}". JSON schema: { "groups": [{ "category": "string", "items": ["string"] }] }`;
                break;
            case 'fill_in_the_blanks':
                userPrompt = `Create a fill-in-the-blanks text (around 30-50 words) with 4 blanks for the topic: "${activity.aiPrompt}". Use "___" for blanks. JSON schema: { "text": "string with ___ placeholders", "answers": ["string"] }`;
                break;
            default:
                userPrompt = `Generate content for a "${activity.type}" activity about "${activity.aiPrompt}".`;
        }

        try {
            // FIX: Use process.env.API_KEY as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userPrompt,
                config: { systemInstruction },
            });

            const jsonResponse = JSON.parse(response.text);
            handleActivityChange(id, 'generatedContent', jsonResponse);

        } catch (error) {
            console.error("AI Activity generation error:", error);
            alert("Etkinlik oluşturulurken bir hata oluştu. Lütfen komutunuzu kontrol edip tekrar deneyin.");
        } finally {
            handleActivityChange(id, 'isGenerating', false);
        }
    }
    
    // --- Game Logic ---
    const addGame = () => {
        const newGame: Game = {
            id: Math.random().toString(36).substring(2, 9),
            engine: 'RACE_ENGINE',
            theme: gameThemes['RACE_ENGINE'][0].id,
            title: '',
            aiPrompt: '',
        };
        setFormData(prev => ({...prev, games: [...(prev.games || []), newGame]}));
    }
    const removeGame = (id: string) => {
        setFormData(prev => ({...prev, games: prev.games.filter(g => g.id !== id)}));
    }
    const handleGameChange = (id: string, field: keyof Game, value: any) => {
        let newGames = formData.games.map(g => {
            if (g.id === id) {
                const updatedGame = { ...g, [field]: value };
                if (field === 'engine') {
                    updatedGame.theme = gameThemes[value as GameEngineType][0].id;
                }
                return updatedGame;
            }
            return g;
        });
        setFormData(prev => ({...prev, games: newGames}));
    }
    const handleGenerateGame = async (id: string) => {
        const game = formData.games.find(g => g.id === id);
        if (!game || !game.aiPrompt) {
            alert("Lütfen oyun için bir komut girin.");
            return;
        }

        handleGameChange(id, 'isGenerating', true);

        const systemInstruction = `You are a Game Design Architect and Content Creator specializing in educational technology for children. Your task is to convert given topics into a technical JSON file suitable for a "Game Engine" architecture.

RULES:
- Your response MUST BE PURE JSON. Do not include any explanations, introductory sentences, or markdown formatting like \`\`\`json.
- The JSON structure must include: "game_id", "engine_type", "theme", "educational_level", "content" (questions, answers, clues), and "visual_assets" (descriptions).
- VISUAL AND CULTURAL CONSTRAINTS (NEVER VIOLATE):
  - NEVER use a light bulb icon in visual descriptions.
  - Do NOT include headscarved figures in depictions of students or children.
  - Suggest modern and universal clothing instead of local/authentic costumes.
  - Designs must be modern, clean, and have a technological feel.
- All text content must be in TURKISH.`;
        
        const course = (await api.getCourses()).find(c => c.id === courseId);
        const educationalLevel = course?.level || '1. Sınıf';

        const userPrompt = `Generate a game based on these parameters:
- Game ID: "${game.id}"
- Engine Type: "${game.engine}"
- Theme: "${game.theme}"
- Educational Level: "${educationalLevel}"
- Topic/Prompt: "${game.aiPrompt}"

Produce the JSON output now.`;

        try {
            // FIX: Use process.env.API_KEY as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userPrompt,
                config: { systemInstruction },
            });

            const jsonResponse = JSON.parse(response.text);
            handleGameChange(id, 'generatedContent', jsonResponse);

        } catch (error) {
            console.error("AI Game generation error:", error);
            alert("Oyun oluşturulurken bir hata oluştu. Lütfen komutunuzu kontrol edip tekrar deneyin.");
        } finally {
            handleGameChange(id, 'isGenerating', false);
        }
    }


    // --- Assessment Logic ---
    const handleAssessmentChange = (field: keyof Omit<Assessment, 'questions'>, value: any) => {
        setFormData(prev => ({ ...prev, assessment: { ...prev.assessment, [field]: value } }));
    }

    const addQuestion = () => {
        const newQuestion: Question = { id: Math.random().toString(36).substring(2, 9), type: 'multiple_choice', questionText: '', options: [{id: Math.random().toString(36).substring(2, 9), text: ''}], correctOptionId: '' };
        setFormData(prev => ({ ...prev, assessment: { ...prev.assessment, questions: [...prev.assessment.questions, newQuestion] } }));
    };
    const removeQuestion = (id: string) => {
        setFormData(prev => ({ ...prev, assessment: { ...prev.assessment, questions: prev.assessment.questions.filter(q => q.id !== id) } }));
    };
    const handleQuestionChange = (id: string, field: keyof Question, value: any) => {
        const newQuestions = formData.assessment.questions.map(q => {
            if (q.id === id) {
                const updatedQ = { ...q, [field]: value };
                if (field === 'type' && value === 'open_ended') {
                    delete updatedQ.options;
                    delete updatedQ.correctOptionId;
                } else if (field === 'type' && value === 'multiple_choice' && !updatedQ.options) {
                    updatedQ.options = [{id: Math.random().toString(36).substring(2, 9), text: ''}];
                }
                return updatedQ;
            }
            return q;
        });
        setFormData(prev => ({ ...prev, assessment: { ...prev.assessment, questions: newQuestions } }));
    };
    const handleOptionChange = (qId: string, oId: string, text: string) => {
        const newQuestions = formData.assessment.questions.map(q => {
            if(q.id === qId && q.options) {
                return {...q, options: q.options.map(o => o.id === oId ? {...o, text} : o)};
            }
            return q;
        });
        setFormData(prev => ({ ...prev, assessment: { ...prev.assessment, questions: newQuestions } }));
    };
    const addOption = (qId: string) => {
        const newQuestions = formData.assessment.questions.map(q => {
             if(q.id === qId && q.options) {
                return {...q, options: [...q.options, {id: Math.random().toString(36).substring(2, 9), text: ''}]};
            }
            return q;
        });
        setFormData(prev => ({ ...prev, assessment: { ...prev.assessment, questions: newQuestions } }));
    }
    const removeOption = (qId: string, oId: string) => {
        const newQuestions = formData.assessment.questions.map(q => {
             if(q.id === qId && q.options && q.options.length > 1) {
                return {...q, options: q.options.filter(o => o.id !== oId)};
            }
            return q;
        });
        setFormData(prev => ({ ...prev, assessment: { ...prev.assessment, questions: newQuestions } }));
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            alert("Lütfen konu başlığını girin.");
            return;
        }
        setIsSaving(true);
        try {
            const courses = await api.getCourses();
            const course = courses.find(c => c.id === courseId);
            if (!course) throw new Error("Course not found!");
            const section = course.sections.find(s => s.id === sectionId);
            if (!section) throw new Error("Section not found!");
            
            if (topic) { // Editing existing topic
                const topicIndex = section.topics.findIndex(t => t.id === topic.id);
                if (topicIndex > -1) section.topics[topicIndex] = { ...formData, id: topic.id };
            } else { // Adding new topic
                const newTopic: Topic = { ...formData, id: Math.random().toString(36).substring(2, 9) };
                section.topics.push(newTopic);
            }
            await api.saveCourseStructure(course);
            onSave();
        } catch (error) {
            console.error("Error saving topic:", error);
            alert("Konu kaydedilirken bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'presentation', name: 'Sunum' },
        { id: 'activity', name: 'Etkinlik'},
        { id: 'game', name: 'Oyun' },
        { id: 'assessment', name: 'Ölçme' },
    ];

    const formElementClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 placeholder:text-gray-400";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">{topic ? 'Konuyu Düzenle' : 'Yeni Konu Ekle'}</h3>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                         <div className="mt-4">
                            <label htmlFor="topicTitle" className="block text-sm font-medium text-gray-700">Konu Başlığı</label>
                            <input type="text" id="topicTitle" value={formData.title} onChange={handleTopicTitleChange} className={`mt-1 ${formElementClasses}`} required />
                        </div>
                    </div>
                    
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)} className={`${ activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto">
                        {activeTab === 'presentation' && (
                            <div className="space-y-4">
                                <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50">
                                     <h3 className="font-semibold mb-2 text-lg text-gray-800">AI ile Sunum Hazırla</h3>
                                     <p className="text-sm text-gray-500 mb-3">Sunumun içeriği, derinliği ve hedeflenen beceriler hakkında detaylı bir komut girin. Yapay zeka, komutunuza göre sesli ve görsel sunum sayfaları oluşturacaktır.</p>
                                     <textarea 
                                        value={formData.presentation.aiPrompt || ''}
                                        onChange={handlePresentationPromptChange}
                                        rows={4}
                                        className={formElementClasses}
                                        placeholder="Örn: 1. sınıf öğrencileri için 'Mevsimler' konusunu anlat. Her mevsim için bir sayfa olsun. Sayfalarda o mevsime özgü kıyafetler ve aktiviteler bulunsun. Anlatım dili basit ve eğlenceli olsun."
                                     />
                                     <button 
                                        type="button" 
                                        onClick={handleGeneratePresentation}
                                        disabled={isGeneratingPresentation}
                                        className="mt-3 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                                    >
                                        {isGeneratingPresentation ? 'Oluşturuluyor...' : 'Yapay Zeka ile Sunum Oluştur'}
                                     </button>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Sunum Sayfaları</h3>
                                    <p className="text-sm text-gray-500 mb-3">AI tarafından oluşturulan sayfaları burada düzenleyebilir veya manuel olarak yeni sayfalar ekleyebilirsiniz.</p>
                                    <button type="button" onClick={addPresentationPage} className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mb-4 flex items-center"><PlusIcon/> <span className="ml-1">Manuel Sayfa Ekle</span></button>
                                    <div className="space-y-3">
                                        {formData.presentation.pages.map(page => (
                                            <div key={page.id} className="p-3 border rounded-md bg-gray-50">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-600">Sayfa {page.pageNumber}</span>
                                                    <button type="button" onClick={() => removePresentationPage(page.id)} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
                                                </div>
                                                <textarea value={page.text} onChange={(e) => handlePresentationPageChange(page.id, 'text', e.target.value)} placeholder="Sayfa metni..." rows={3} className={`mt-2 ${formElementClasses}`}></textarea>
                                                <input type="url" value={page.imageUrl || ''} onChange={(e) => handlePresentationPageChange(page.id, 'imageUrl', e.target.value)} placeholder="Görsel URL (isteğe bağlı)" className={`mt-2 ${formElementClasses}`} />
                                                <textarea value={page.audioScript || ''} onChange={(e) => handlePresentationPageChange(page.id, 'audioScript', e.target.value)} placeholder="Seslendirme metni..." rows={2} className={`mt-2 ${formElementClasses}`}></textarea>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'activity' && (
                             <div className="space-y-4">
                                 <button type="button" onClick={addActivity} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center">
                                     <PlusIcon /> <span className="ml-2">Yeni Etkinlik Ekle</span>
                                 </button>
                                 {formData.activities.map(activity => (
                                     <div key={activity.id} className="p-4 border rounded-lg bg-gray-50/50">
                                         <div className="flex justify-between items-center mb-2">
                                             <h4 className="font-semibold">Etkinlik</h4>
                                             <button type="button" onClick={() => removeActivity(activity.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                         </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                 <label className="block text-sm font-medium text-gray-700">Etkinlik Başlığı</label>
                                                 <input type="text" value={activity.title} onChange={e => handleActivityChange(activity.id, 'title', e.target.value)} className={formElementClasses} placeholder="Örn: Kelimeleri Eşleştirelim"/>
                                             </div>
                                             <div>
                                                 <label className="block text-sm font-medium text-gray-700">Etkinlik Türü</label>
                                                 <select value={activity.type} onChange={e => handleActivityChange(activity.id, 'type', e.target.value)} className={formElementClasses}>
                                                     {Object.entries(activityTypeNames).map(([key, name]) => (
                                                        <option key={key} value={key}>{name}</option>
                                                     ))}
                                                 </select>
                                             </div>
                                         </div>
                                         <div className="mt-4">
                                             <label className="block text-sm font-medium text-gray-700">Yapay Zeka Komutu (Prompt)</label>
                                             <textarea value={activity.aiPrompt} onChange={e => handleActivityChange(activity.id, 'aiPrompt', e.target.value)} rows={2} className={formElementClasses} placeholder="Etkinlik konusunu buraya yazın. Örn: Mevsimler ve özellikleri"></textarea>
                                         </div>
                                          <div className="mt-2">
                                            <button type="button" onClick={() => handleGenerateActivity(activity.id)} disabled={activity.isGenerating} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                                                {activity.isGenerating ? 'Oluşturuluyor...' : 'Yapay Zeka ile Oluştur'}
                                            </button>
                                        </div>
                                         {activity.generatedContent && (
                                            <div className="mt-4 p-2 bg-gray-100 rounded">
                                                <h5 className="text-sm font-semibold mb-1">Oluşturulan İçerik:</h5>
                                                <pre className="text-xs whitespace-pre-wrap bg-white p-2 rounded border max-h-40 overflow-auto">
                                                    {JSON.stringify(activity.generatedContent, null, 2)}
                                                </pre>
                                            </div>
                                         )}
                                     </div>
                                 ))}
                             </div>
                        )}
                        {activeTab === 'game' && (
                             <div className="space-y-4">
                                  <button type="button" onClick={addGame} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center">
                                     <PlusIcon /> <span className="ml-2">Yeni Oyun Ekle</span>
                                 </button>
                                 {(formData.games || []).map(game => (
                                     <div key={game.id} className="p-4 border rounded-lg bg-gray-50/50">
                                         <div className="flex justify-between items-center mb-2">
                                             <h4 className="font-semibold">Oyun</h4>
                                             <button type="button" onClick={() => removeGame(game.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                         </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                 <label className="block text-sm font-medium text-gray-700">Oyun Başlığı</label>
                                                 <input type="text" value={game.title} onChange={e => handleGameChange(game.id, 'title', e.target.value)} className={formElementClasses} placeholder="Örn: Gezegenler Yarışı"/>
                                             </div>
                                             <div>
                                                 <label className="block text-sm font-medium text-gray-700">Oyun Motoru</label>
                                                 <select value={game.engine} onChange={e => handleGameChange(game.id, 'engine', e.target.value)} className={formElementClasses}>
                                                     {Object.entries(gameEngineNames).map(([key, name]) => (
                                                        <option key={key} value={key}>{name}</option>
                                                     ))}
                                                 </select>
                                             </div>
                                             <div>
                                                 <label className="block text-sm font-medium text-gray-700">Tema</label>
                                                 <select value={game.theme} onChange={e => handleGameChange(game.id, 'theme', e.target.value)} className={formElementClasses}>
                                                     {gameThemes[game.engine].map(theme => (
                                                        <option key={theme.id} value={theme.id}>{theme.name}</option>
                                                     ))}
                                                 </select>
                                             </div>
                                         </div>
                                         <div className="mt-4">
                                             <label className="block text-sm font-medium text-gray-700">Yapay Zeka Komutu (Prompt)</label>
                                             <textarea value={game.aiPrompt} onChange={e => handleGameChange(game.id, 'aiPrompt', e.target.value)} rows={2} className={formElementClasses} placeholder="Oyun konusunu buraya yazın. Örn: Gezegenler ve sıralamaları hakkında 5 soruluk bir uzay yarışı."></textarea>
                                         </div>
                                          <div className="mt-2">
                                            <button type="button" onClick={() => handleGenerateGame(game.id)} disabled={game.isGenerating} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                                                {game.isGenerating ? 'Oluşturuluyor...' : 'Yapay Zeka ile Oluştur'}
                                            </button>
                                        </div>
                                         {game.generatedContent && (
                                            <div className="mt-4 p-2 bg-gray-100 rounded">
                                                <h5 className="text-sm font-semibold mb-1">Oluşturulan Oyun JSON'ı:</h5>
                                                <pre className="text-xs whitespace-pre-wrap bg-white p-2 rounded border max-h-40 overflow-auto">
                                                    {JSON.stringify(game.generatedContent, null, 2)}
                                                </pre>
                                            </div>
                                         )}
                                     </div>
                                 ))}
                            </div>
                        )}
                        {activeTab === 'assessment' && (
                            <div className="space-y-4">
                                 <div className="p-4 border-2 border-dashed rounded-lg text-center bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-700">AI ile Ölçme ve Değerlendirme</h3>
                                    <p className="text-gray-500 mt-2">Bu özellik yakında eklenecektir.</p>
                                </div>
                                 <div className="p-4 border rounded-lg">
                                     <h3 className="font-semibold mb-2">Manuel Ölçme</h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                         <div>
                                            <label className="block text-sm font-medium text-gray-700">Sınav Türü</label>
                                            <select 
                                                value={formData.assessment.examType || 'topic_scan'}
                                                onChange={e => handleAssessmentChange('examType', e.target.value)} 
                                                className={`mt-1 ${formElementClasses}`}
                                            >
                                                <option value="topic_scan">Konu Tarama</option>
                                                <option value="knowledge_application">Bilgiyi Kullanma Becerisi</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sınav PDF URL'i</label>
                                            <input type="url" value={formData.assessment.pdfUrl || ''} onChange={e => handleAssessmentChange('pdfUrl', e.target.value)} className={`mt-1 ${formElementClasses}`} placeholder="Sınavı PDF olarak yükle (isteğe bağlı)" />
                                        </div>
                                     </div>
                                     
                                      <h4 className="font-medium mb-2">
                                        veya Soruları Kendin Ekle
                                        <span className="text-sm text-gray-500 font-normal ml-2">({formData.assessment.questions.length} Soru)</span>
                                      </h4>
                                     <button type="button" onClick={addQuestion} className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mb-4 flex items-center"><PlusIcon/> <span className="ml-1">Soru Ekle</span></button>
                                     <div className="space-y-3">
                                        {formData.assessment.questions.map(q => (
                                            <div key={q.id} className="p-3 border rounded-md bg-gray-50">
                                                <div className="flex justify-between items-center">
                                                    <select value={q.type} onChange={e => handleQuestionChange(q.id, 'type', e.target.value)} className={`px-3 py-2 ${formElementClasses} w-auto`}>
                                                        <option value="multiple_choice">Çoktan Seçmeli</option>
                                                        <option value="open_ended">Açık Uçlu</option>
                                                    </select>
                                                    <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
                                                </div>
                                                <textarea value={q.questionText} onChange={e => handleQuestionChange(q.id, 'questionText', e.target.value)} placeholder="Soru metni..." rows={2} className={`mt-2 ${formElementClasses}`}></textarea>
                                                <input type="url" value={q.questionImageUrl || ''} onChange={e => handleQuestionChange(q.id, 'questionImageUrl', e.target.value)} placeholder="Soru görseli URL (isteğe bağlı)" className={`mt-2 ${formElementClasses}`} />
                                                {q.type === 'multiple_choice' && q.options && (
                                                    <div className="mt-2 pl-4 space-y-2">
                                                        {q.options.map((opt, i) => (
                                                            <div key={opt.id} className="flex items-center space-x-2">
                                                                <input type="radio" name={`correct_opt_${q.id}`} checked={q.correctOptionId === opt.id} onChange={() => handleQuestionChange(q.id, 'correctOptionId', opt.id)} />
                                                                <input type="text" value={opt.text} onChange={e => handleOptionChange(q.id, opt.id, e.target.value)} placeholder={`Seçenek ${i+1}`} className={`flex-grow ${formElementClasses}`} />
                                                                <button type="button" onClick={() => removeOption(q.id, opt.id)} className="text-red-500 hover:text-red-700 text-sm">Sil</button>
                                                            </div>
                                                        ))}
                                                        <button type="button" onClick={() => addOption(q.id)} className="text-sm text-blue-600 hover:text-blue-800">Seçenek Ekle</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                     </div>
                                 </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} disabled={isSaving} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">İptal</button>
                        <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TopicFormModal;
