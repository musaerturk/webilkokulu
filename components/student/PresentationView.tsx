
import React, { useState, useRef, useEffect } from 'react';
import { Presentation, TopicProgress, ChatMessage } from '../../types';
import { GoogleGenAI, Chat } from '@google/genai';

interface PresentationViewProps {
    presentation: Presentation;
    progress: TopicProgress;
    onUpdateProgress: (updates: Partial<TopicProgress>) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ presentation, progress, onUpdateProgress }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    
    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const chatRef = useRef<Chat | null>(null);
    const recognitionRef = useRef<any>(null); // SpeechRecognition instance
    const chatBodyRef = useRef<HTMLDivElement>(null);


    const page = presentation.pages[currentPage];
    const quiz = page?.quiz;

    // Initialize Speech Recognition
    useEffect(() => {
        // FIX: Cast window to any to access browser-specific SpeechRecognition APIs
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'tr-TR';
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(transcript);
                handleSendMessage(transcript); // Automatically send after transcription
            };
        }
    }, []);

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatHistory]);


    const handleQuizSubmit = () => {
        if (quiz && selectedAnswer !== null) {
            const score = selectedAnswer === quiz.correctAnswerIndex ? 100 : 0;
            onUpdateProgress({ presentationScore: score });
            setQuizSubmitted(true);
        }
    };
    
    const handleToggleChat = () => {
        setIsChatOpen(prev => !prev);
    }
    
    const handleVoiceInput = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        } else if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const handleSendMessage = async (messageText: string) => {
        const text = messageText.trim();
        if (!text) return;

        setChatHistory(prev => [...prev, { role: 'user', text }]);
        setUserInput('');
        setIsModelLoading(true);

        try {
            if (!chatRef.current) {
                // FIX: Use process.env.API_KEY as per guidelines
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                chatRef.current = ai.chats.create({
                    model: 'gemini-3-flash-preview',
                    config: {
                        systemInstruction: `You are a friendly and encouraging teaching assistant for primary school children aged 6-12. Your language must be simple, positive, and easy to understand. You must only answer questions related to the provided context from the presentation slide. If the user asks something off-topic, gently guide them back to the topic. All responses must be in TURKISH.`
                    }
                });
            }
            
            const context = `Context from presentation slide: "${page.text}".\n\nUser's question: "${text}"`;
            const response = await chatRef.current.sendMessage({ message: context });
            
            setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);

        } catch (error) {
            console.error("AI chat error:", error);
            setChatHistory(prev => [...prev, { role: 'model', text: "Üzgünüm, bir sorun oluştu. Lütfen tekrar dener misin?" }]);
        } finally {
            setIsModelLoading(false);
        }
    };

    if (progress.presentationScore !== undefined) {
        return (
             <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-800">Sunum Tamamlandı!</h3>
                <p className="text-green-700">Bu bölümden aldığınız puan: <strong>{progress.presentationScore}</strong></p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {page && (
                <div className="p-4 border rounded-lg bg-white shadow-sm">
                    {page.imageUrl && <img src={page.imageUrl} alt={`Sayfa ${page.pageNumber}`} className="w-full max-w-2xl mx-auto rounded-md mb-4" />}
                    <p className="text-lg leading-relaxed text-gray-700">{page.text}</p>
                    {quiz && !quizSubmitted && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <h4 className="font-bold text-gray-800">{quiz.question}</h4>
                            <div className="mt-2 space-y-2">
                                {quiz.options.map((option, index) => (
                                    <label key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100 cursor-pointer">
                                        <input type="radio" name="quiz" value={index} onChange={() => setSelectedAnswer(index)} className="form-radio text-blue-600" />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                            <button onClick={handleQuizSubmit} disabled={selectedAnswer === null} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">Cevapla</button>
                        </div>
                    )}
                     {quiz && quizSubmitted && (
                        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
                            <h4 className="font-bold text-green-800">Test tamamlandı! Puanınız: {progress.presentationScore}</h4>
                        </div>
                     )}
                </div>
            )}
             <div className="flex justify-between items-center pt-4">
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50">Önceki</button>
                <span>Sayfa {currentPage + 1} / {presentation.pages.length}</span>
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === presentation.pages.length - 1} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50">Sonraki</button>
            </div>

             {/* AI Chat Feature */}
            <div className="mt-6">
                <div className="flex justify-center">
                    <button onClick={handleToggleChat} className="bg-purple-600 text-white font-bold py-2 px-5 rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg">
                        {isChatOpen ? 'Sohbeti Kapat' : 'Anlamadığını Sor'}
                    </button>
                </div>
                {isChatOpen && (
                    <div className="mt-4 max-w-2xl mx-auto bg-white border rounded-lg shadow-xl flex flex-col h-96">
                        <div ref={chatBodyRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                           {chatHistory.map((msg, index) => (
                               <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                   <p className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                       {msg.text}
                                   </p>
                               </div>
                           ))}
                           {isModelLoading && (
                               <div className="flex justify-start">
                                    <p className="max-w-xs md:max-w-md p-3 rounded-lg bg-gray-200 text-gray-800 animate-pulse">
                                       Düşünüyorum...
                                   </p>
                               </div>
                           )}
                        </div>
                        <div className="p-2 border-t flex items-center space-x-2 bg-gray-50">
                            <button onClick={handleVoiceInput} className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </button>
                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(userInput); }} className="flex-1 flex space-x-2">
                                <input 
                                    type="text" 
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Sorunu buraya yaz..."
                                    className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isModelLoading}
                                />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:bg-blue-300" disabled={isModelLoading || !userInput}>
                                    Gönder
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PresentationView;
