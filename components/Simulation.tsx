
import React, { useState, useEffect, useRef } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { AiStatus } from '../types';
import { Spinner } from './common/Spinner';
import { useData } from '../contexts/DataContext';
import { useUI } from '../contexts/UIContext';

export const Simulation: React.FC = () => {
    const { 
        companies, selectedCompanyIds, setSelectedCompanyIds, toggleCompanySelection,
        runSimulation, aiStatus, simulationReport, setSimulationReport, 
        simulationProgress, progressLogs, reportPreviewText
    } = useData();
    
    const { navigate } = useUI();
    const [policyText, setPolicyText] = useState('');
    const [simulationDepth, setSimulationDepth] = useState(1); // Default to 1 (Quick Scan)
    
    const previewRef = useRef<HTMLDivElement>(null);

    const isLoading = aiStatus !== AiStatus.Ready && aiStatus !== AiStatus.Completed;
    
    // 判断是否应该显示结果页面（包括生成中和生成后）
    // 当处于 "合成报告" 阶段 或 报告已存在时，显示结果页
    const showResultView = aiStatus === AiStatus.Simulating_SynthesizingReport || simulationReport !== null;

    // Scroll preview to bottom only when generating
    useEffect(() => {
        if (previewRef.current && aiStatus === AiStatus.Simulating_SynthesizingReport) {
            previewRef.current.scrollTop = previewRef.current.scrollHeight;
        }
    }, [reportPreviewText, aiStatus]);

    // Step logic based on granular AiStatus
    const getStepStatus = (stepIndex: number) => {
        let currentStep = 0;
        if (aiStatus === AiStatus.PolicyParsing) currentStep = 1;
        if (aiStatus === AiStatus.DnaLoading) currentStep = 2;
        if (aiStatus === AiStatus.Simulating_RunningTurns) currentStep = 3;
        if (aiStatus === AiStatus.Simulating_Aggregation) currentStep = 4;
        if (aiStatus === AiStatus.Simulating_SynthesizingReport) currentStep = 5;
        if (aiStatus === AiStatus.Completed) currentStep = 6; // Finished all

        // Step index is 0-based
        const actualStep = stepIndex + 1;

        if (currentStep > actualStep) return 'done';
        if (currentStep === actualStep) return 'process';
        return 'wait';
    };

    const steps = [
        { title: '读取政策', index: 0 },
        { title: '读取画像', index: 1 },
        { title: '执行仿真', index: 2 },
        { title: '分析汇总', index: 3 },
        { title: '生成报告', index: 4 }
    ];

    // Select all companies by default if none selected
    useEffect(() => {
        if (selectedCompanyIds.length === 0 && companies.length > 0) {
            setSelectedCompanyIds(companies.map(c => c.id));
        }
    }, [companies]);

    // --- 视图：仿真结果 / 实时生成预览 ---
    if (showResultView) {
        const isGenerating = aiStatus === AiStatus.Simulating_SynthesizingReport;

        return (
            <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
                {/* 顶部导航栏 */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            {isGenerating ? '仿真结果生成中...' : '仿真文本预览'}
                        </h2>
                        
                        {/* 状态指示器 */}
                        {isGenerating && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center animate-pulse">
                                <Spinner size="sm" className="mr-1" /> Polaris AI 撰写中
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => { setSimulationReport(null); }} 
                            className={`text-sm ${isGenerating ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}`}
                            disabled={isGenerating}
                        >
                            ← 重置并返回配置
                        </button>
                        
                        {/* 核心引导按钮：查看政策报告 */}
                        <Button 
                            onClick={() => navigate('simulation-result')}
                            disabled={isGenerating}
                            variant="primary"
                            className="shadow-md"
                        >
                            查看政策报告 →
                        </Button>
                    </div>
                </div>

                {/* 主内容区：实时预览视图 */}
                <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-lg border border-slate-200 relative">
                    <div className="h-full flex flex-col">
                        {/* 模拟文档工具栏 */}
                        <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 space-x-2 flex-shrink-0">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="h-4 w-px bg-slate-300 mx-2"></div>
                            <div className="text-xs text-slate-500 font-mono">polaris_report_stream.md</div>
                            <div className="flex-1"></div>
                            <div className="text-xs font-mono">
                                {isGenerating ? (
                                    <span className="text-blue-600 animate-pulse">● Receiving Stream...</span>
                                ) : (
                                    <span className="text-green-600">● Completed</span>
                                )}
                            </div>
                        </div>
                        
                        {/* 流式文本区域 */}
                        <div 
                            ref={previewRef}
                            className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed text-slate-800 bg-white relative"
                        >
                            {reportPreviewText ? (
                                <div className="whitespace-pre-wrap max-w-4xl mx-auto pb-20">
                                    {reportPreviewText}
                                    {isGenerating && (
                                        <span className="inline-block w-2.5 h-5 bg-blue-600 ml-1 animate-pulse align-text-bottom"></span>
                                    )}
                                </div>
                            ) : (
                                // 初始骨架屏状态
                                <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                                    <div className="h-8 bg-slate-100 rounded w-3/4 mb-8"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        <div className="h-4 bg-slate-100 rounded w-11/12"></div>
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    </div>
                                    <div className="h-64 bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                                        正在综合博弈数据与因果归因...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- 视图：参数配置与运行沙盘 ---
    return (
        <div className="space-y-6 animate-fade-in relative">
            <Card title="政策仿真沙盘">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Inputs */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">1. 选择参演企业 ({selectedCompanyIds.length}/{companies.length})</label>
                            <div className="border rounded-md p-3 bg-slate-50 h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {companies.length === 0 ? (
                                    <div className="col-span-2 text-center text-gray-400 text-sm py-10">暂无企业，请先去数据录入添加</div>
                                ) : (
                                    companies.map(c => (
                                        <label key={c.id} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-2 rounded transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedCompanyIds.includes(c.id)}
                                                onChange={() => toggleCompanySelection(c.id)}
                                                disabled={isLoading}
                                                className="rounded text-slate-900 focus:ring-slate-900 disabled:opacity-50" 
                                            />
                                            <span className={`text-sm truncate ${isLoading ? 'text-gray-400' : 'text-slate-700'}`}>{c.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">2. 仿真深度配置 (轮次)</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => setSimulationDepth(1)}
                                    disabled={isLoading}
                                    className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
                                        simulationDepth === 1 
                                            ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    🚀 快速预览 (1轮)
                                </button>
                                <button
                                    onClick={() => setSimulationDepth(2)}
                                    disabled={isLoading}
                                    className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
                                        simulationDepth === 2 
                                            ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    ⚖️ 标准推演 (2轮)
                                </button>
                                <button
                                    onClick={() => setSimulationDepth(3)}
                                    disabled={isLoading}
                                    className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
                                        simulationDepth === 3 
                                            ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    🧠 深度博弈 (3轮)
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                * 推荐使用“快速预览”以节省 Token 并获得即时反馈。深度博弈耗时较长。
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">3. 输入政策文本</label>
                            <textarea
                                className="w-full border border-gray-300 rounded p-3 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100"
                                placeholder="在此处粘贴政策文本，例如：'对使用国产液氧甲烷发动机的企业提供2000万元补贴...'"
                                value={policyText}
                                onChange={(e) => setPolicyText(e.target.value)}
                                disabled={isLoading}
                            ></textarea>
                        </div>
                    </div>

                    {/* Right: Progress & Logs */}
                    <div className="flex-1 border-l border-gray-200 pl-8 flex flex-col relative">
                        <h4 className="font-bold text-lg mb-6 text-slate-800">仿真控制台</h4>
                        
                        {/* Progress Steps (5 Steps) */}
                        <div className="relative flex justify-between mb-8">
                            {/* Connection Line */}
                            <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>
                            
                            {steps.map((step) => {
                                const s = getStepStatus(step.index);
                                return (
                                    <div key={step.index} className="flex flex-col items-center bg-white px-1">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-500 ${
                                            s === 'done' ? 'bg-green-500 text-white' : 
                                            s === 'process' ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-400'
                                        }`}>
                                            {s === 'done' ? '✓' : step.index + 1}
                                        </div>
                                        <span className={`text-[10px] sm:text-xs mt-2 text-center whitespace-nowrap ${s === 'process' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>{step.title}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Real-time Logs (Console) */}
                        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto mb-4 flex flex-col-reverse">
                            {isLoading || aiStatus === AiStatus.Completed ? (
                                <>
                                    {progressLogs.length === 0 && <span className="text-slate-500">等待开始...</span>}
                                    {progressLogs.map((log, i) => (
                                        <div key={i} className="mb-1 border-l-2 border-blue-500 pl-2 animate-fade-in">
                                            <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span> <span className="text-gray-300">{log}</span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    系统就绪，等待指令
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {isLoading && (
                            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
                                    style={{ width: `${simulationProgress}%` }}
                                ></div>
                            </div>
                        )}

                        <div className="mt-auto">
                            <Button 
                                className="w-full bg-slate-900 text-white h-12 text-lg disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md"
                                onClick={() => runSimulation(policyText, simulationDepth)}
                                disabled={isLoading || !policyText || selectedCompanyIds.length === 0}
                            >
                                {isLoading ? <><Spinner className="mr-2 text-white" /> 计算中 ({Math.round(simulationProgress)}%)...</> : '开始运行仿真'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
