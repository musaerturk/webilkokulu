
export type PanelType = 'HOME' | 'ADMIN' | 'USER' | 'INFO';
export type InfoPageType = 'ABOUT' | 'CONTACT' | 'CAREER' | 'FAQ' | 'PRIVACY' | 'TERMS';

export interface Category {
  id: string;
  name: string;
  image: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  image: string;
}

export interface Course {
  id: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  description: string;
  image: string;
  info: string;
}

export interface Section {
  id: string;
  courseId: string;
  name: string;
  order: number;
}

export interface Slide {
  text: string;
  imageUrl: string;
}

export interface Question {
  type: 'OPEN' | 'MULTIPLE';
  category: 'CONCEPT' | 'SKILL';
  text: string;
  options?: string[];
  correctAnswer: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
}

export interface Subject {
  id: string;
  courseId: string;
  sectionId?: string; // Hangi bölüme ait olduğu
  name: string;
  presentation: {
    slides: Slide[];
  };
  game: {
    managerInstructions: string;
    gameConfig: any;
  };
  assessment: {
    questions: Question[];
    outcomes: string;
  };
  analysis?: {
    performanceScore: number;
    aiFeedback: string;
    completedAt?: string;
  };
}

export interface Story {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  createdAt: string;
}

export interface Music {
  id: string;
  title: string;
  subject: string;
  artist: string;
  url: string;
}

export interface UserProfile {
  name: string;
  interests: string[];
  photo: string;
  bio: string;
}

export interface ScheduleEntry {
  id: string;
  day: string;
  time: string;
  activity: string;
  hasAlarm: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  type: 'Ödev' | 'Proje' | 'Performans';
  dueDate: string;
  completed: boolean;
  hasAlarm: boolean;
}

export interface DailyTask {
  id: string;
  time: string;
  task: string;
  completed: boolean;
  hasAlarm: boolean;
}

export interface UnitProgress {
  subjectId: string;
  subjectName: string;
  progress: number; // 0-100 (Sunum, Oyun, Ölçme tamamlanma oranı)
}

export interface UserCourseProgress {
  courseId: string;
  courseName: string;
  totalProgress: number; // 0-100
  units: UnitProgress[];
  lastAccessed: string;
}

export interface TopicComment {
  id: string;
  subjectId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: string;
  type: 'QUESTION' | 'COMMENT';
}

export interface SiteSettings {
  appearance: {
    primaryColor: string;
    logo: string;
  };
  faq: { question: string; answer: string }[];
  corporate: { about: string; contact: string };
  cloud: { apiKey: string; projectId: string };
}
