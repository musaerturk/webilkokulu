
import React, { useState } from 'react';

export type MascotType = 'turtle' | 'rabbit' | 'fox' | 'cat' | 'owl';

interface MascotProps {
  type: MascotType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  expression?: 'happy' | 'thinking' | 'talking';
  imageUrl?: string;
}

const Mascot: React.FC<MascotProps> = ({ type, size = 'md', className = '', expression = 'happy', imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56'
  };

  const safeSizeClass = sizeClasses[size] || sizeClasses.md;

  const renderFallbackMascot = () => {
    switch (type) {
      case 'turtle':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full animate-slowPulse">
            <ellipse cx="100" cy="110" rx="70" ry="50" fill="#22c55e" />
            <circle cx="160" cy="100" r="25" fill="#4ade80" />
            <circle cx="170" cy="95" r="4" fill="#064e3b" />
          </svg>
        );
      case 'rabbit':
        return (
          <div className="w-full h-full animate-bounce">
            <img src="https://img.icons8.com/color/512/graduation-cap.png" alt="Zıpzıp" className="w-full h-full object-contain" />
          </div>
        );
      case 'fox':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100 160 L40 100 L160 100 Z" fill="#ef4444" />
            <circle cx="75" cy="90" r="5" fill="black" />
            <circle cx="125" cy="90" r="5" fill="black" />
          </svg>
        );
      case 'cat':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="120" r="55" fill="#818cf8" />
            <circle cx="100" cy="65" r="40" fill="#a5b4fc" />
          </svg>
        );
      case 'owl':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="110" r="65" fill="#4c1d95" />
            <circle cx="75" cy="100" r="22" fill="white" />
            <circle cx="125" cy="100" r="22" fill="white" />
          </svg>
        );
      default:
        return <div className="w-full h-full bg-slate-100 rounded-full"></div>;
    }
  };

  if (imageUrl && !imageError) {
    return (
      <div className={`relative ${safeSizeClass} ${className} flex items-center justify-center overflow-hidden`}>
        <img 
          src={imageUrl} 
          alt="Maskot" 
          className="w-full h-full object-contain" 
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${safeSizeClass} ${className} flex items-center justify-center`}>
      {renderFallbackMascot()}
    </div>
  );
};

export default Mascot;
