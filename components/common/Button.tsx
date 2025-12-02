import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'secondary', size = 'md', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 border-transparent',
        secondary: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500 border-gray-300',
        danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border-transparent',
    };
    
    const sizeClasses = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
    }

    return (
        <button
            type="button"
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};