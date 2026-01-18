
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  setDoc,
  getDoc,
  orderBy
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSy...",
  authDomain: "webilkokulu-portal.firebaseapp.com",
  projectId: "webilkokulu-portal",
  storageBucket: "webilkokulu-portal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Genel Veri İşlemleri
export const saveData = async (colName: string, data: any) => {
  try {
    const colRef = collection(db, colName);
    const docRef = await addDoc(colRef, { ...data, createdAt: new Date().toISOString() });
    return docRef.id;
  } catch (error) {
    console.error(`Save error in ${colName}:`, error);
    throw error;
  }
};

export const fetchData = async (colName: string) => {
  try {
    const colRef = collection(db, colName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Fetch error in ${colName}:`, error);
    return [];
  }
};

export const updateData = async (colName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, colName, id);
    return await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Update error in ${colName}:`, error);
    throw error;
  }
};

export const removeData = async (colName: string, id: string) => {
  try {
    const docRef = doc(db, colName, id);
    return await deleteDoc(docRef);
  } catch (error) {
    console.error(`Remove error in ${colName}:`, error);
    throw error;
  }
};

// Profil İşlemleri
export const saveUserProfile = async (userId: string, profile: any) => {
  const docRef = doc(db, "profiles", userId);
  return await setDoc(docRef, profile, { merge: true });
};

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "profiles", userId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data() : null;
};

// Yorum ve Soru İşlemleri
export const getTopicComments = async (subjectId: string) => {
  try {
    const colRef = collection(db, "comments");
    const q = query(colRef, where("subjectId", "==", subjectId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    return [];
  }
};

// Dosya Yükleme (Müzik & Görsel)
export const uploadFile = async (path: string, file: File) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
