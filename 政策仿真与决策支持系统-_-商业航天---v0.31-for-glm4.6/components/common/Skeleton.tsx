
import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
    className = "", 
    variant = "text", 
    width, 
    height 
}) => {
    const baseClasses = "animate-pulse bg-slate-200";
    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-md",
    };

    const style = {
        width: width,
        height: height,
    };

    return (
        <div 
            className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
            style={style}
        />
    );
};
