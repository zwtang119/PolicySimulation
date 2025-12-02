import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { Company, AiStatus } from '../types';

interface DnaGeneratorProps {
    companies: Company[];
    onAddCompany: (url: string) => void;
    onGenerateDna: (id: string) => void;
    onRemoveCompany: (id: string) => void;
    status: AiStatus;
}

export const DnaGenerator: React.FC<DnaGeneratorProps> = ({ companies, onAddCompany, onGenerateDna, onRemoveCompany, status }) => {
    const [companyUrl, setCompanyUrl] = useState('');

    const handleAddClick = () => {
        if (companyUrl.trim()) {
            onAddCompany(companyUrl.trim());
            setCompanyUrl('');
        }
    };
    
    return (
        <Card title="企业DNA生成器 (G-DNA01)">
            <div className="space-y-4">
                <div>
                    <label htmlFor="company-url" className="block text-sm font-medium text-gray-600 mb-1">
                        企业官网 URL
                    </label>
                    <div className="flex space-x-2">
                        <input
                            id="company-url"
                            type="url"
                            value={companyUrl}
                            onChange={(e) => setCompanyUrl(e.target.value)}
                            className="flex-grow bg-white border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="https://www.spacex.com"
                        />
                        <Button onClick={handleAddClick} disabled={!companyUrl.trim()} variant="primary">添加</Button>
                    </div>
                </div>
                <div className="space-y-2">
                     <h4 className="text-sm font-medium text-gray-600 mb-2">企业列表</h4>
                     <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                        {companies.length === 0 && <p className="text-sm text-gray-500">暂无企业。请添加企业以开始。</p>}
                        {companies.map(company => (
                            <div key={company.id} className="flex items-center justify-between bg-slate-100 p-2 rounded-md">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{company.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{company.url}</p>
                                </div>
                                <div className="flex items-center space-x-2 ml-2">
                                    {company.isGenerating ? (
                                        <Spinner />
                                    ) : company.dna ? (
                                        <span className="text-green-600 text-xs font-bold">已生成</span>
                                    ) : (
                                        <Button onClick={() => onGenerateDna(company.id)} size="sm" className="px-2 py-1 text-xs" disabled={status === AiStatus.GeneratingDna}>生成DNA</Button>
                                    )}
                                    <Button onClick={() => onRemoveCompany(company.id)} variant="danger" size="sm" className="px-2 py-1 text-xs">移除</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};