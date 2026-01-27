
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import * as api from '../services/firebaseService';

interface CourseFormModalProps {
  course: Course | null;
  onClose: () => void;
  onSave: () => void;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ course, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<Course['level']>('1. Sınıf');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setLevel(course.level);
      setDescription(course.description);
      setCoverImageUrl(course.coverImageUrl);
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !level) {
      alert("Lütfen kurs başlığını ve sınıf seviyesini girin.");
      return;
    }
    setIsSaving(true);
    const payload = { title, level, description, coverImageUrl };
    try {
      if (course) {
        await api.updateCourse(course.id, payload);
      } else {
        await api.addCourse(payload);
      }
      onSave();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Kurs kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-semibold border-b pb-3 text-gray-900">{course ? 'Kursu Düzenle' : 'Yeni Kurs Ekle'}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Kurs Başlığı</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" required />
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700">Sınıf Seviyesi</label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value as Course['level'])} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>1. Sınıf</option>
                  <option>2. Sınıf</option>
                  <option>3. Sınıf</option>
                  <option>4. Sınıf</option>
                </select>
              </div>
               <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" />
              </div>
               <div>
                <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700">Kapak Görseli URL</label>
                <input type="url" id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
            <button type="button" onClick={onClose} disabled={isSaving} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">İptal</button>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;
