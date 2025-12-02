
import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { AiStatus } from '../types';
import { Spinner } from './common/Spinner';
import { useData } from '../contexts/DataContext';
import { Skeleton } from './common/Skeleton';

export const DataEntry: React.FC = () => {
    const { companies, addCompany, generateDna, removeCompany, aiStatus } = useData();
    const [inputUrl, setInputUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true); // 模拟初始数据加载

    // 模拟组件挂载时的数据读取延迟
    useEffect(() => {
        const timer = setTimeout(() => setIsLoadingData(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const handleAdd = () => {
        if (inputUrl.trim()) {
            addCompany(inputUrl.trim());
            setInputUrl('');
        }
    };

    const handleFileUpload = () => {
        setIsUploading(true);
        let p = 0;
        const interval = setInterval(() => {
            p += 10;
            setUploadProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setFileUploaded(true);
                setTimeout(() => setFileUploaded(false), 3000);
            }
        }, 200);
    };

    if (isLoadingData) {
        return (
            <div className="space-y-6 animate-fade-in">
                <Card title="行业数据录入">
                    <div className="space-y-4">
                        <Skeleton height={40} />
                        <Skeleton height={100} />
                    </div>
                </Card>
                <div className="bg-white rounded-lg shadow overflow-hidden p-6">
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton width="30%" height={24} />
                                <Skeleton width="20%" height={24} />
                                <Skeleton width="10%" height={24} />
                                <Skeleton width="15%" height={32} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Section: Data Input */}
            <Card title="行业数据录入">
                <div className="flex flex-col space-y-6">
                    {/* Company Tags Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">* 录入企业 (输入名称或URL并回车)</label>
                        <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 bg-white min-h-[50px]">
                            {companies.map(company => (
                                <div key={company.id} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">
                                    <span className="mr-2">{company.name}</span>
                                    <button onClick={() => removeCompany(company.id)} className="text-blue-400 hover:text-blue-900 font-bold">×</button>
                                </div>
                            ))}
                            <input 
                                type="text" 
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAdd();
                                }}
                                className="flex-grow outline-none text-sm min-w-[150px]"
                                placeholder="输入企业名称..."
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">提示: 可以在此快速添加多家企业，或在下方表格管理。</p>
                    </div>

                    {/* File Upload Simulation */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">文件上传 (行业报告/白皮书)</label>
                        <div 
                            onClick={handleFileUpload}
                            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                                fileUploaded ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                            }`}
                        >
                            {isUploading ? (
                                <div className="w-full max-w-xs">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>上传中...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            ) : fileUploaded ? (
                                <>
                                    <svg className="w-10 h-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <p className="text-sm text-green-700">文件解析成功，已自动提取关键信息</p>
                                </>
                            ) : (
                                <>
                                    <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-sm text-slate-500">点击上传行业报告 (.pdf, .docx)</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-700">已录入企业列表 ({companies.length})</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">企业名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据来源</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNA状态</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">暂无数据，请在上方添加企业。</td>
                            </tr>
                        )}
                        {companies.map(company => (
                            <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.url}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {company.isGenerating ? (
                                        <span className="flex items-center text-blue-600"><Spinner size="sm"/> <span className="ml-2">生成中...</span></span>
                                    ) : company.dna ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">已生成</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">未生成</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    {!company.dna && !company.isGenerating && (
                                        <button 
                                            onClick={() => generateDna(company.id)} 
                                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                            disabled={aiStatus === AiStatus.GeneratingDna}
                                        >
                                            生成DNA
                                        </button>
                                    )}
                                    <button onClick={() => removeCompany(company.id)} className="text-red-600 hover:text-red-900">移除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
