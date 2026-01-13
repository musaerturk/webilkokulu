
import { Grade, Subject, Unit, SiteSettings, MascotSettings, SubjectStyle } from "../types";

// Global State yapısı
export interface GlobalState {
  units: Record<string, Unit[]>;
  siteSettings: SiteSettings;
  mascots: MascotSettings[];
  subjectConfig: Record<Subject, SubjectStyle>;
  gradeSubjectsMapping: Record<Grade, Subject[]>;
}

const STORAGE_KEY = 'webilkokulu_global_state';

/**
 * Veriyi Buluta Kaydet
 * Netlify üzerinde Environment Variable olarak tanımlanan API Key'i kullanır.
 */
export const saveToCloud = async (state: GlobalState): Promise<boolean> => {
  try {
    // 1. Yerel yedekleme (Hız için)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // 2. Firebase Realtime Database veya Firestore REST API kullanımı
    // Firebase konfigürasyonu varsa buluta gönder
    const config = state.siteSettings.storageConfig;
    
    // Eğer yönetici Netlify/Site ayarlarından Firebase bilgilerini girdiyse
    if (config.provider === 'firebase' && config.projectId && config.apiKey) {
      // Firebase REST API kullanarak veriyi kalıcı olarak kaydediyoruz
      // Bu sayede veri dünyanın her yerinden erişilebilir olur
      const url = `https://${config.projectId}-default-rtdb.firebaseio.com/state.json?auth=${config.apiKey}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });

      if (!response.ok) throw new Error("Firebase kayıt hatası");
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Bulut kayıt hatası:", error);
    return false;
  }
};

/**
 * Veriyi Buluttan Yükle
 */
export const loadFromCloud = async (siteSettings?: SiteSettings): Promise<GlobalState | null> => {
  try {
    // Önce yerel veriyi al (ilk yükleme hızı için)
    const local = localStorage.getItem(STORAGE_KEY);
    const localData = local ? JSON.parse(local) : null;

    // Eğer Firebase ayarları varsa buluttan en günceli çek ve yereli güncelle
    if (siteSettings?.storageConfig?.provider === 'firebase' && siteSettings.storageConfig.projectId) {
      const config = siteSettings.storageConfig;
      const url = `https://${config.projectId}-default-rtdb.firebaseio.com/state.json`;
      
      const response = await fetch(url);
      if (response.ok) {
        const cloudData = await response.json();
        if (cloudData) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          return cloudData;
        }
      }
    }
    
    return localData;
  } catch (error) {
    console.error("Bulut yükleme hatası:", error);
    return null;
  }
};
