
export interface Song {
  id: string;
  title: string;
  subject: string;
  url: string;
  createdAt: number;
}

export interface Page {
  id:string;
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface Book {
  id: string;
  title: string;
  coverImageUrl: string;
  level: '1. Sınıf' | '2. Sınıf' | '3. Sınıf' | '4. Sınıf';
  subject: string;
  values: string; // "Değerler"
  genre: string; // "Türü"
  pages: Page[];
  createdAt: number;
}


// Course Structure
export interface Course {
  id: string;
  title: string;
  level: '1. Sınıf' | '2. Sınıf' | '3. Sınıf' | '4. Sınıf';
  description: string;
  coverImageUrl: string;
  sections: CourseSection[];
  createdAt: number;
}

export interface CourseSection {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  presentation: Presentation;
  games: Game[];
  assessment: Assessment;
  activities: Activity[];
}

// Topic Content: Presentation
export interface Quiz {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Presentation {
  type: 'ai' | 'manual';
  aiPrompt?: string;
  pages: PresentationPage[];
}

export interface PresentationPage {
  id: string;
  pageNumber: number;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  audioScript?: string;
  quiz?: Quiz;
}

// Topic Content: Game
export type GameEngineType = 'RACE_ENGINE' | 'HUNT_ENGINE' | 'GUESS_ENGINE' | 'QUIZ_SHOW';

export const gameEngineNames: Record<GameEngineType, string> = {
  RACE_ENGINE: 'Yarış Motoru',
  HUNT_ENGINE: 'Hazine Avı Motoru',
  GUESS_ENGINE: 'Tahmin Motoru',
  QUIZ_SHOW: 'Bilgi Yarışması',
};

export const gameThemes: Record<GameEngineType, { id: string; name: string }[]> = {
    RACE_ENGINE: [
        { id: 'athletics', name: 'Atletizm Yarışı' },
        { id: 'space_race', name: 'Uzay Yarışı' },
        { id: 'car_race', name: 'Motor Yarışı' },
        { id: 'kite_race', name: 'Uçurtma Yarışı' },
    ],
    HUNT_ENGINE: [
        { id: 'museum_hunt', name: 'Müzede Hazine Avı' },
        { id: 'map_hunt', name: 'Harita ile Hazine Avı' },
        { id: 'library_hunt', name: 'Kütüphanede Hazine Avı' },
    ],
    GUESS_ENGINE: [
        { id: 'riddle', name: 'Bilmece' },
        { id: 'whats_this', name: 'Bu Ne?' },
    ],
    QUIZ_SHOW: [
        { id: 'classic_quiz', name: 'Klasik Bilgi Yarışması' },
    ],
};

export interface Game {
  id: string;
  engine: GameEngineType;
  theme: string;
  title: string;
  aiPrompt: string;
  generatedContent?: any;
  isGenerating?: boolean;
}


// Topic Content: Assessment
export interface Assessment {
  type: 'ai' | 'manual' | 'pdf';
  aiPrompt?: string;
  examType?: 'topic_scan' | 'knowledge_application';
  pdfUrl?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'open_ended';
  questionText: string;
  questionImageUrl?: string;
  options?: MultipleChoiceOption[];
  correctOptionId?: string;
}

export interface MultipleChoiceOption {
  id:string;
  text: string;
}

// Topic Content: Activity
export type ActivityType = 'crossword' | 'matching' | 'grouping' | 'ordering' | 'fill_in_the_blanks' | 'reading_comprehension';

export const activityTypeNames: Record<ActivityType, string> = {
  crossword: 'Çengel Bulmaca',
  matching: 'Eşleştirme',
  grouping: 'Gruplama',
  ordering: 'Sıralama',
  fill_in_the_blanks: 'Boşluk Doldurma',
  reading_comprehension: 'Metin Anlama'
};

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  aiPrompt: string;
  generatedContent?: any; // To store AI-generated JSON
  isGenerating?: boolean;
}


// Student Progress Tracking
export interface TopicProgress {
  presentationScore?: number; // out of 100
  activityScore?: number; // out of 100
  gameScores?: { [gameId: string]: number }; // out of 100
  assessmentScore?: number; // out of 100
  isCompleted: boolean;
  coachFeedback?: string;
  coachFeedbackLoading?: boolean;
}

export interface CourseProgress {
  [topicId: string]: TopicProgress;
}

// User Management
export interface User {
  id: string;
  username: string;
  password?: string;
  level: '1. Sınıf' | '2. Sınıf' | '3. Sınıf' | '4. Sınıf';
  createdAt: number;

  // Student-managed profile info for AI personalization
  hobbies?: string;
  skills?: string;
  favoriteSubject?: string;
  favoriteFood?: string;
  favoriteDay?: string;
  favoriteSeason?: string;
  favoriteTeam?: string;
  favoriteSport?: string;
}

// Chat interface
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// Corporate Content
export type CorporatePageName = 'about' | 'privacy' | 'terms' | 'contact' | 'faq' | 'social';

export interface CorporatePageData {
    title: string;
    content: string;
}

export type CorporateContent = {
    [key in CorporatePageName]: CorporatePageData;
};


// General Site Settings
export interface SiteSettings {
    logoUrl: string;
}
