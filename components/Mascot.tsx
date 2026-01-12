
import React from 'react';

export type MascotType = 'turtle' | 'rabbit' | 'fox' | 'cat' | 'owl';

interface MascotProps {
  type: MascotType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  expression?: 'happy' | 'thinking' | 'talking';
  imageUrl?: string;
}

const Mascot: React.FC<MascotProps> = ({ type, size = 'md', className = '', expression = 'happy', imageUrl }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56'
  };

  if (imageUrl) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <img src={imageUrl} alt="Maskot" className="w-full h-full object-contain" />
        {expression === 'talking' && (
          <div className="absolute -top-4 -right-2 flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>
    );
  }

  const renderMascot = () => {
    switch (type) {
      case 'turtle': // Bilge Kaplumbağa (Tonti)
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full animate-slowPulse">
            <ellipse cx="100" cy="110" rx="70" ry="50" fill="#22c55e" />
            <path d="M50 110 Q100 60 150 110" fill="none" stroke="#15803d" strokeWidth="8" strokeLinecap="round" />
            <circle cx="160" cy="100" r="25" fill="#4ade80" />
            <circle cx="170" cy="95" r="4" fill="#064e3b" />
            <path d="M165 110 Q175 115 170 105" fill="none" stroke="#064e3b" strokeWidth="2" />
            <rect x="60" y="150" width="15" height="25" rx="5" fill="#4ade80" />
            <rect x="125" y="150" width="15" height="25" rx="5" fill="#4ade80" />
          </svg>
        );
      case 'rabbit': // Yeni Mezun Zıpzıp
        return (
          <div className="w-full h-full animate-bounce">
            <img 
              src="https://raw.githubusercontent.com/Anil-Can/image-storage/main/mascot-rabbit-grad.png" 
              alt="Mezun Zıpzıp" 
              className="w-full h-full object-contain drop-shadow-2xl"
              style={{ filter: className.includes('grayscale') ? 'grayscale(1)' : 'none' }}
              onError={(e) => {
                e.currentTarget.src = "https://img.icons8.com/color/512/graduation-cap.png";
              }}
            />
          </div>
        );
      case 'fox': // Zeki Tilki (Fikir)
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100 160 L40 100 L160 100 Z" fill="#ef4444" />
            <path d="M100 50 L160 110 L40 110 Z" fill="#f87171" />
            <path d="M40 110 L30 80 L60 100 Z" fill="#ef4444" />
            <path d="M160 110 L170 80 L140 100 Z" fill="#ef4444" />
            <circle cx="75" cy="90" r="5" fill="black" />
            <circle cx="125" cy="90" r="5" fill="black" />
            <path d="M100 110 L90 100 L110 100 Z" fill="black" />
            <path d="M100 160 Q140 180 180 140" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" className="animate-wiggle" />
          </svg>
        );
      case 'cat': // Meraklı Kedi (Mırnav)
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="120" r="55" fill="#818cf8" />
            <circle cx="100" cy="65" r="40" fill="#a5b4fc" />
            <path d="M65 40 L60 10 L90 40 Z" fill="#818cf8" />
            <path d="M135 40 L140 10 L110 40 Z" fill="#818cf8" />
            <circle cx="85" cy="60" r="4" fill="#1e1b4b" />
            <circle cx="115" cy="60" r="4" fill="#1e1b4b" />
            <path d="M100 75 L95 70 L105 70 Z" fill="#f472b6" />
            <path d="M145 130 Q180 140 170 100" fill="none" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" className="animate-wiggle" />
          </svg>
        );
      case 'owl': // Bilge Baykuş (BİLKUŞ)
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="110" r="65" fill="#4c1d95" />
            <path d="M60 60 L80 90 L40 90 Z" fill="#4c1d95" />
            <path d="M140 60 L120 90 L160 90 Z" fill="#4c1d95" />
            <circle cx="75" cy="100" r="22" fill="white" />
            <circle cx="125" cy="100" r="22" fill="white" />
            <circle cx="75" cy="100" r="10" fill="black" />
            <circle cx="125" cy="100" r="10" fill="black" />
            <path d="M100 120 L90 110 L110 110 Z" fill="#f59e0b" />
            <path d="M100 175 L90 165 L110 165" fill="none" stroke="#f59e0b" strokeWidth="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {renderMascot()}
      {expression === 'talking' && (
        <div className="absolute -top-4 -right-2 flex gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  );
};

export default Mascot;
