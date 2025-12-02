

import React, { useState, useEffect } from 'react';
import { Spinner } from './common/Spinner';

interface LeadGenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LeadGenModal: React.FC<LeadGenModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [organization, setOrganization] = useState('');
    const [email, setEmail] = useState('');
    const [interest, setInterest] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!isOpen) {
            // Reset form on close
            setTimeout(() => {
                setName('');
                setOrganization('');
                setEmail('');
                setInterest('');
                setMessage('');
                setStatus('idle');
                setErrors({});
            }, 300); // Wait for closing animation
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = '姓名不能为空。';
        if (!organization.trim()) newErrors.organization = '机构/公司不能为空。';
        if (!email.trim()) {
            newErrors.email = '邮箱不能为空。';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = '邮箱格式不正确。';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus('submitting');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real app, you would have error handling here
        // For this demo, we'll assume success
        setStatus('success');
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-95 animate-modal-pop-in"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="关闭"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8">
                    {status === 'success' ? (
                        <div className="text-center py-12">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mt-4" id="modal-title">您的邀请已送达</h3>
                            <p className="text-slate-600 mt-2">感谢您的信任。我们的高级顾问团队将在一个工作日内通过邮件与您取得联系，协调专属战略研讨事宜。期待与您共同探索。</p>
                            <button onClick={onClose} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">
                                关闭
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2" id="modal-title">成为创始伙伴，开启一次战略对话</h2>
                            <p className="text-slate-500 mb-6">我们寻找的不是客户，而是能够共同定义未来的同行者。请留下您的信息，我们的高级顾问将与您联系，协调一次面向您机构的深度战略研讨。</p>

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
                                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700">机构/公司 <span className="text-red-500">*</span></label>
                                    <input type="text" id="organization" value={organization} onChange={e => setOrganization(e.target.value)} required className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${errors.organization ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
                                    {errors.organization && <p className="mt-1 text-xs text-red-600">{errors.organization}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱 <span className="text-red-500">*</span></label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700">主要关注领域 (可选)</label>
                                    <select id="interest" value={interest} onChange={e => setInterest(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">请选择...</option>
                                        <option value="policy-evaluation">历史政策绩效归因</option>
                                        <option value="strategic-investment">未来战略路径设计</option>
                                        <option value="crisis-simulation">危机情景与风险推演</option>
                                        <option value="academic-research">复杂系统与政策科学研究</option>
                                        <option value="other">其他战略咨询</option>
                                    </select>
                                </div>
                                
                                <div className="text-xs text-gray-500 pt-2">
                                    提交此表单即表示您同意我们的隐私政策。
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center">
                                        {status === 'submitting' ? <><Spinner /> <span className="ml-2">提交中...</span></> : '发出合作邀请'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
            {/* Fix: The `jsx` prop on `<style>` is not standard in React and was causing a type error. It has been removed. */}
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-modal-pop-in {
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};
