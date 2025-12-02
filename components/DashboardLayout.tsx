
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

const SidebarItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}> = ({ label, icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
        <span className="w-5 h-5">{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const { currentView, navigate } = useUI();

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 flex flex-col flex-shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 cursor-pointer" onClick={() => navigate('home')}>
                    <span className="text-xl font-bold text-white tracking-wider">Polaris</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">基础功能</div>
                    <SidebarItem 
                        label="数据录入与编辑" 
                        active={currentView === 'data-entry'} 
                        onClick={() => navigate('data-entry')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                    />
                    
                    <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">数据分析</div>
                    <SidebarItem 
                        label="数据查询与报告" 
                        active={currentView === 'data-query'} 
                        onClick={() => navigate('data-query')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    />
                    <SidebarItem 
                        label="数据分析与仿真" 
                        active={currentView === 'simulation'} 
                        onClick={() => navigate('simulation')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                    />
                    
                    <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">辅助功能</div>
                    <SidebarItem 
                        label="仿真结果" 
                        active={currentView === 'simulation-result'} 
                        onClick={() => navigate('simulation-result')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                    />
                    <SidebarItem 
                        label="报告导出" 
                        active={currentView === 'reports'} 
                        onClick={() => navigate('reports')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                    />
                    <SidebarItem 
                        label="个人中心" 
                        active={currentView === 'profile'} 
                        onClick={() => navigate('profile')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    />
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => { logout(); navigate('home'); }} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors w-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>退出登录</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">
                        {currentView === 'data-entry' && '数据录入与编辑'}
                        {currentView === 'data-query' && '数据查询与报告'}
                        {currentView === 'simulation' && '数据分析与仿真'}
                        {currentView === 'simulation-result' && '仿真结果仪表盘'}
                        {currentView === 'reports' && '报告导出'}
                        {currentView === 'profile' && '个人中心'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            欢迎，<span className="font-semibold text-slate-900">{user?.username || '管理员'}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {user?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
};