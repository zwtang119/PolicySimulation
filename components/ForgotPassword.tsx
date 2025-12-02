
import React from 'react';
import { Button } from './common/Button';

export const ForgotPassword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex max-w-4xl w-full min-h-[500px]">
                <div className="w-1/2 bg-slate-900 relative hidden md:flex flex-col justify-center items-center text-white p-8">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-bold mb-4">忘记密码</h2>
                        <p className="text-slate-300 text-lg">Policy Dynamics Engine</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-800">重置密码</h3>
                        <p className="text-slate-500 text-sm mt-2">请验证您的身份以设置新密码</p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱账号</label>
                            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="请输入邮箱" />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="验证码" />
                            </div>
                            <div className="flex items-end">
                                <Button variant="secondary" className="whitespace-nowrap">获取验证码</Button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                            <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="新密码" />
                        </div>

                        <Button variant="primary" className="w-full bg-slate-900 hover:bg-slate-800 py-2.5 text-base">确认修改</Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">返回登录</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
