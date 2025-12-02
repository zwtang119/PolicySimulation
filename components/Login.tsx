
import React, { useState } from 'react';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';

interface LoginProps {
    onLogin: (username: string) => void;
    onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // 宽容校验：去除空格，忽略大小写
        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim();

        if (cleanUser === 'admin' && cleanPass === 'Password123') {
            onLogin('Admin'); // Pass back formatted name
        } else {
            setError('用户名或密码错误 (默认账号: Admin / 密码: Password123)');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex max-w-4xl w-full min-h-[500px]">
                {/* Left Side - Visual */}
                <div className="w-1/2 bg-slate-900 relative hidden md:flex flex-col justify-center items-center text-white p-8">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Polaris</h2>
                        <p className="text-slate-300 text-lg">政策动力学引擎</p>
                        <p className="mt-8 text-sm text-slate-400">
                            为国家重大决策提供前所未有的确定性、远见与风险规避能力。
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-slate-800">信息收集分析系统</h3>
                        <p className="text-slate-500 text-sm mt-2">请登录您的账号以继续</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                账号
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                    placeholder="请输入账号"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                密码
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                    placeholder="请输入密码"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="w-full bg-slate-900 hover:bg-slate-800 py-2.5 text-base flex justify-center items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? <><Spinner className="mr-2 text-white" /> 登录中...</> : '登录'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center md:text-right">
                        <button 
                            onClick={onForgotPassword}
                            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            忘记密码？去重置
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
