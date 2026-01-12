
import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityItem, MascotSettings } from '../types';
import Mascot from './Mascot';

interface ActivityEngineProps {
  activity: Activity;
  onComplete: () => void;
  mascots?: MascotSettings[];
}

const ActivityEngine: React.FC<ActivityEngineProps> = ({ activity, onComplete, mascots }) => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [placedItems, setPlacedItems] = useState<Record<string, ActivityItem[]>>({});
  const [draggedItem, setDraggedItem] = useState<ActivityItem | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Stats & Timers
  const [collectedCount, setCollectedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeStage, setActiveStage] = useState(1);

  const gameMascot = mascots?.find(m => m.role === 'game') || { type: 'cat', name: 'Mırnav', customImageUrl: undefined };

  // Animated Adventure Specific
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeAdventureItems, setActiveAdventureItems] = useState<(ActivityItem & { x: number, y: number })[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (activity.type === 'animated-adventure') {
      const stageItems = activity.items.map((it, idx) => ({
        ...it,
        x: 100 + idx * 40, // Sağ taraftan başlat
        y: 20 + Math.random() * 50 // Rastgele dikey konum
      }));
      setActiveAdventureItems(stageItems);
      setTimer(0);
      startTimer();
      startAnimation();
    } else if (activity.type === 'sequence-collector') {
      const stageItems = activity.items.filter(it => !activity.config?.stages || (it.order && it.order > (activeStage - 1) * 5 && it.order <= activeStage * 5) || !it.order);
      setItems([...stageItems].sort(() => Math.random() - 0.5));
      setCollectedCount(0);
      if (activeStage === 1) setTimer(0);
      startTimer();
    } else {
      setItems([...activity.items].sort(() => Math.random() - 0.5));
    }
    setIsFinished(false);
    return () => { stopTimer(); stopAnimation(); };
  }, [activity, activeStage]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startAnimation = () => {
    const animate = () => {
      setScrollOffset(prev => (prev + 0.5) % 100);
      setActiveAdventureItems(prev => 
        prev.map(it => ({ ...it, x: it.x - 0.15 })) // Nesneler sağdan sola aksın
            .filter(it => it.x > -20) // Ekrandan çıkanı temizle (opsiyonel: tekrar sona ekle)
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleCollect = (item: ActivityItem) => {
    const correctItems = activity.items.filter(it => it.isCorrect).sort((a, b) => (a.order || 0) - (b.order || 0));
    const nextCorrectItem = correctItems[collectedCount];

    if (item.id === nextCorrectItem?.id) {
      setCollectedCount(prev => prev + 1);
      if (activity.type === 'animated-adventure') {
        setActiveAdventureItems(prev => prev.filter(i => i.id !== item.id));
      } else {
        setItems(prev => prev.filter(i => i.id !== item.id));
      }
      setFeedback({ msg: 'SÜPER! 🎯', type: 'success' });
      
      if (collectedCount + 1 >= correctItems.length) {
        stopTimer();
        stopAnimation();
        setIsFinished(true);
      }
    } else {
      setFeedback({ msg: item.isCorrect ? 'YANLIŞ SIRA!' : 'DIKKAT, ENGEL! ⚠️', type: 'error' });
    }
    setTimeout(() => setFeedback(null), 1000);
  };

  const getThemeStyles = () => {
    const theme = activity.config?.animationTheme || 'forest';
    switch (theme) {
      case 'space':
        return {
          bg: "bg-slate-950",
          layer1: "https://raw.githubusercontent.com/Anil-Can/image-storage/main/space-bg-layer.png",
          character: "🚀",
          itemShadow: "drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        };
      case 'track':
        return {
          bg: "bg-orange-100",
          layer1: "https://raw.githubusercontent.com/Anil-Can/image-storage/main/track-lines.png",
          character: "🏃",
          itemShadow: "drop-shadow-lg"
        };
      case 'ocean':
        return {
          bg: "bg-blue-600",
          layer1: "https://raw.githubusercontent.com/Anil-Can/image-storage/main/ocean-bubbles.png",
          character: "🐠",
          itemShadow: "drop-shadow-md"
        };
      default: // forest
        return {
          bg: "bg-emerald-400",
          layer1: "https://raw.githubusercontent.com/Anil-Can/image-storage/main/cartoon-forest-layer.png",
          character: "🚶",
          itemShadow: "drop-shadow-xl"
        };
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-20 animate-bounceIn">
        <Mascot type={gameMascot.type as any} size="lg" imageUrl={gameMascot.customImageUrl} className="mx-auto mb-6" />
        <h3 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tighter">MACERA TAMAMLANDI!</h3>
        <p className="text-slate-400 font-bold mb-8 text-xl">Skorun: {collectedCount * 10} Puan | Süren: {timer}s</p>
        <button onClick={onComplete} className="bg-indigo-600 text-white px-16 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 transition-all">
          Ödüle Git
        </button>
      </div>
    );
  }

  const theme = getThemeStyles();

  return (
    <div className="relative overflow-hidden rounded-[4rem] shadow-2xl border-8 border-white">
      {feedback && (
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 px-10 py-5 rounded-3xl shadow-2xl z-[100] animate-bounce ${feedback.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          <span className="font-black text-xl uppercase tracking-widest">{feedback.msg}</span>
        </div>
      )}

      {activity.type === 'animated-adventure' ? (
        <div className={`relative h-[500px] w-full ${theme.bg} overflow-hidden`}>
          {/* Parallax Background Layers */}
          <div 
            className="absolute inset-0 opacity-30 transition-transform duration-0 ease-linear"
            style={{ 
              backgroundImage: `url(${theme.layer1})`, 
              backgroundSize: 'cover',
              transform: `translateX(-${scrollOffset}%)` 
            }}
          ></div>
          <div 
            className="absolute inset-0 opacity-30 transition-transform duration-0 ease-linear"
            style={{ 
              backgroundImage: `url(${theme.layer1})`, 
              backgroundSize: 'cover',
              transform: `translateX(${100 - scrollOffset}%)` 
            }}
          ></div>

          {/* Stats Overlay */}
          <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
             <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl font-black text-slate-800 shadow-xl border border-white">
                ⏱️ {timer}s
             </div>
             <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl font-black text-slate-800 shadow-xl border border-white">
                🌟 {collectedCount} / {activity.items.filter(i=>i.isCorrect).length}
             </div>
          </div>

          {/* Character */}
          <div className="absolute left-[15%] bottom-[20%] z-30 pointer-events-none">
             <div className="scale-125">
                <Mascot type={gameMascot.type as any} size="sm" imageUrl={gameMascot.customImageUrl} />
             </div>
             <div className="w-16 h-4 bg-black/20 rounded-full mx-auto blur-md mt-2"></div>
          </div>

          {/* Moving Adventure Items */}
          {activeAdventureItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleCollect(item)}
              className={`absolute z-40 flex flex-col items-center gap-2 group transition-transform hover:scale-125`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <div className={`relative ${theme.itemShadow}`}>
                <img 
                   src={item.imageUrl || 'https://img.icons8.com/clouds/200/star.png'} 
                   className="w-20 h-20 object-contain"
                   alt="item"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="bg-white/90 px-3 py-1 rounded-xl font-black text-xl text-slate-900 border-2 border-slate-100 shadow-sm">
                      {item.content}
                   </span>
                </div>
              </div>
            </button>
          ))}

          {/* Bottom HUD */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-[2rem] text-center z-10">
             <p className="text-white font-black text-xs uppercase tracking-widest">{activity.instruction}</p>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-slate-50 min-h-[500px]">
           <p className="text-center py-20 font-black text-slate-400">Klasik Oyun Modu: {activity.type}</p>
        </div>
      )}
    </div>
  );
};

export default ActivityEngine;
