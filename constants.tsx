
import React from 'react';
import { Grade, Subject, Unit, Book, SubjectStyle } from './types';

export const BRAND_PALETTE = {
  grades: {
    1: '#38bdf8',
    2: '#6366f1',
    3: '#1d4ed8',
    4: '#172554',
    'SC': '#d946ef'
  },
  mascots: {
    turtle: '#10b981', 
    rabbit: '#f97316', 
    fox: '#e11d48',    
    cat: '#8b5cf6',
    owl: '#4c1d95'
  },
  ui: {
    background: '#f0f9ff',
    white: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b'
  }
};

export const INITIAL_SUBJECT_CONFIG: Record<Subject, SubjectStyle> = {
  'Türkçe': {
    color: '#0ea5e9',
    icon: 'fa-book-open-reader',
    gradient: 'from-sky-400 to-blue-600',
    coverImage: 'https://images.unsplash.com/photo-1544411047-c491584222f0?q=80&w=800&auto=format&fit=crop'
  },
  'Matematik': {
    color: '#ef4444',
    icon: 'fa-calculator',
    gradient: 'from-red-400 to-rose-600',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop'
  },
  'Hayat Bilgisi': {
    color: '#10b981',
    icon: 'fa-leaf',
    gradient: 'from-emerald-400 to-green-600',
    coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop'
  },
  'Fen Bilimleri': {
    color: '#f59e0b',
    icon: 'fa-flask-vial',
    gradient: 'from-amber-400 to-orange-600',
    coverImage: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=800&auto=format&fit=crop'
  },
  'Sosyal Bilgiler': {
    color: '#4f46e5',
    icon: 'fa-earth-europe',
    gradient: 'from-indigo-400 to-blue-800',
    coverImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop'
  },
  'İngilizce': {
    color: '#8b5cf6',
    icon: 'fa-language',
    gradient: 'from-violet-400 to-purple-700',
    coverImage: 'https://images.unsplash.com/photo-1543167653-412760f38b2b?q=80&w=800&auto=format&fit=crop'
  },
  'Okuma Yazma': {
    color: '#d946ef',
    icon: 'fa-pencil-alt',
    gradient: 'from-fuchsia-400 to-pink-600',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop'
  },
  'Sesten Cümleye': {
    color: '#f43f5e',
    icon: 'fa-volume-up',
    gradient: 'from-rose-400 to-fuchsia-600',
    coverImage: 'https://images.unsplash.com/photo-1485546246426-74dc38c3f501?q=80&w=800&auto=format&fit=crop'
  }
};

export const INITIAL_GRADE_SUBJECTS: Record<Grade, Subject[]> = {
  1: ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'Okuma Yazma'],
  2: ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'İngilizce'],
  3: ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'İngilizce', 'Fen Bilimleri'],
  4: ['Türkçe', 'Matematik', 'Sosyal Bilgiler', 'İngilizce', 'Fen Bilimleri'],
  'SC': ['Sesten Cümleye']
};

