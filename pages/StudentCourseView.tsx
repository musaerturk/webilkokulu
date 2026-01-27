
import React, { useState, useMemo, useEffect } from 'react';
import { Course, CourseProgress, TopicProgress } from '../types';
import SectionsSidebar from '../components/student/SectionsSidebar';
import TopicContent from '../components/student/TopicContent';
import { TurtleMascot } from '../components/icons';

interface StudentCourseViewProps {
    course: Course;
    navigateBackToAdmin: () => void;
}

const StudentCourseView: React.FC<StudentCourseViewProps> = ({ course, navigateBackToAdmin }) => {
    const allTopics = useMemo(() => course.sections.flatMap(s => s.topics), [course]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(allTopics[0]?.id || null);
    const [points, setPoints] = useState(1250); // Mock points
    
    const [progress, setProgress] = useState<CourseProgress>(() => {
        try {
            const savedProgress = localStorage.getItem(`progress_${course.id}`);
            return savedProgress ? JSON.parse(savedProgress) : {};
        } catch (error) {
            console.error("Failed to parse progress from localStorage", error);
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(`progress_${course.id}`, JSON.stringify(progress));
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
    }, [progress, course.id]);

    const selectedTopic = useMemo(() => {
        if (!selectedTopicId) return null;
        return allTopics.find(t => t.id === selectedTopicId) || null;
    }, [selectedTopicId, allTopics]);

    const completionPercentage = useMemo(() => {
        if (allTopics.length === 0) return 0;
        const completedCount = Object.keys(progress).filter(key => progress[key].isCompleted).length;
        return (completedCount / allTopics.length) * 100;
    }, [progress, allTopics]);

    const handleUpdateProgress = (topicId: string, updates: Partial<TopicProgress>) => {
        setProgress(prev => {
            const currentTopicProgress = prev[topicId] || { isCompleted: false };
            const newProgress = { ...currentTopicProgress, ...updates };

            const presentationDone = newProgress.presentationScore !== undefined;
            const gamesDone = (selectedTopic?.games.length || 0) === Object.keys(newProgress.gameScores || {}).length;
            const assessmentDone = newProgress.assessmentScore !== undefined;

            if (presentationDone && gamesDone && assessmentDone) {
                newProgress.isCompleted = true;
            }

            return { ...prev, [topicId]: newProgress };
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans relative overflow-hidden">
            <SectionsSidebar
                topics={allTopics}
                selectedTopicId={selectedTopicId}
                onSelectTopic={setSelectedTopicId}
                progress={progress}
                onBack={navigateBackToAdmin}
            />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                {selectedTopic ? (
                    <TopicContent 
                        key={selectedTopic.id}
                        topic={selectedTopic}
                        progress={progress[selectedTopic.id] || { isCompleted: false }}
                        onUpdateProgress={(updates) => handleUpdateProgress(selectedTopic.id, updates)}
                        completionPercentage={completionPercentage}
                        points={points}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-700">Bir Konu Seçin</h2>
                            <p className="text-gray-500 mt-2">Öğrenmeye başlamak için sol menüden bir konu seçin.</p>
                        </div>
                    </div>
                )}
            </main>
             <div className="absolute bottom-0 right-0 pointer-events-none">
                <TurtleMascot />
            </div>
        </div>
    );
};

export default StudentCourseView;
