
import React from 'react';
import { Grade, Subject, Unit, Book } from './types';

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

export const GRADE_SUBJECTS: Record<Grade, Subject[]> = {
  1: ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'Okuma Yazma'],
  2: ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'İngilizce'],
  3: ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'İngilizce', 'Fen Bilimleri'],
  4: ['Türkçe', 'Matematik', 'Sosyal Bilgiler', 'İngilizce', 'Fen Bilimleri'],
  'SC': ['Sesten Cümleye']
};

export const SUBJECT_ICONS: Record<Subject, React.ReactNode> = {
  'Türkçe': <i className="fas fa-book text-blue-500"></i>,
  'Matematik': <i className="fas fa-calculator text-red-500"></i>,
  'Hayat Bilgisi': <i className="fas fa-leaf text-green-500"></i>,
  'İngilizce': <i className="fas fa-language text-purple-500"></i>,
  'Fen Bilimleri': <i className="fas fa-flask text-orange-500"></i>,
  'Sosyal Bilgiler': <i className="fas fa-globe text-indigo-500"></i>,
  'Okuma Yazma': <i className="fas fa-pencil-alt text-pink-500"></i>,
  'Sesten Cümleye': <i className="fas fa-volume-up text-fuchsia-500"></i>
};

export const MOCK_UNITS: Record<string, Unit[]> = {
  '2-Matematik': [
    {
      id: 'MAT.2.1',
      title: 'Ünite 1: SAYILAR VE İŞLEMLER (SAYI AVI)',
      topics: [
        {
          id: 'MAT.2.1.1',
          title: 'Nesne Sayılarını Belirleyelim',
          presentationSteps: [
            { id: 's1', title: 'Kaç Tane Var? 🍎', icon: 'fa-apple-whole', color: 'bg-red-500', content: 'Etrafındaki nesneleri saymaya hazır mısın? 100’e kadar olan sayıları artık çok iyi biliyoruz!' },
            { id: 's2', title: 'Onluk ve Birlik Evi 🏠', icon: 'fa-home', color: 'bg-blue-500', content: 'Sayılar evlerinde gruplanır. 10 tane bir araya gelince kocaman bir Onluk olur!' }
          ],
          activities: [],
          assessment: { id: 'quiz-2.1.1', questions: [{ id: 'q1', text: "2 onluk ve 5 birlikten oluşan sayı hangisidir?", options: ["25", "52", "20"], correctAnswer: 0, topic: "Onluk Birlik" }] }
        }
      ]
    }
  ],
  '3-Fen Bilimleri': [
    {
      id: 'FB.3.1',
      title: 'Ünite 1: GEZEGENİMİZİ TANIYALIM (BİLİMSEL KEŞİF)',
      topics: [
        {
          id: 'FB.3.1.1',
          title: 'Dünya’nın Şekli ve Yapısı',
          presentationSteps: [
            { id: 's1', title: 'Dünya Bir Portakal mı? 🍊', icon: 'fa-earth-americas', color: 'bg-indigo-500', content: 'Dünya’nın şeklinin küreye benzediğini biliyor muydun? Eskiden insanlar Dünya’nın düz olduğuna inanırdı!' },
            { id: 's2', title: 'Katman Katman Dünya 🌍', icon: 'fa-layer-group', color: 'bg-blue-500', content: 'Dünya’mız tıpkı bir şeftali gibi katmanlardan oluşur: Hava katmanı, su katmanı ve yer kabuğu!' }
          ],
          activities: [{
            id: 'act-3.1.1',
            type: 'sorting',
            instruction: "Katmanları dıştan içe sırala!",
            categories: ["Hava Katmanı", "Su Katmanı", "Kara Katmanı"],
            items: [
              { id: 'i1', content: "Atmosfer", targetCategory: "Hava Katmanı" },
              { id: 'i2', content: "Okyanuslar", targetCategory: "Su Katmanı" },
              { id: 'i3', content: "Dağlar", targetCategory: "Kara Katmanı" }
            ]
          }],
          assessment: { 
            id: 'quiz-3.1.1', 
            questions: [
              { id: 'q1', text: "Dünya'nın şekli aşağıdakilerin hangisine benzer?", options: ["Küp", "Küre", "Daire"], correctAnswer: 1, topic: "Dünya Şekli" }
            ]
          }
        }
      ]
    }
  ],
  'SC-Sesten Cümleye': [
    {
      id: 'SC-U1',
      title: 'Grup 1: ANETİL SESLERİ',
      topics: [
        { 
          id: 'SC-A', title: 'A Sesi', 
          presentationSteps: [{ id: 'sa1', title: 'A Sesi ile Tanışalım', icon: 'fa-font', color: 'bg-pink-500', content: 'Aaaa! Bak ne kadar kolay söyleniyor. Elma derken, Araba derken en başta A sesini duyuyoruz!' }],
          activities: [], assessment: { id: 'as-a', questions: [] } 
        }
      ]
    }
  ]
};
