
import React, { useState, useEffect } from 'react';
import { Book, Page } from '../types';
import * as api from '../services/firebaseService';
import { PlusIcon, TrashIcon } from './icons';

interface BookFormModalProps {
  book: Book | null;
  onClose: () => void;
  onSave: () => void;
}

type BookFormData = Omit<Book, 'id' | 'createdAt' | 'pages'> & { pages: Omit<Page, 'id'>[] };

const BookFormModal: React.FC<BookFormModalProps> = ({ book, onClose, onSave }) => {
  const initialFormData: BookFormData = {
    title: '',
    coverImageUrl: '',
    level: '1. Sınıf',
    subject: '',
    values: '',
    genre: '',
    pages: [],
  };

  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        pages: book.pages.map(({ id, ...rest }) => rest), // Remove id for form state
      });
    } else {
      setFormData(initialFormData);
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (index: number, field: keyof Omit<Page, 'id'>, value: string | number) => {
    const newPages = [...formData.pages];
    (newPages[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, pages: newPages }));
  };

  const addPage = () => {
    setFormData(prev => ({
      ...prev,
      pages: [...prev.pages, { pageNumber: prev.pages.length + 1, text: '', imageUrl: '' }],
    }));
  };

  const removePage = (index: number) => {
    const newPages = formData.pages.filter((_, i) => i !== index);
    // Re-number pages
    const renumberedPages = newPages.map((page, i) => ({ ...page, pageNumber: i + 1 }));
    setFormData(prev => ({ ...prev, pages: renumberedPages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Lütfen kitap başlığını girin.");
      return;
    }
    setIsSaving(true);
    try {
        const bookPayload = {
            ...formData,
            pages: formData.pages.map(p => ({...p, id: Math.random().toString(36).substring(2, 9)}))
        };

      if (book) {
        await api.updateBook(book.id, bookPayload);
      } else {
        await api.addBook(bookPayload);
      }
      onSave();
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Kitap kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">{book ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
          </div>

          <div className="p-6 flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({ title: 'Kitap Başlığı', coverImageUrl: 'Kapak Resmi URL', subject: 'Konusu', values: 'Değerler', genre: 'Türü' }).map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">{label}</label>
                  <input type={key === 'coverImageUrl' ? 'url' : 'text'} id={key} name={key} value={(formData as any)[key]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" required={key==='title'} />
                </div>
              ))}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700">Seviye (Sınıf)</label>
                <select id="level" name="level" value={formData.level} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>1. Sınıf</option>
                  <option>2. Sınıf</option>
                  <option>3. Sınıf</option>
                  <option>4. Sınıf</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold">Sayfalar</h4>
                <button type="button" onClick={addPage} className="bg-blue-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center text-sm"><PlusIcon/> <span className="ml-1">Sayfa Ekle</span></button>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {formData.pages.map((page, index) => (
                  <div key={index} className="p-3 border rounded-md bg-gray-50 relative">
                     <span className="absolute top-2 left-2 text-xs font-bold text-gray-400">Sayfa {page.pageNumber}</span>
                    <button type="button" onClick={() => removePage(index)} className="absolute top-1 right-1 text-red-500 hover:text-red-700"><TrashIcon/></button>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Metin</label>
                      <textarea value={page.text} onChange={(e) => handlePageChange(index, 'text', e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"></textarea>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Görsel URL</label>
                      <input type="url" value={page.imageUrl} onChange={(e) => handlePageChange(index, 'imageUrl', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"/>
                    </div>
                  </div>
                ))}
                 {formData.pages.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Henüz sayfa eklenmedi.</p>}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
            <button type="button" onClick={onClose} disabled={isSaving} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">İptal</button>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300">{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;
