
import React, { useState, useEffect } from 'react';
import { CourseSection } from '../types';
import * as api from '../services/firebaseService';

interface SectionFormModalProps {
  section: CourseSection | null;
  courseId: string;
  onClose: () => void;
  onSave: () => void;
}

const SectionFormModal: React.FC<SectionFormModalProps> = ({ section, courseId, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (section) {
      setTitle(section.title);
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Lütfen bölüm başlığını girin.");
      return;
    }
    setIsSaving(true);
    try {
        const courses = await api.getCourses();
        const course = courses.find(c => c.id === courseId);
        if(!course) throw new Error("Course not found!");

        if (section) {
            const sectionIndex = course.sections.findIndex(s => s.id === section.id);
            if(sectionIndex > -1) course.sections[sectionIndex].title = title;
        } else {
            const newSection: CourseSection = { id: Math.random().toString(36).substring(2, 9), title, topics: [] };
            course.sections.push(newSection);
        }
        await api.saveCourseStructure(course);
        onSave();
    } catch (error) {
      console.error("Error saving section:", error);
      alert("Bölüm kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">{section ? 'Bölümü Düzenle' : 'Yeni Bölüm Ekle'}</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Bölüm Başlığı</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" required />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={onClose} disabled={isSaving} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">İptal</button>
              <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionFormModal;