export const MOCK_BOOKS: Book[] = [
  {
    id: 'B1',
    title: 'Küçük Tohumun Yolculuğu',
    author: 'Bilge Kaplumbağa',
    coverImage: 'https://images.unsplash.com/photo-1592150621344-78439b73405b?q=80&w=800&auto=format&fit=crop',
    grade: 2,
    summary: "Bir ilkbahar günü ormanda küçük bir tohumun rüzgarla uçup dere kenarına düşmesini ve orada bir çınar ağacına dönüşmesini anlatır.",
    pages: [
      { id: 'p1', content: "Bir varmış, bir yokmuş. Güneşin pırıl pırıl parladığı bir ilkbahar sabahıymış. Küçük bir tohum, rüzgar amcanın yardımıyla gökyüzünde süzülmeye başlamış.", imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop' },
      { id: 'p2', content: "Tohum, 'Acaba nereye gideceğim?' diye merak ediyormuş. Rüzgar onu yemyeşil bir vadinin içinden geçiren serin bir dere kenarına usulca bırakmış.", imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop' },
      { id: 'p3', content: "Toprak ana onu sevgiyle kucaklamış. Bir süre sonra yağmurlar yağmış, güneş onu ısıtmış. Küçük tohum yavaş yavaş filizlenmiş ve kocaman bir çınar ağacı olmuş.", imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop' }
    ]
  }
];

const createMockAssessment = (id: string, title: string): any => ({
  id,
  title,
  type: 'multiple-choice',
  questions: [
    { id: `q-${id}-1`, text: "Konuyla ilgili temel bir soru?", options: ["A Şıkkı", "B Şıkkı", "C Şıkkı"], correctAnswer: 0, topic: title }
  ]
});

export const MOCK_UNITS: Record<string, Unit[]> = {
  '1-Türkçe': [{ id: 'TR1', title: 'Ünite 1: Okuma Sevinci', topics: [{ id: 'TR1T1', title: 'Harfleri Tanıyalım', presentationSteps: [], activities: [], assessment: createMockAssessment('tr1t1a', 'Harf Testi') }] }],
  '1-Matematik': [{ id: 'MAT1', title: 'Ünite 1: Uzamsal İlişkiler', topics: [{ id: 'MAT1T1', title: 'Altında - Üstünde', presentationSteps: [], activities: [], assessment: createMockAssessment('mat1t1a', 'Konum Testi') }] }],
  '2-Matematik': [
    {
      id: 'MAT.2.1',
      title: 'Ünite 1: SAYILAR VE İŞLEMLER',
      topics: [
        {
          id: 'MAT.2.1.1',
          title: 'Nesne Sayılarını Belirleyelim',
          presentationSteps: [
            { id: 's1', title: 'Kaç Tane Var? 🍎', icon: 'fa-apple-whole', color: 'bg-red-500', content: 'Etrafındaki nesneleri saymaya hazır mısın?' },
            { id: 's2', title: 'Onluk ve Birlik Evi 🏠', icon: 'fa-home', color: 'bg-blue-500', content: '10 tane bir araya gelince kocaman bir Onluk olur!' }
          ],
          activities: [],
          assessment: createMockAssessment('quiz-2.1.1', 'Sayı Avı Testi')
        }
      ]
    }
  ],
  '3-Fen Bilimleri': [
    {
      id: 'FB.3.1',
      title: 'Ünite 1: GEZEGENİMİZİ TANIYALIM',
      topics: [
        {
          id: 'FB.3.1.1',
          title: 'Dünya’nın Şekli ve Yapısı',
          presentationSteps: [
            { id: 's1', title: 'Dünya Bir Portakal mı? 🍊', icon: 'fa-earth-americas', color: 'bg-indigo-500', content: 'Dünya’nın şeklinin küreye benzediğini biliyor muydun?' }
          ],
          activities: [],
          assessment: createMockAssessment('quiz-3.1.1', 'Dünya Yapısı Testi')
        }
      ]
    }
  ],
  '4-Sosyal Bilgiler': [{ id: 'SB4', title: 'Ünite 1: Herkesin Bir Kimliği Var', topics: [{ id: 'SB4T1', title: 'Resmî Kimlik Belgemiz', presentationSteps: [], activities: [], assessment: createMockAssessment('sb4t1a', 'Kimlik Testi') }] }],
  'SC-Sesten Cümleye': [
    {
      id: 'SC-U1',
      title: 'Grup 1: ANETİL SESLERİ',
      topics: [
        { 
          id: 'SC-A', title: 'A Sesi', 
          presentationSteps: [{ id: 'sa1', title: 'A Sesi ile Tanışalım', icon: 'fa-font', color: 'bg-pink-500', content: 'Aaaa! Bak ne kadar kolay söyleniyor.' }],
          activities: [], 
          assessment: createMockAssessment('as-a', 'A Sesi Testi')
        }
      ]
    }
  ]
};
