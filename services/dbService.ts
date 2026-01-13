
import { Grade, Subject, Unit, SiteSettings, MascotSettings, SubjectStyle } from "../types";

export interface GlobalState {
  units: Record<string, Unit[]>;
  siteSettings: SiteSettings;
  mascots: MascotSettings[];
  subjectConfig: Record<Subject, SubjectStyle>;
  gradeSubjectsMapping: Record<Grade, Subject[]>;
}

const STORAGE_KEY = 'webilkokulu_global_state';

/**
 * Firebase URL oluşturucu - Bölge (Region) duyarlı
 */
const getFirebaseUrl = (config: any, path: string = 'state.json'): string => {
  // Eğer kullanıcı tam URL'yi girdiyse onu kullan, girmediyse Project ID'den türet
  let baseUrl = config.databaseUrl;
  
  if (!baseUrl && config.projectId) {
    baseUrl = `https://${config.projectId}-default-rtdb.firebaseio.com/`;
  }

  if (!baseUrl) return '';

  // URL'nin sonunda slash olduğundan emin ol ve .json ekle
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${path}?auth=${config.apiKey}`;
};

export const saveToCloud = async (state: GlobalState): Promise<boolean> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    const config = state.siteSettings.storageConfig;
    
    if (config.provider === 'firebase' && (config.projectId || config.databaseUrl) && config.apiKey) {
      const url = getFirebaseUrl(config);
      console.log(`[Firebase] Buluta yazılıyor: ${url.split('?')[0]}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Firebase Hatası:", errText);
        throw new Error("Bulut kaydı başarısız oldu.");
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Bulut kayıt hatası:", error);
    return false;
  }
};

export const loadFromCloud = async (siteSettings?: SiteSettings): Promise<GlobalState | null> => {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    const localData = local ? JSON.parse(local) : null;

    if (siteSettings?.storageConfig?.provider === 'firebase' && (siteSettings.storageConfig.projectId || siteSettings.storageConfig.databaseUrl)) {
      const config = siteSettings.storageConfig;
      // Okuma yaparken auth parametresini kaldırabiliriz eğer kurallar açıksa (test modu)
      const baseUrl = config.databaseUrl || `https://${config.projectId}-default-rtdb.firebaseio.com/`;
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const url = `${cleanBase}state.json`;
      
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
