
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    orderBy, 
    query,
    setDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Song, Book, Course, User, CorporateContent, CorporatePageName, CorporatePageData, SiteSettings } from '../types';

// --- COLLECTIONS ---
const songsCollection = collection(db, 'songs');
const booksCollection = collection(db, 'books');
const coursesCollection = collection(db, 'courses');
const usersCollection = collection(db, 'users');

// --- CORPORATE & SITE SETTINGS ---
const corporateContentDoc = doc(db, 'settings', 'corporateContent');
const siteSettingsDoc = doc(db, 'settings', 'siteSettings');

export const getCorporateContent = async (): Promise<CorporateContent> => {
    const docSnap = await getDoc(corporateContentDoc);
    if (docSnap.exists()) {
        return docSnap.data() as CorporateContent;
    } else {
        // If it doesn't exist, create it with initial data (optional)
        const initialContent: CorporateContent = { /* your initial data here */ about: {title: "Hakkımızda", content: ""}, privacy: {title: "Gizlilik", content: ""}, terms: {title: "Kullanım Şartları", content: ""}, contact: {title: "İletişim", content: ""}, faq: {title: "SSS", content: ""}, social: {title: "Sosyal Medya", content: ""}};
        await setDoc(corporateContentDoc, initialContent);
        return initialContent;
    }
};

export const updateCorporateContent = async (pageName: CorporatePageName, data: CorporatePageData): Promise<void> => {
    await updateDoc(corporateContentDoc, { [pageName]: data });
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
    const docSnap = await getDoc(siteSettingsDoc);
    if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
    } else {
        const initialSettings: SiteSettings = { logoUrl: '' };
        await setDoc(siteSettingsDoc, initialSettings);
        return initialSettings;
    }
};

export const updateSiteSettings = async (updates: Partial<SiteSettings>): Promise<void> => {
    await setDoc(siteSettingsDoc, updates, { merge: true });
};

// NOTE: Real password management should use Firebase Authentication. This is a placeholder.
export const updateAdminPassword = async (oldPass: string, newPass: string): Promise<{success: boolean; message: string}> => {
    if (oldPass !== '12345') { // This check remains a mock.
        return { success: false, message: 'Eski şifreniz yanlış.' };
    }
    console.log(`Password update simulated for security. In production, use Firebase Auth.`);
    return { success: true, message: 'Şifreniz başarıyla güncellendi (Simülasyon).' };
};


// --- SONGS API ---
export const getSongs = async (): Promise<Song[]> => {
  const q = query(songsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
};
export const addSong = async (songData: Omit<Song, 'id' | 'createdAt'>): Promise<Song> => {
  const docRef = await addDoc(songsCollection, { ...songData, createdAt: Date.now() });
  return { id: docRef.id, ...songData, createdAt: Date.now() };
};
export const updateSong = async (songId: string, updates: Partial<Omit<Song, 'id' | 'createdAt'>>): Promise<void> => {
  await updateDoc(doc(db, 'songs', songId), updates);
};
export const deleteSong = async (songId: string): Promise<void> => {
  await deleteDoc(doc(db, 'songs', songId));
};

// --- BOOKS API ---
export const getBooks = async (): Promise<Book[]> => {
  const q = query(booksCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
};
export const addBook = async (bookData: Omit<Book, 'id' | 'createdAt'>): Promise<Book> => {
  const docRef = await addDoc(booksCollection, { ...bookData, createdAt: Date.now() });
  return { id: docRef.id, ...bookData, createdAt: Date.now() };
};
export const updateBook = async (bookId: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>): Promise<void> => {
  await updateDoc(doc(db, 'books', bookId), updates);
};
export const deleteBook = async (bookId: string): Promise<void> => {
  await deleteDoc(doc(db, 'books', bookId));
};

// --- COURSES API ---
export const getCourses = async (): Promise<Course[]> => {
    const snapshot = await getDocs(coursesCollection);
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    // Sort locally as Firestore multi-field ordering can be complex
    return courses.sort((a, b) => {
        if (a.level < b.level) return -1;
        if (a.level > b.level) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
};
export const addCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'sections'>): Promise<Course> => {
    const newCourse = { ...courseData, sections: [], createdAt: Date.now() };
    const docRef = await addDoc(coursesCollection, newCourse);
    return { id: docRef.id, ...newCourse };
};
export const updateCourse = async (courseId: string, updates: Partial<Omit<Course, 'id' | 'createdAt' | 'sections'>>): Promise<void> => {
    await updateDoc(doc(db, 'courses', courseId), updates);
};
export const deleteCourse = async (courseId: string): Promise<void> => {
    await deleteDoc(doc(db, 'courses', courseId));
};
export const saveCourseStructure = async (updatedCourse: Course): Promise<void> => {
    const { id, ...courseData } = updatedCourse;
    await setDoc(doc(db, 'courses', id), courseData);
}

// --- USERS API ---
export const getUsers = async (): Promise<User[]> => {
  const q = query(usersCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};
export const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  // NOTE: Real password should be handled by Firebase Authentication
  const newUser = { ...userData, createdAt: Date.now() };
  const docRef = await addDoc(usersCollection, newUser);
  return { id: docRef.id, ...newUser };
};
export const updateUser = async (userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), updates);
};
export const deleteUser = async (userId: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', userId));
};
