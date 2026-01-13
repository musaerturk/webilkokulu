
export type Grade = 1 | 2 | 3 | 4 | 'SC';

// Subject artık dinamik olarak genişletilebilir
export type Subject = string;

// SubjectStyle interface added to fix import errors in App.tsx and AdminSubjectManagement.tsx
export interface SubjectStyle {
  color: string;
  icon: string;
  coverImage: string;
  gradient: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  date: string;
  description: string;
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

export interface CloudStorageConfig {
  provider: 'none' | 'firebase';
  apiKey?: string;
  projectId?: string;
  storageBucket?: string;
  appId?: string;
}

export interface SiteSettings {
  logoUrl: string;
  slogan: string;
  footerDescription: string;
  contactEmail: string;
  contactPhone: string;
  aboutUs: string;
  privacyPolicy: string;
  termsOfUse: string;
  faq: FAQItem[];
  socialMedia: {
    instagram: string;
    youtube: string;
    twitter: string;
  };
  storageConfig: CloudStorageConfig;
}

export type MascotRole = 'presentation' | 'game' | 'assessment' | 'coach' | 'wisdom' | 'calculator';
export type MascotType = 'turtle' | 'rabbit' | 'fox' | 'cat' | 'owl';

export interface MascotSettings {
  role: MascotRole;
  type: MascotType;
  name: string;
  customImageUrl?: string;
}

export interface PresentationStep {
  id: string;
  title: string;
  content: string;
  icon: string;
  color: string;
  imageUrl?: string;
  audioUrl?: string;
  audioScript?: string;
  videoUrl?: string;
}

export type ActivityType = 'sorting' | 'sequence-collector' | 'animated-adventure';

export interface ActivityItem {
  id: string;
  content: string;
  targetCategory?: string;
  isCorrect?: boolean;
  order?: number;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  instruction: string;
  prompt?: string;
  referenceImages?: string[];
  items: ActivityItem[];
  categories?: string[];
  config?: any;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  imageUrl?: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'multiple-choice' | 'mixed';
  questions: Question[];
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

export interface BookPage {
  id: string;
  content: string;
  imageUrl?: string;
}

export interface Assessment5N1K {
  who: string;
  what: string;
  where: string;
  when: string;
  why: string;
  how: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  grade: Grade;
  summary: string;
  pages: BookPage[];
  values?: string[];
  assessment?: {
    questions: Question[];
  };
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

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  grade: Grade;
  assignedSubject?: Subject;
  role: 'student' | 'admin';
  status: 'active' | 'suspended';
  points: number;
  badges: Badge[];
  joinDate: string;
  interests?: string[];
  team?: string;
  sports?: string[];
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
}

export interface StudyPlan {
  analysis: string;
  dailyTasks: { day: string; task: string }[];
  motivationalQuote: string;
  teacherNote: string;
}
