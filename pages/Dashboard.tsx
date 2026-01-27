
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Hoş Geldiniz!</h2>
      <p className="text-gray-600">
        İçerik yönetim sistemine hoş geldiniz. Sol menüden Müzik Odası veya Kütüphane bölümlerine geçerek içerik eklemeye başlayabilirsiniz.
      </p>
    </div>
  );
};

export default Dashboard;
