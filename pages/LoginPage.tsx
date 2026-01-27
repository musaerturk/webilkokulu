
import React, { useState } from 'react';
import { LogoIcon, ShieldCheckIcon, UserCircleIcon, PuzzlePieceIcon, ChartBarIcon, TwitterIcon, FacebookIcon, InstagramIcon, LockClosedIcon } from '../components/icons';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const BlobFeature: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string; }> = ({ icon, title, description, color }) => {
    return (
        <div className="relative w-60 h-60 flex items-center justify-center text-center">
            <div className="absolute inset-0">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path
                        fill={color}
                        d="M46.9,-61.6C60.7,-52.3,71.8,-37.9,76.5,-21.9C81.2,-5.9,79.5,11.7,71.7,25.2C63.9,38.7,49.9,48.2,35.6,56.6C21.3,65,6.7,72.4,-8.6,73.1C-23.9,73.8,-39.9,67.8,-52.8,57.7C-65.7,47.6,-75.5,33.4,-78.9,17.7C-82.3,2,-79.3,-15.3,-70.7,-29.4C-62.1,-43.5,-47.9,-54.5,-33.5,-62.7C-19.1,-70.9,-4.5,-76.3,9.7,-74.6C23.9,-72.9,39.9,-64.1,46.9,-61.6Z"
                        transform="translate(100 100) scale(1.1)"
                    />
                </svg>
            </div>
            <div className="relative z-10 p-4 flex flex-col items-center text-white">
                {icon}
                <h3 className="text-xl font-bold mt-2 uppercase tracking-wider">{title}</h3>
                <p className="text-sm mt-1 max-w-[160px]">{description}</p>
            </div>
        </div>
    );
};

