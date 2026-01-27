
import React from 'react';

interface CourseHeaderProps {
    courseTitle: string;
    completionPercentage: number;
    onBack: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseTitle, completionPercentage, onBack }) => {
    return (
        <header className="bg-white shadow-md p-4 flex items-center justify-between flex-shrink-0 z-10">
            <div className="flex items-center">
                <button onClick={onBack} className="text-gray-600 hover:text-blue-600 mr-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">{courseTitle}</h1>
            </div>
            <div className="flex items-center w-1/3 max-w-sm">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
                <span className="text-sm font-semibold text-gray-600">{Math.round(completionPercentage)}%</span>
            </div>
        </header>
    );
};

export default CourseHeader;
