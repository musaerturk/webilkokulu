
import React from 'react';
import { Topic, CourseProgress } from '../../types';
import { LogoIcon } from '../icons';

interface SectionsSidebarProps {
    topics: Topic[];
    selectedTopicId: string | null;
    onSelectTopic: (topicId: string) => void;
    progress: CourseProgress;
    onBack: () => void;
}

const CheckCircleIcon: React.FC = () => (
    <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const SectionsSidebar: React.FC<SectionsSidebarProps> = ({ topics, selectedTopicId, onSelectTopic, progress, onBack }) => {
    return (
        <aside className="w-64 md:w-80 bg-white border-r flex-shrink-0 overflow-y-auto flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                    <LogoIcon />
                    <span className="font-bold text-lg">Webilkokulu</span>
                </div>
                 <button onClick={onBack} className="text-xs text-gray-500 hover:underline">
                    Yönetici Paneli
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {topics.map((topic, index) => {
                    const isCompleted = progress[topic.id]?.isCompleted;
                    const isSelected = topic.id === selectedTopicId;

                    return (
                        <button 
                            key={topic.id}
                            onClick={() => onSelectTopic(topic.id)}
                            className={`w-full text-left flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-200 ${
                                isSelected 
                                ? 'bg-blue-100 text-blue-700 font-bold shadow-sm' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span>{`Bölüm ${index + 1}: ${topic.title}`}</span>

                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                {isCompleted ? (
                                    <CheckCircleIcon />
                                ) : isSelected ? (
                                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default SectionsSidebar;