const AdminLoginModal: React.FC<{onClose: () => void; onLogin: () => void}> = ({onClose, onLogin}) => {
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');

    const handleAdminLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminUser === 'admin' && adminPass === '12345') {
            onLogin();
        } else {
            alert('Hatalı yönetici bilgileri.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-8 relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                 <h2 className="text-2xl font-bold text-center mb-6 text-white">Sistem Kontrol Girişi</h2>
                 <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="admin-username" className="block text-sm font-medium text-purple-300">Yönetici Adı</label>
                        <input
                            type="text"
                            id="admin-username"
                            value={adminUser}
                            onChange={(e) => setAdminUser(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-black/30 border border-purple-600/50 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className="block text-sm font-medium text-purple-300">Şifre</label>
                        <input
                            type="password"
                            id="admin-password"
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-black/30 border border-purple-600/50 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-blue-700 transition-colors shadow-lg">
                        Giriş Yap
                    </button>
                 </form>
            </div>
        </div>
    );
}


const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Öğrenci girişi şu anda aktif değil. Lütfen yönetici iseniz sayfanın altındaki 'Sistem Kontrol' butonunu kullanın.");
    };

    const features = [
        {
            icon: <ShieldCheckIcon className="w-10 h-10 text-white" />,
            color: '#3B82F6', // blue-500
            title: 'MEB UYUMLU',
            description: 'Yeni müfredata tam uyumlu, yeni nesil öğrenme sistemi.'
        },
        {
            icon: <UserCircleIcon className="w-10 h-10 text-white" />,
            color: '#8B5CF6', // purple-500
            title: 'BİREYSEL',
            description: 'Kişiye uygun özelleştirilmiş içerikler.'
        },
        {
            icon: <PuzzlePieceIcon className="w-10 h-10 text-white" />,
            color: '#2563EB', // blue-600
            title: 'EĞLENCELİ',
            description: 'Sıkmadan interaktif etkinlik ve oyunlarla öğrenmeyi pekiştirme.'
        },
        {
            icon: <ChartBarIcon className="w-10 h-10 text-white" />,
            color: '#9333EA', // purple-600
            title: 'REHBERLİK',
            description: 'AI ile rehberlik, destek ve başarıyı ölçme, geliştirme.'
        }
    ];

    return (
        <div className="font-sans bg-gray-50">
            <div className="min-h-screen bg-[#1e143b] text-white relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/40 via-purple-800/60 to-transparent"></div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="py-4 px-6 md:px-12 border-b border-white/10">
                        <div className="container mx-auto flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <LogoIcon />
                                <span className="text-2xl font-bold">Webilkokulu</span>
                            </div>
                            <nav className="hidden md:flex items-center space-x-6 text-sm">
                                <a href="#" className="hover:text-purple-300 transition-colors">Kurslar</a>
                                <a href="#" className="hover:text-purple-300 transition-colors">Hakkımızda</a>
                                <a href="#" className="hover:text-purple-300 transition-colors">İletişim</a>
                            </nav>
                            <div className="flex items-center space-x-4">
                                <button className="text-sm font-medium hover:text-purple-300 transition-colors">Üye Girişi</button>
                                <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-2 px-4 rounded-full transition-transform transform hover:scale-105">
                                    HEMEN ÜYE OL
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-grow container mx-auto px-6 md:px-12 flex items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Hero Text */}
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
                                    İnteraktif Derslerle
                                    <span className="block text-purple-400">Geleceğe Adım At!</span>
                                </h1>
                                <p className="mt-4 max-w-lg text-gray-300 text-lg">
                                    1. sınıftan 4. sınıfa kadar tüm derslerde, uzman eğitmenlerimizin hazırladığı kişiye özel ve etkileşimli içeriklerle başarıya bir adım daha yaklaşın.
                                </p>
                                <div className="mt-8 flex justify-center md:justify-start space-x-4">
                                    <button className="bg-[#FF9F43] text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-orange-500 transition-transform transform hover:scale-105 shadow-lg">
                                        Kursları İncele
                                    </button>
                                    <button className="border-2 border-[#FF9F43] text-[#FF9F43] font-bold py-3 px-6 rounded-lg text-lg hover:bg-[#FF9F43] hover:text-white transition-colors shadow-lg">
                                        Daha Fazla Bilgi
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Login Form */}
                            <div className="w-full max-w-sm mx-auto">
                                <form onSubmit={handleStudentLogin} className="bg-purple-900/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-purple-400/20">
                                    <h2 className="text-2xl font-bold text-center mb-6 text-white">Üye Girişi</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-purple-300">Kullanıcı Adınız</label>
                                            <input
                                                type="text"
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="mt-1 block w-full px-4 py-2 bg-black/30 border border-purple-600/50 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="kullanici.adi"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="password-login" className="block text-sm font-medium text-purple-300">Şifreniz</label>
                                            <input
                                                type="password"
                                                id="password-login"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="mt-1 block w-full px-4 py-2 bg-black/30 border border-purple-600/50 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <a href="#" className="block text-xs text-purple-300 hover:underline mt-2 text-right">Şifremi unuttum</a>
                                    <button type="submit" className="w-full bg-[#FF9F43] text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-orange-500 transition-colors shadow-lg">
                                        Giriş Yap
                                    </button>
                                    <div className="text-center mt-4 text-xs text-gray-400">
                                        <p>Hesabın yok mu? <a href="#" className="text-purple-300 font-semibold hover:underline">Hemen üye ol!</a></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Features Section */}
            <section className="bg-white py-16 lg:py-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        Neden Webilkokulu?
                    </h2>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {features.map((feature, index) => (
                           <BlobFeature
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                color={feature.color}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Branding & Admin Login (Spans 2 columns on md+) */}
                        <div className="flex flex-col items-start md:col-span-2">
                            <div className="flex items-center space-x-3 mb-2">
                                <LogoIcon />
                                <span className="text-2xl font-bold">Webilkokulu</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 max-w-xs">Kendin ol, kendi hızında öğren. Senin okulun, senin maceran!</p>
                            <button onClick={() => setIsAdminModalOpen(true)} className="group mt-4 flex items-center space-x-2 text-gray-400 transition-colors hover:text-white">
                                <LockClosedIcon className="h-4 w-4" />
                                <span className="text-sm font-semibold uppercase tracking-wider">Sistem Kontrol</span>
                            </button>
                        </div>

                        {/* Kurumsal Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Kurumsal</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">KVKK ve Gizlilik</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
                            </ul>
                        </div>

                        {/* İletişim & Social Media */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">İletişim</h3>
                            <div className="text-gray-400 space-y-3">
                                <p><strong>Tel:</strong> +90 (123) 456 78 90</p>
                                <p><strong>Adres:</strong> Webilkokulu A.Ş. Bilgi Parkı, İstanbul</p>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Bizi Takip Edin</h3>
                                <div className="flex space-x-4">
                                    <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
                                    <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
                                    <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="bg-gray-900 py-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Webilkokulu. Tüm hakları saklıdır.
                </div>
            </footer>

            {isAdminModalOpen && <AdminLoginModal onClose={() => setIsAdminModalOpen(false)} onLogin={onLoginSuccess} />}
        </div>
    );
};

export default LoginPage;
