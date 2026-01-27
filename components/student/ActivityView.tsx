
import React from 'react';
import { Activity, TopicProgress } from '../../types';
import { PuzzlePieceIcon } from '../icons';

interface ActivityViewProps {
    activities: Activity[];
    progress: TopicProgress;
    onUpdateProgress: (updates: Partial<TopicProgress>) => void;
}

const ActivityView: React.FC<ActivityViewProps> = ({ activities, progress, onUpdateProgress }) => {

    const handleCompleteActivity = () => {
        // Simulate activity completion and score
        onUpdateProgress({ activityScore: 100 });
    };

    if (progress.activityScore !== undefined) {
        return (
             <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-800">Etkinlikler Tamamlandı!</h3>
                <p className="text-green-700">Bu bölümü başarıyla geçtin.</p>
            </div>
        );
    }
    
    if (!activities || activities.length === 0) {
        return (
             <div className="text-center p-8 h-full flex flex-col justify-center items-center">
                <PuzzlePieceIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-700">Etkinlik Yok</h3>
                <p className="text-gray-500 max-w-sm">Bu konu için henüz bir etkinlik eklenmemiş. Öğretmenin yakında harika etkinlikler ekleyecek!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-4">
            {activities.map(activity => (
                 <div key={activity.id} className="text-left p-6 border rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{activity.title || 'Etkinlik Zamanı!'}</h3>
                    <p className="text-gray-600 mb-4">Konuyu pekiştirmek için bu etkinliği tamamla.</p>
                    <button
                        onClick={handleCompleteActivity}
                        className="bg-purple-500 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-600 transition-transform transform hover:scale-105"
                    >
                        Etkinliği Tamamla
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ActivityView;
