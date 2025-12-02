
import React from 'react';
import { SimulationReport, AiStatus, Company } from './types';
import { Spinner } from './components/common/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


interface ReportViewerProps {
    report: SimulationReport | null;
    status: AiStatus;
    error: string | null;
    companies: Company[];
}

const StatusMessage: React.FC<{ status: AiStatus }> = ({ status }) => {
    const messages: Record<string, string> = {
        [AiStatus.Simulating_RunningTurns]: "运行多轮仿真...",
        [AiStatus.Simulating_SynthesizingReport]: "综合并生成报告...",
    };
    if (!messages[status]) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-lg text-gray-500">{messages[status]}</p>
        </div>
    );
};

const ImpactChart: React.FC<{ data: SimulationReport['microAnalysis'] }> = ({ data }) => {
    const chartData = data.map(item => ({
        name: item.companyName,
        '影响分数': item.impactScore,
    }));

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={[-10, 10]} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderColor: '#cbd5e1',
                            backdropFilter: 'blur(2px)',
                        }}
                        labelStyle={{ color: '#334155' }}
                    />
                    <Bar dataKey="影响分数">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry['影响分数'] >= 0 ? '#16a34a' : '#dc2626'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


export const ReportViewer: React.FC<ReportViewerProps> = ({ report, status, error, companies }) => {
    const isSimulating = status !== AiStatus.Ready && status !== AiStatus.GeneratingDna;

    if (isSimulating) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6 h-full flex items-center justify-center">
                <StatusMessage status={status} />
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-red-600 mb-2">仿真出错</h3>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (!report) {
        const hasDna = companies.some(c => !!c.dna);
        const placeholderTitle = "政策动态评估报告";
        const placeholderText = hasDna
            ? "在此处查看仿真结果。请先在左侧面板运行仿真。"
            : "请先在左侧面板添加企业并生成DNA以开始。";

        return (
            <div className="bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-gray-800">{placeholderTitle}</h3>
                <p className="mt-2 text-gray-500">{placeholderText}</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">{report.title}</h2>
            
            <div className="space-y-8">
                 {/* Executive Summary */}
                 <div>
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-blue-700">核心结论摘要</h3>
                    <p className="text-gray-700 whitespace-pre-wrap italic">{report.executiveSummary}</p>
                </div>
                
                {/* Policy Effectiveness */}
                <div>
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-blue-700">政策有效性评估</h3>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-gray-800">目标契合度</h4>
                            <p className="text-sm text-gray-500">{report.policyEffectiveness.goalAlignment}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">影响强度</h4>
                            <p className="text-sm text-gray-500">{report.policyEffectiveness.impactStrength}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">意外效应</h4>
                            <p className="text-sm text-gray-500">{report.policyEffectiveness.unintendedConsequences}</p>
                        </div>
                    </div>
                </div>

                {/* Emergent Patterns */}
                {report.emergentPatterns && report.emergentPatterns.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-blue-700">涌现模式分析</h3>
                        <div className="space-y-4">
                            {report.emergentPatterns.map((pattern, i) => (
                                <div key={i} className="bg-slate-50/70 border border-slate-200 p-4 rounded-md">
                                    <h4 className="font-bold text-md text-amber-600">{pattern.patternName}</h4>
                                    <p className="text-sm text-gray-700 mt-2">{pattern.analysis}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Industry Outlook */}
                <div>
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-blue-700">行业前景展望</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-red-600">潜在风险</h4>
                            <ul className="list-disc list-inside text-sm text-gray-500 mt-1 space-y-1">
                                {report.industryOutlook.emergingRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-600">新兴机遇</h4>
                             <ul className="list-disc list-inside text-sm text-gray-500 mt-1 space-y-1">
                                {report.industryOutlook.newOpportunities.map((opp, i) => <li key={i}>{opp}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Impact Chart */}
                <div>
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 text-blue-700">企业影响概览</h3>
                    <ImpactChart data={report.microAnalysis} />
                </div>

                {/* Micro Analysis */}
                <div>
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-blue-700">详细企业响应（数据支撑）</h3>
                    <div className="space-y-4">
                        {report.microAnalysis.map(item => (
                            <div key={item.companyId} className="bg-slate-50/70 border border-slate-200 p-4 rounded-md">
                                <h4 className="font-bold text-md text-gray-800">{item.companyName}</h4>
                                <p className="text-sm text-gray-700 mt-2"><span className="font-semibold text-gray-500">预测反应: </span>{item.predictedResponse}</p>
                                <p className="text-sm text-gray-500 mt-1"><span className="font-semibold text-gray-500">分析原理: </span>{item.rationale}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
