
import React, { useState, useEffect, useRef } from 'react';
import Mascot from './Mascot';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { QuizResult, MascotSettings } from '../types';

interface BilkusWorkspaceProps {
  result: QuizResult;
  onBack: () => void;
  mascots?: MascotSettings[];
}

const BilkusWorkspace: React.FC<BilkusWorkspaceProps> = ({ result, onBack, mascots }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const bilkusMascot = mascots?.find(m => m.role === 'wisdom') || { type: 'owl', name: 'Bilkuş', customImageUrl: undefined };

  useEffect(() => {
    const initChat = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Sen ${bilkusMascot.name} adında bilge bir baykuşsun. 6-12 yaş grubundaki ilkokul öğrencilerine eğitim desteği veriyorsun.
          Öğrencinin son girdiği sınav konusu: ${result.topicTitle}. 
          Öğrencinin eksik kaldığı noktalar: ${result.wrongTopics.join(', ')}.
          Senin görevin bu eksikleri pedagojik, eğlenceli ve çocukların anlayacağı sade bir dille açıklamak.
          Sorular sorarak öğrencinin öğrenip öğrenmediğini kontrol et. 
          Asla uzun ve sıkıcı paragraflar yazma. 
          Emojiler kullan. Samimi ve teşvik edici ol.
          Kendini '${bilkusMascot.name}' olarak tanıt.`,
        },
      });
      chatRef.current = chat;
      
      setIsTyping(true);
      const initialMessage = await chat.sendMessage({ message: `Merhaba ${bilkusMascot.name}, sınavımdaki eksiklerim hakkında bana yardımcı olur musun? Nereden başlayalım?` });
      setMessages([{ role: 'model', text: initialMessage.text || '' }]);
      setIsTyping(false);
    };

    initChat();
  }, [result]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
    } catch (error) {
      console.error("Bilkus Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `Huuu! Bir anlık bağlantım koptu bilge dostum. Tekrar söyler misin?` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-indigo-900 rounded-[3rem] shadow-2xl border-8 border-indigo-700 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-indigo-800 p-6 flex items-center justify-between border-b border-indigo-700">
        <div className="flex items-center gap-4">
          <Mascot type={bilkusMascot.type as any} size="sm" imageUrl={bilkusMascot.customImageUrl} className="bg-indigo-700 p-2 rounded-2xl" />
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">{bilkusMascot.name} Bilgelik Odası</h2>
            <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Seninle öğrenmek çok keyifli!</p>
          </div>
        </div>
        <button onClick={onBack} className="bg-indigo-700 text-white w-10 h-10 rounded-full hover:bg-indigo-600 flex items-center justify-center transition-all">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-6 no-scrollbar bg-indigo-950/50"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}>
            <div className={`max-w-[80%] p-6 rounded-[2rem] ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white text-indigo-900 rounded-tl-none border-b-4 border-indigo-200'
            }`}>
              {msg.role === 'model' && <div className="text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-widest">{bilkusMascot.name} Diyor ki:</div>}
              <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-indigo-800 p-4 rounded-3xl rounded-tl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-indigo-800 border-t border-indigo-700">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Aklına takılanları buraya yaz bilge dostum..."
            className="flex-1 bg-indigo-950 text-white p-5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500 font-bold transition-all placeholder:text-indigo-700"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="bg-orange-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            <i className="fas fa-paper-plane text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BilkusWorkspace;
