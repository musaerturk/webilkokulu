
# Webilkokulu - İlkokul Kurs Yönetim Paneli

Bu proje, ilkokul 1-4. sınıf öğrencileri için interaktif kurs içerikleri, müzik ve kitaplık kaynakları yönetmek üzere tasarlanmış modern bir yönetici panelidir. Sistem, Firebase Firestore veritabanı ile entegre çalışır ve içeriklerin dinamik olarak yönetilmesine olanak tanır.

## Özellikler

- **Müzik Odası:** Şarkı ekleme, düzenleme ve silme.
- **Kütüphane:** Resimli ve metinli, sayfa sayfa kitap oluşturma.
- **Kurs Yönetimi:** Sınıf seviyelerine göre kurslar, üniteler ve konular oluşturma.
- **İçerik Editörü:** Sunumlar, etkinlikler, oyunlar ve değerlendirmeler için gelişmiş editör.
- **Kullanıcı Yönetimi:** Öğrenci kayıtlarını yönetme.
- **Kurumsal Ayarlar:** Site logosu, yönetici şifresi ve "Hakkımızda", "SSS" gibi statik sayfaların içeriğini düzenleme.
- **Yapay Zeka Desteği:** Gemini AI ile sunum, etkinlik ve oyun içerikleri üretme.

## Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Gerekli Ortam Değişkenleri

Projeyi çalıştırabilmek için bir Firebase projesine ve bir Google Gemini API anahtarına ihtiyacınız olacak.

1.  **Firebase Projesi Oluşturun:**
    - [Firebase Console](https://console.firebase.google.com/)'a gidin ve yeni bir proje oluşturun.
    - Proje ayarlarından (⚙️) bir "Web Uygulaması" (</>) ekleyin ve size verilen `firebaseConfig` nesnesindeki bilgileri kopyalayın.
    - Sol menüden **Firestore Database**'e gidin, yeni bir veritabanı oluşturun ve **test modunda** başlayın. Bu, başlangıçta veri okuma/yazma işlemlerine izin verecektir.

2.  **`.env.local` Dosyası Oluşturun:**
    - Projenin ana dizininde `.env.local` adında bir dosya oluşturun.
    - Aşağıdaki `.env.example` içeriğini bu dosyaya kopyalayın ve Firebase projenizden aldığınız bilgilerle doldurun.
    - Google AI Studio'dan aldığınız Gemini API anahtarınızı da ekleyin.

    ```
    # .env.example içeriği
    VITE_FIREBASE_API_KEY="YOUR_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
    VITE_FIREBASE_APP_ID="YOUR_APP_ID"

    VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

### 2. Bağımlılıklar ve Çalıştırma

Bu proje, modern tarayıcılarda `importmap` kullanarak harici bağımlılıklar olmadan çalışacak şekilde tasarlanmıştır. Herhangi bir `npm install` komutu çalıştırmanıza gerek yoktur. Projeyi çalıştırmak için bir yerel sunucu kullanmanız yeterlidir.

Örneğin, VS Code kullanıyorsanız, "Live Server" eklentisini kurup `index.html` dosyasına sağ tıklayarak "Open with Live Server" seçeneğini kullanabilirsiniz.

## Firebase Hosting ile Dağıtım

Projenizi canlıya almak için Firebase Hosting'i kullanabilirsiniz.

1.  **Firebase CLI Kurulumu:**
    ```bash
    npm install -g firebase-tools
    ```

2.  **Firebase'e Giriş Yapın:**
    ```bash
    firebase login
    ```

3.  **Projenizi Başlatın:**
    - Proje dizininizde aşağıdaki komutu çalıştırın:
      ```bash
      firebase init
      ```
    - "Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys" seçeneğini seçin.
    - Mevcut Firebase projenizi seçin.
    - Genel dizin (`public directory`) olarak `.` (nokta) veya `dist` (eğer bir build aracı kullanıyorsanız) girin. Bizim durumumuzda, build adımı olmadığı için `.` uygundur.
    - "Configure as a single-page app (rewrite all urls to /index.html)?" sorusuna **Yes** (Evet) deyin.

4.  **Dağıtım:**
    ```bash
    firebase deploy
    ```

Bu komut projenizi derleyip Firebase sunucularına yükleyecektir. İşlem bittiğinde size canlı sitenizin URL'sini verecektir.
