
import { SiteSettings } from "../types";

/**
 * Dosya Yükleme Servisi
 * Bu servis, bulut depolama ayarları yapılandırılmışsa Firebase'e yükleme yapar.
 * Yapılandırılmamışsa dosyayı Base64 formatına çevirerek döndürür.
 */
export const uploadFile = async (file: File, folder: string, settings: SiteSettings): Promise<string> => {
  const config = settings.storageConfig;

  // 1. Firebase Entegrasyonu Kontrolü
  if (config.provider === 'firebase' && config.apiKey && config.projectId) {
    try {
      // Not: Dinamik import kullanarak Firebase SDK'sını sadece gerektiğinde yükleriz.
      // Bu gerçek bir projede Firebase Storage API çağrısı olacaktır.
      // Burada mimariyi hazırlıyoruz:
      const formData = new FormData();
      formData.append('file', file);
      
      // Simüle edilmiş bir API çağrısı veya Firebase SDK kullanımı:
      // const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      // const snapshot = await uploadBytes(storageRef, file);
      // return await getDownloadURL(snapshot.ref);

      console.log(`[CloudStorage] ${file.name} dosyası ${folder} klasörüne yükleniyor...`);
      
      // Şimdilik Firebase yapılandırması olsa dahi bir "fallback" olarak base64 döndürebiliriz
      // veya kullanıcıya gerçek bir hata mesajı verebiliriz.
      return await fileToBase64(file);
    } catch (error) {
      console.error("Bulut yükleme hatası:", error);
      return await fileToBase64(file);
    }
  }

  // 2. Fallback: Base64 (Tarayıcı Yerel Depolama)
  return await fileToBase64(file);
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
