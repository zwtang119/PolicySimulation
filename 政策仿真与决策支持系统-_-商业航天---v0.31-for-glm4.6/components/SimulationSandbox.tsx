import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Company } from '../types';
import { Spinner } from './common/Spinner';

interface SimulationSandboxProps {
    companies: Company[];
    selectedCompanies: string[];
    setSelectedCompanies: (ids: string[]) => void;
    onRunSimulation: (policyText: string) => void;
    isLoading: boolean;
}

export const SimulationSandbox: React.FC<SimulationSandboxProps> = ({ companies, selectedCompanies, setSelectedCompanies, onRunSimulation, isLoading }) => {
    const [policyText, setPolicyText] = useState('');
    
    const handleCompanyToggle = (companyId: string) => {
        const newSelection = selectedCompanies.includes(companyId)
            ? selectedCompanies.filter(id => id !== companyId)
            : [...selectedCompanies, companyId];
        setSelectedCompanies(newSelection);
    };

    const runnableCompanies = companies.filter(c => c.dna);

    return (
        <Card title="政策仿真沙盘 (F-SIM01)">
            <div className="space-y-4">
                <div>
                    <label htmlFor="policy-text" className="block text-sm font-medium text-gray-600 mb-1">
                        1. 粘贴政策文本
                    </label>
                    <textarea
                        id="policy-text"
                        rows={6}
                        value={policyText}
                        onChange={(e) => setPolicyText(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="在此处粘贴或上传政策文本..."
                    />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">2. 选择参与仿真的企业</h4>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-2">
                        {runnableCompanies.length === 0 && <p className="text-sm text-gray-500 col-span-full">请先生成企业DNA以进行选择。</p>}
                        {runnableCompanies.map(company => (
                            <label key={company.id} className="flex items-center space-x-2 bg-slate-100 p-2 rounded-md hover:bg-slate-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCompanies.includes(company.id)}
                                    onChange={() => handleCompanyToggle(company.id)}
                                    className="h-4 w-4 rounded bg-white border-gray-300 text-blue-500 focus:ring-blue-600"
                                />
                                <span className="text-sm font-medium truncate">{company.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button 
                        onClick={() => onRunSimulation(policyText)} 
                        disabled={isLoading || !policyText || selectedCompanies.length === 0}
                        className="w-full sm:w-auto"
                        variant="primary"
                    >
                        {isLoading ? <Spinner /> : '运行仿真'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};