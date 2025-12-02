
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppView } from '../types';

interface UIContextType {
    currentView: AppView;
    navigate: (view: AppView) => void;
    isLeadModalOpen: boolean;
    setLeadModalOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// 视图与 Hash 的映射关系
const VIEW_HASH_MAP: Record<string, AppView> = {
    'home': 'home',
    'login': 'login',
    'data-entry': 'data-entry',
    'data-query': 'data-query',
    'simulation': 'simulation',
    'simulation-result': 'simulation-result',
    'reports': 'reports',
    'profile': 'profile',
    'about-us': 'about-us',
    'how-it-works': 'how-it-works',
    'use-cases': 'use-cases',
    'whitepaper': 'whitepaper',
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<AppView>('home');
    const [isLeadModalOpen, setLeadModalOpen] = useState(false);

    // 1. 初始化：从 URL Hash 读取视图，处理 GitHub Pages 刷新问题
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // 移除 #
            // 如果 hash 包含子路径（如 whitepaper#vol-1），只取第一部分
            const baseHash = hash.split('/')[0]; 
            
            const view = Object.keys(VIEW_HASH_MAP).find(key => key === baseHash) as AppView | undefined;
            
            if (view) {
                setCurrentView(view);
            } else if (!hash) {
                setCurrentView('home');
            }
        };

        // 首次加载执行
        handleHashChange();

        // 监听 Hash 变化（支持浏览器后退/前进）
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // 2. 导航：更新 State 并同步到 Hash
    const navigate = (view: AppView) => {
        setCurrentView(view);
        window.location.hash = view;
        window.scrollTo(0, 0);
    };

    return (
        <UIContext.Provider value={{ currentView, navigate, isLeadModalOpen, setLeadModalOpen }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};