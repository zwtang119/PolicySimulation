
import React from 'react';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';
import { ReportViewer } from './ReportViewer';
import { Button } from './common/Button';

export const SimulationResult: React.FC = () => {
    const { simulationReport, aiStatus, error, companies } = useData();
    const { navigate } = useUI();

    // 空状态处理：如果没有报告且没有报错，提示用户去仿真
    if (!simulationReport && !error && companies.length > 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] bg-white rounded-lg shadow-sm border border-slate-200 animate-fade-in">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">暂无仿真分析数据</h3>
                <p className="text-slate-500 mb-8 max-w-md text-center leading-relaxed">
                    当前尚未运行策略仿真，或仿真结果已重置。<br/>
                    请前往 <strong>[数据分析与仿真]</strong> 模块输入政策并启动推演。
                </p>
                <Button 
                    variant="primary" 
                    onClick={() => navigate('simulation')}
                    className="shadow-lg px-8 py-3 text-base"
                >
                    前往仿真沙盘
                </Button>
            </div>
        );
    }

    // 如果还没有企业数据
    if (companies.length === 0) {
         return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] bg-white rounded-lg shadow-sm border border-slate-200 animate-fade-in">
                <div className="text-gray-300 text-6xl mb-4">📂</div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">数据缺失</h3>
                <p className="text-slate-500 mb-6">请先录入企业数据。</p>
                <Button onClick={() => navigate('data-entry')}>去录入数据</Button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in h-[calc(100vh-140px)]">
            <ReportViewer 
                report={simulationReport} 
                status={aiStatus} 
                error={error} 
                companies={companies} 
            />
        </div>
    );
};
