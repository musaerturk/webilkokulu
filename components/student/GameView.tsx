
import React from 'react';
import { Game, TopicProgress } from '../../types';
import { LockClosedIcon, PuzzlePieceIcon } from '../icons';

interface GameViewProps {
    games: Game[];
    progress: TopicProgress;
    onUpdateProgress: (updates: Partial<TopicProgress>) => void;
}

const gameCardStyles = [
    { bg: 'bg-orange-400', icon: '🚀' },
    { bg: 'bg-purple-500', icon: '💎' },
    { bg: 'bg-teal-400', icon: '🌍' },
    { bg: 'bg-rose-400', icon: '🚩' },
];

const GameView: React.FC<GameViewProps> = ({ games, progress, onUpdateProgress }) => {

    const handlePlayGame = (gameId: string) => {
        // Simulate game play and score
        const score = Math.floor(Math.random() * 51) + 50; // Score between 50-100
        const newGameScores = { ...(progress.gameScores || {}), [gameId]: score };
        onUpdateProgress({ gameScores: newGameScores });
    };
    
    if (!games || games.length === 0) {
        return (
             <div className="text-center p-8 h-full flex flex-col justify-center items-center">
                <PuzzlePieceIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-700">Oyun Yok</h3>
                <p className="text-gray-500 max-w-sm">Bu konu için henüz bir oyun eklenmemiş. Çok yakında yeni ve eğlenceli oyunlarla burada olacağız!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            {games.map((game, index) => {
                const gameScore = progress.gameScores?.[game.id];
                const isCompleted = gameScore !== undefined;
                // For demonstration, lock all games except the first one if it's not completed
                const isLocked = !isCompleted && index > 0 && progress.gameScores?.[games[index - 1]?.id] === undefined;
                const style = gameCardStyles[index % gameCardStyles.length];


                return (
                     <div key={game.id} className={`rounded-xl p-4 flex flex-col justify-between text-white shadow-lg transition-transform transform hover:scale-105 ${isLocked ? 'bg-gray-400' : style.bg}`}>
                        <div className="flex justify-between items-start">
                             <div className="text-6xl">{style.icon}</div>
                            {isLocked && <LockClosedIcon />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mt-2">{game.title || 'Eğlenceli Oyun'}</h3>
                             {isCompleted ? (
                                <div className="mt-2 text-center w-full bg-white/30 text-white text-sm font-bold py-1.5 px-4 rounded-full">
                                    Tamamlandı
                                </div>
                            ) : isLocked ? (
                                 <div className="mt-2 text-center w-full bg-black/20 text-white text-sm font-bold py-1.5 px-4 rounded-full">
                                    Kilitli
                                </div>
                            ) : (
                                <button
                                    onClick={() => handlePlayGame(game.id)}
                                    className="mt-2 w-full bg-white text-green-600 font-bold py-1.5 px-4 rounded-full hover:bg-green-100 transition"
                                >
                                    Başla
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default GameView;
