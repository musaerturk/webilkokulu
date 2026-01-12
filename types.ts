
export type Grade = 1 | 2 | 3 | 4 | 'SC';

export type Subject = 
  | 'Türkçe' 
  | 'Matematik' 
  | 'Hayat Bilgisi' 
  | 'İngilizce' 
  | 'Fen Bilimleri' 
  | 'Sosyal Bilgiler'
  | 'Okuma Yazma'
  | 'Sesten Cümleye';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CloudStorageConfig {
  provider: 'none' | 'firebase';
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface SiteSettings {
  logoUrl: string;
  footerDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    instagram: string;
    youtube: string;
    twitter: string;
  };
  aboutUs: string;
  privacyPolicy: string;
  termsOfUse: string;
  faq: FAQItem[];
  storageConfig: CloudStorageConfig;
}

export type MascotRole = 'presentation' | 'game' | 'assessment' | 'coach' | 'wisdom';
export type MascotType = 'turtle' | 'rabbit' | 'fox' | 'cat' | 'owl';

export interface MascotSettings {
  role: MascotRole;
  type: MascotType;
  name: string;
  customImageUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  date: string;
  imageUrl?: string;
}

export interface RankDefinition {
  id: string;
  title: string;
  minPoints: number;
  imageUrl?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: Grade;
  role: 'student' | 'admin';
  badges: Badge[];
  joinDate: string;
  password?: string;
  points?: number;
  interests?: string[];
  team?: string;
  sports?: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  imageUrl?: string;
  aiFeedback?: string;
}

export interface Assessment {
  id: string;
  questions: Question[];
  openEndedQuestions?: string[];
}

export interface PresentationStep {
  id: string;
  title: string;
  icon: string;
  content: string;
  color: string;
  imageUrl?: string;
  audioUrl?: string; 
  videoUrl?: string;
}

export type ActivityType = 
  | 'matching' | 'sorting' | 'sequencing' | 'gap-fill' 
  | 'true-false' | 'crossword' | 'word-search' 
  | 'animated-adventure';

export interface ActivityItem {
  id: string;
  content: string; 
  targetCategory: string; 
  imageUrl?: string;
  hint?: string;
  order?: number; 
  isCorrect?: boolean;
}

export interface Activity {
  id: string;
  type: ActivityType;
  instruction: string;
  categories: string[];
  items: ActivityItem[];
  config?: {
    timer?: boolean;
    stages?: number;
    theme?: string;
    animationTheme?: 'space' | 'forest' | 'track' | 'ocean';
    character?: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  coverImage?: string;
  infographicUrl?: string;
  presentationSteps: PresentationStep[];
  activities: Activity[]; 
  assessment: Assessment;
  extraAssessments?: {
    openEnded?: string[];
  };
}

export interface Unit {
  id: string;
  title: string;
  coverImage?: string;
  topics: Topic[];
}

export interface QuizResult {
  assessmentId: string;
  score: number;
  wrongTopics: string[];
  totalQuestions: number;
  grade: Grade;
  subject: Subject;
  topicTitle: string;
  date: string;
  timeSpent?: number;
}

export interface BookPage {
  id: string;
  content: string;
  imageUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  grade: Grade;
  summary: string;
  pages: BookPage[];
  keywords?: string[];
  values?: string[];
  topics?: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl?: string;
  youtubeUrl?: string;
  topics: string[];
  grade: Grade;
}

export interface StudyPlan {
  analysis: string;
  dailyTasks: {
    day: string;
    task: string;
  }[];
  motivationalQuote: string;
  teacherNote: string;
}

export interface Assessment5N1K {
  who: string;
  what: string;
  where: string;
  when: string;
  why: string;
  how: string;
}
