
import React from 'react';
import { AppView } from '../types';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';

const NavLink: React.FC<{
    view: AppView;
    children: React.ReactNode;
}> = ({ view, children }) => {
    const { currentView, navigate } = useUI();
    return (
        <button 
            onClick={() => navigate(view)} 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === view 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            aria-current={currentView === view ? 'page' : undefined}
        >
            {children}
        </button>
    );
};

export const Header: React.FC = () => {
    const { navigate } = useUI();
    const { isAuthenticated } = useAuth();

    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => navigate('home')} className="flex items-center space-x-2" aria-label="返回首页">
                             <span className="text-xl font-bold text-slate-800">
                                Polaris | 政策动态仿真与决策支撑系统
                            </span>
                        </button>
                    </div>
                    <nav className="hidden md:flex items-center space-x-2">
                        <NavLink view="home">首页</NavLink>
                        <NavLink view="how-it-works">工作原理</NavLink>
                        <NavLink view="use-cases">应用场景</NavLink>
                        <NavLink view="whitepaper">项目白皮书</NavLink>
                    </nav>
                     <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('data-entry')}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                进入控制台
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('login')}
                                className="text-sm font-medium text-gray-500 hover:text-gray-800"
                            >
                                登录系统
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
