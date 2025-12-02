
import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { useAuth } from '../contexts/AuthContext';

export const Profile: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <Card title="个人资料">
                <div className="space-y-8 py-4">
                    {/* Avatar */}
                    <div className="flex items-start space-x-8">
                        <div className="w-24 text-sm font-medium text-gray-500 pt-2">用户昵称</div>
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button className="text-sm text-gray-500 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">
                                📷 更换图片
                            </button>
                        </div>
                    </div>

                     <div className="flex items-start space-x-8">
                         <div className="w-24 text-sm font-medium text-gray-500 pt-2">账号</div>
                         <div className="pt-2 text-sm font-bold text-gray-800">{user?.username || '未知用户'}</div>
                    </div>
                    
                    <div className="flex items-start space-x-8">
                         <div className="w-24 text-sm font-medium text-gray-500 pt-2">所属机构</div>
                         <div className="pt-2 text-sm text-gray-800">{user?.organization || '未设置'}</div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-8">
                        <div className="w-24 text-sm font-medium text-gray-500">手机号</div>
                        <div className="flex-1">
                            <input type="text" className="w-full border-b border-gray-300 focus:border-slate-900 focus:outline-none py-1" placeholder="请输入手机号" />
                        </div>
                    </div>

                    {/* New Phone */}
                    <div className="flex items-center space-x-8">
                        <div className="w-24 text-sm font-medium text-gray-500">新手机号</div>
                        <div className="flex-1 flex space-x-4">
                            <input type="text" className="flex-1 border-b border-gray-300 focus:border-slate-900 focus:outline-none py-1" placeholder="请输入" />
                            <button className="text-xs text-slate-900 border border-slate-900 rounded px-2">获取</button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex items-center space-x-8">
                        <div className="w-24 text-sm font-medium text-gray-500">旧密码</div>
                        <div className="flex-1">
                            <input type="password" className="w-full border-b border-gray-300 focus:border-slate-900 focus:outline-none py-1" placeholder="请输入" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                        <div className="w-24 text-sm font-medium text-gray-500">新密码</div>
                        <div className="flex-1">
                            <input type="password" className="w-full border-b border-gray-300 focus:border-slate-900 focus:outline-none py-1" placeholder="请输入" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                        <div className="w-24 text-sm font-medium text-gray-500">确认密码</div>
                        <div className="flex-1">
                            <input type="password" className="w-full border-b border-gray-300 focus:border-slate-900 focus:outline-none py-1" placeholder="请输入" />
                        </div>
                    </div>

                    <div className="pt-8 flex justify-center">
                        <Button className="bg-slate-900 text-white w-32">保存</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
