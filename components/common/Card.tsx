import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
    return (
        <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-md font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};