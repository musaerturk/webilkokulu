
import React, { useState, useEffect, useCallback } from 'react';
import { Course, CourseSection, Topic } from '../types';
import * as api from '../services/firebaseService';
import { PlusIcon, EditIcon } from '../components/icons';
import CourseFormModal from '../components/CourseFormModal';
import SectionFormModal from '../components/SectionFormModal';
import TopicFormModal from '../components/TopicFormModal';

interface CoursesPageProps {
    navigateToStudent: (course: Course) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ navigateToStudent }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState<'course' | 'section' | 'topic' | null>(null);
    const [editingData, setEditingData] = useState<{ course?: Course, section?: CourseSection, topic?: Topic }>({});
    const [contextIds, setContextIds] = useState<{ courseId?: string, sectionId?: string }>({});

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedCourses = await api.getCourses();
            setCourses(fetchedCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            alert("Kurslar yüklenirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);
    
    const handleSave = () => {
        setModal(null);
        setEditingData({});
        setContextIds({});
        fetchCourses();
    };

    const handleOpenModal = (
        type: 'course' | 'section' | 'topic', 
        data: any = null, 
        ids: { courseId?: string, sectionId?: string } = {}
    ) => {
        setModal(type);
        setEditingData(data || {});
        setContextIds(ids);
    };

    if (isLoading) {
        return <p className="text-center text-gray-500">Kurslar yükleniyor...</p>;
    }

    const groupedCourses = courses.reduce((acc, course) => {
        (acc[course.level] = acc[course.level] || []).push(course);
        return acc;
    }, {} as Record<Course['level'], Course[]>);

    const courseLevels: Course['level'][] = ['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf'];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Kurs İçerikleri</h2>
                <button
                    onClick={() => handleOpenModal('course')}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
                >
                    <PlusIcon /> <span className="ml-2">Yeni Kurs Ekle</span>
                </button>
            </div>
            
            <div className="space-y-8">
                {courses.length === 0 ? (
                    <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">Henüz kurs eklenmemiş.</p>
                ) : (
                    courseLevels.map(level => (
                        groupedCourses[level] && (
                             <section key={level}>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">{level}</h3>
                                <div className="space-y-4">
                                    {groupedCourses[level].map(course => (
                                        <details key={course.id} className="bg-white rounded-lg shadow overflow-hidden group">
                                            <summary className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 list-none group-open:border-b">
                                                <div className="flex items-center space-x-4">
                                                    <img src={course.coverImageUrl || 'https://picsum.photos/seed/placeholder/100/80'} alt={course.title} className="w-24 h-16 object-cover rounded-md flex-shrink-0"/>
                                                    <div>
                                                        <h4 className="font-semibold text-lg text-gray-800">{course.title}</h4>
                                                        <p className="text-sm text-gray-500 hidden sm:block">{course.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                                    <button onClick={(e) => { e.stopPropagation(); navigateToStudent(course); }} className="text-sm bg-purple-500 text-white py-1 px-2 rounded hover:bg-purple-600">Öğrenci Görünümü</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleOpenModal('section', null, { courseId: course.id })}} className="text-sm bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">Bölüm Ekle</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleOpenModal('course', { course })}} className="text-blue-600 p-2 rounded-full hover:bg-gray-200"><EditIcon/></button>
                                                    <svg className="w-5 h-5 text-gray-500 transform transition-transform group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </summary>
                                            <div className="p-4 bg-gray-50/50 pl-8 space-y-3">
                                                {course.sections.map(section => (
                                                    <details key={section.id} className="bg-white rounded-lg border">
                                                        <summary className="p-3 font-medium cursor-pointer flex justify-between items-center hover:bg-gray-100">
                                                            {section.title}
                                                            <div className="space-x-2">
                                                                 <button onClick={(e) => { e.stopPropagation(); handleOpenModal('topic', null, { courseId: course.id, sectionId: section.id })}} className="text-sm bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">Konu Ekle</button>
                                                                 <button onClick={(e) => { e.stopPropagation(); handleOpenModal('section', { section }, { courseId: course.id })}} className="text-blue-600 p-1 rounded-full hover:bg-gray-200"><EditIcon/></button>
                                                            </div>
                                                        </summary>
                                                        <div className="p-3 border-t border-gray-200 pl-6 bg-gray-50">
                                                            {section.topics.map(topic => (
                                                                <div key={topic.id} className="flex justify-between items-center p-2 rounded hover:bg-white">
                                                                    <span>{topic.title}</span>
                                                                     <div className="space-x-2">
                                                                        <button onClick={() => handleOpenModal('topic', { topic }, { courseId: course.id, sectionId: section.id })} className="text-blue-600 p-1 rounded-full hover:bg-gray-200"><EditIcon/></button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {section.topics.length === 0 && <p className="text-sm text-gray-500 p-2">Bu bölüme henüz konu eklenmemiş.</p>}
                                                        </div>
                                                    </details>
                                                ))}
                                                {course.sections.length === 0 && <p className="text-sm text-gray-500 p-4 text-center">Bu kursa henüz bölüm (ünite) eklenmemiş.</p>}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )
                    ))
                )}
            </div>
            
            {modal === 'course' && <CourseFormModal course={editingData.course} onSave={handleSave} onClose={() => setModal(null)} />}
            {modal === 'section' && <SectionFormModal section={editingData.section} courseId={contextIds.courseId!} onSave={handleSave} onClose={() => setModal(null)} />}
            {modal === 'topic' && <TopicFormModal topic={editingData.topic} courseId={contextIds.courseId!} sectionId={contextIds.sectionId!} onSave={handleSave} onClose={() => setModal(null)} />}
        </div>
    );
};

export default CoursesPage;
