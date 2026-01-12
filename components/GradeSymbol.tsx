
import React from 'react';
import { Grade } from '../types';
import { BRAND_PALETTE } from '../constants';

interface GradeSymbolProps {
  grade: Grade;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GradeSymbol: React.FC<GradeSymbolProps> = ({ grade, size = 'md', className = '' }) => {
  const color = BRAND_PALETTE.grades[grade];
  const isSpecial = grade === 'SC';
  const LOGO_URL = "https://raw.githubusercontent.com/Anil-Can/image-storage/main/webilkokulu-logo-new.png";
  
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const textSizes = {
    sm: isSpecial ? 'text-[10px]' : 'text-lg',
    md: isSpecial ? 'text-2xl' : 'text-4xl',
    lg: isSpecial ? 'text-4xl' : 'text-6xl'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Arka Plan: Yeni Kurumsal Logo Filigranı */}
      <div className="absolute inset-0 opacity-10 transform -rotate-6 scale-125">
        <img 
          src={LOGO_URL} 
          className="w-full h-full object-contain"
          alt="marka"
        />
      </div>
      
      {/* Sınıf Numarası Dairesi */}
      <div 
        className="relative z-10 rounded-3xl shadow-lg flex items-center justify-center font-black border-4 border-white transform hover:rotate-3 transition-transform overflow-hidden"
        style={{ 
          backgroundColor: color, 
          color: 'white',
          width: '80%',
          height: '80%',
          boxShadow: `0 10px 25px -5px ${color}44`
        }}
      >
        <span className={textSizes[size]}>{grade}</span>
        <span className={`absolute -bottom-1 -right-1 bg-white rounded-lg px-1.5 py-0.5 font-black uppercase leading-none shadow-sm`} style={{ color: color, fontSize: size === 'lg' ? '12px' : '8px' }}>
          {isSpecial ? 'ÖZEL' : 'SINIF'}
        </span>
      </div>
    </div>
  );
};

export default GradeSymbol;
