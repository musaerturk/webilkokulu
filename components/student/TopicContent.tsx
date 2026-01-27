
import React, { useState } from 'react';
import { Topic, TopicProgress } from '../../types';
import PresentationView from './PresentationView';
import GameView from './GameView';
import AssessmentView from './AssessmentView';
import ActivityView from './ActivityView';
import { StarIcon } from '../icons';

interface TopicContentProps {
    topic: Topic;
    progress: TopicProgress;
    onUpdateProgress: (updates: Partial<TopicProgress>) => void;
    completionPercentage: number;
    points: number;
}

const TopicProgressStepper: React.FC<{ topic: Topic, progress: TopicProgress, activeTab: string }> = ({ topic, progress, activeTab }) => {
    const steps = ['presentation', 'activity', 'game', 'assessment'];
    const getStepStatus = (step: string) => {
        if (step === 'presentation') return progress.presentationScore !== undefined ? 'completed' : 'current';
        if (step === 'activity') return progress.presentationScore !== undefined ? (progress.activityScore !== undefined ? 'completed' : 'current') : 'locked';
        if (step === 'game') return progress.activityScore !== undefined ? (Object.keys(progress.gameScores || {}).length === topic.games.length ? 'completed' : 'current') : 'locked';
        if (step === 'assessment') return Object.keys(progress.gameScores || {}).length === topic.games.length ? (progress.assessmentScore !== undefined ? 'completed' : 'current') : 'locked';
        return 'locked';
    }

    return (
        <div className="w-full px-4 sm:px-8 my-6">
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 h-1 w-full bg-gray-200 -translate-y-1/2">
                     <div className="h-full bg-green-500" style={{width: `${(steps.filter(s => getStepStatus(s) === 'completed').length / steps.length) * 100}%`}}></div>
                </div>
                {steps.map(step => {
                    const status = getStepStatus(step);
                    return (
                        <div key={step} className="relative z-10">
                            {status === 'completed' ? (
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            ) : status === 'current' ? (
                                <div className={`w-8 h-8 rounded-full bg-white border-2 ${activeTab === step ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                                     <div className={`w-4 h-4 rounded-full ${activeTab === step ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};


const TopicContent: React.FC<TopicContentProps> = ({ topic, progress, onUpdateProgress, completionPercentage, points }) => {
    const [activeTab, setActiveTab] = useState<'presentation' | 'activity' | 'game' | 'assessment'>('presentation');

    const tabs = [
        { id: 'presentation', name: 'Sunum' },
        { id: 'activity', name: 'Etkinlik' },
        { id: 'game', name: 'Oyun' },
        { id: 'assessment', name: 'Ölçme' },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'presentation':
                return <PresentationView presentation={topic.presentation} progress={progress} onUpdateProgress={onUpdateProgress} />;
            case 'activity':
                return <ActivityView activities={topic.activities} progress={progress} onUpdateProgress={onUpdateProgress} />;
            case 'game':
                return <GameView games={topic.games} progress={progress} onUpdateProgress={onUpdateProgress} />;
            case 'assessment':
                return <AssessmentView assessment={topic.assessment} topicTitle={topic.title} progress={progress} onUpdateProgress={onUpdateProgress} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-indigo-700 rounded-2xl shadow-lg p-4 sm:p-6 h-full flex flex-col text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                 <div className="w-2/3">
                    <span className="text-sm font-medium text-indigo-200">{Math.round(completionPercentage)}% Tamamlandı</span>
                    <div className="w-full bg-indigo-900/50 rounded-full h-2.5 mt-1">
                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>
                <div className="bg-indigo-900/50 rounded-full flex items-center p-1 px-3 space-x-2">
                    <StarIcon />
                    <span className="font-bold text-lg">{points}</span>
                    <span className="text-sm text-indigo-200">Puan</span>
                </div>
            </div>
            
            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col overflow-hidden">
                <div className="p-3 bg-gray-50 border-b">
                    <nav className="flex items-center justify-center sm:justify-start bg-gray-200 rounded-full p-1 space-x-1">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full sm:w-auto px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${ activeTab === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <TopicProgressStepper topic={topic} progress={progress} activeTab={activeTab}/>

                <div className="flex-grow overflow-y-auto p-4 text-gray-800">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TopicContent;
