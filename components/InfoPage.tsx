
import React from 'react';
import { InfoPageType } from '../types';

interface InfoPageProps {
  type: InfoPageType;
  onBack: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ type, onBack }) => {
  const renderContent = () => {
    switch (type) {
      case 'ABOUT':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800">Hakkımızda</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              WEBİLKOKULU, Türkiye'nin eğitim teknolojileri alanındaki vizyoner projelerinden biridir. Amacımız, 
              her çocuğun kendine has öğrenme hızını merkeze alan deneyimi dijital dünyaya taşımaktır.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-700 mb-2">Vizyonumuz</h3>
                <p className="text-sm text-slate-600">Yapay zeka desteğiyle kişiselleştirilmiş eğitimi her çocuğa ulaştırmak.</p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-700 mb-2">Misyonumuz</h3>
                <p className="text-sm text-slate-600">MEB müfredatına %100 uyumlu, oyunlaştırılmış güvenli ekosistem sunmak.</p>
              </div>
            </div>
          </div>
        );
      case 'CONTACT':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800">İletişim</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm font-medium">Sorularınız için bize her zaman ulaşabilirsiniz.</p>
                <div className="space-y-2">
                  {[
                    { i: "📍", t: "Adres", c: "Teknopark İstanbul, No: 123" },
                    { i: "📞", t: "Telefon", c: "0850 123 45 67" },
                    { i: "✉️", t: "E-posta", c: "merhaba@webilkokulu.com" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xl">{item.i}</span>
                      <div>
                        <p className="font-bold text-xs">{item.t}</p>
                        <p className="text-slate-500 text-[11px]">{item.c}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100 space-y-3">
                <h3 className="font-bold text-lg">Bize Yazın</h3>
                <input type="text" placeholder="Adınız" className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:border-indigo-500" />
                <textarea placeholder="Mesajınız" rows={3} className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:border-indigo-500" />
                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100">Gönder</button>
              </div>
            </div>
          </div>
        );
      case 'FAQ':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800">Sıkça Sorulan Sorular</h1>
            <div className="space-y-3">
              {[
                { q: 'WEBİLKOKULU ücretli mi?', a: 'Temel özelliklerimiz ücretsizdir. Premium içerikler için abonelik modelleri bulunur.' },
                { q: 'Hangi yaş grupları için?', a: '1. sınıftan 4. sınıfa kadar ilkokul öğrencileri için uygundur.' },
                { q: 'Tablette çalışır mı?', a: 'Evet, tüm cihazlarla tam uyumludur.' }
              ].map((faq, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{faq.q}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'PRIVACY':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800">Gizlilik</h1>
            <div className="text-slate-600 text-sm space-y-4">
              <p>Çocuklarımızın verilerinin güvenliği en büyük önceliğimizdir. Sadece eğitimi iyileştirmek için gerekli verileri KVKK standartlarında topluyoruz.</p>
            </div>
          </div>
        );
      case 'TERMS':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800">Şartlar</h1>
            <div className="text-slate-600 text-sm space-y-4">
              <p>Platformu kullanarak temel güvenlik ve telif kurallarını kabul etmiş sayılırsınız.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all text-sm"
      >
        &larr; Geri Dön
      </button>
      <div className="max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoPage;
