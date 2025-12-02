import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { useData } from '../contexts/DataContext';
import { Report } from '../types';

export const ReportExport: React.FC = () => {
    const { reports } = useData();
    const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'md' | 'txt'>('md');

    const toggleReport = (id: string) => {
        if (selectedReportIds.includes(id)) {
            setSelectedReportIds(selectedReportIds.filter(rid => rid !== id));
        } else {
            setSelectedReportIds([...selectedReportIds, id]);
        }
    };

    const toggleAll = () => {
        if (selectedReportIds.length === reports.length) {
            setSelectedReportIds([]);
        } else {
            setSelectedReportIds(reports.map(r => r.id));
        }
    };

    // Helper: Convert Report Object to Markdown String
    const generateMarkdown = (report: Report): string => {
        const c = report.content;
        return `
# ${report.title}
**日期**: ${report.date}
**参演企业数**: ${report.companyCount}

---

## 1. 核心结论摘要
${c.executiveSummary}

## 2. 政策有效性评估
- **目标契合度**: ${c.policyEffectiveness.goalAlignment}
- **影响强度**: ${c.policyEffectiveness.impactStrength}
- **意外效应**: ${c.policyEffectiveness.unintendedConsequences}

## 3. 涌现模式分析
${c.emergentPatterns.map(p => `### ${p.patternName}\n${p.analysis}`).join('\n\n')}

## 4. 行业前景展望
**潜在风险**:
${c.industryOutlook.emergingRisks.map(r => `- ${r}`).join('\n')}

**新兴机遇**:
${c.industryOutlook.newOpportunities.map(o => `- ${o}`).join('\n')}

**市场结构预测**:
${c.industryOutlook.marketStructurePrediction}

## 5. 微观企业响应
${c.microAnalysis.map(m => `### ${m.companyName} (影响: ${m.impactScore})
- **预测反应**: ${m.predictedResponse}
- **分析原理**: ${m.rationale}`).join('\n\n')}
        `.trim();
    };

    // Helper: Convert Report Object to Plain Text String
    const generateTxt = (report: Report): string => {
        const c = report.content;
        return `
================================================================
${report.title}
================================================================
日期: ${report.date}
参演企业数: ${report.companyCount}

[核心结论摘要]
${c.executiveSummary}

[政策有效性评估]
- 目标契合度: ${c.policyEffectiveness.goalAlignment}
- 影响强度: ${c.policyEffectiveness.impactStrength}
- 意外效应: ${c.policyEffectiveness.unintendedConsequences}

[涌现模式分析]
${c.emergentPatterns.map(p => `* ${p.patternName}: ${p.analysis}`).join('\n')}

[行业前景展望]
* 潜在风险:
${c.industryOutlook.emergingRisks.map(r => `  - ${r}`).join('\n')}
* 新兴机遇:
${c.industryOutlook.newOpportunities.map(o => `  - ${o}`).join('\n')}
* 市场结构预测: ${c.industryOutlook.marketStructurePrediction}

[微观企业响应]
${c.microAnalysis.map(m => `* ${m.companyName} (影响: ${m.impactScore})
  - 预测反应: ${m.predictedResponse}
  - 分析原理: ${m.rationale}`).join('\n')}
        `.trim();
    };

    const handleExport = () => {
        setIsExporting(true);
        
        setTimeout(() => {
            const selectedReports = reports.filter(r => selectedReportIds.includes(r.id));
            
            selectedReports.forEach(report => {
                const content = exportFormat === 'md' ? generateMarkdown(report) : generateTxt(report);
                const mimeType = exportFormat === 'md' ? 'text/markdown' : 'text/plain';
                const extension = exportFormat;
                
                const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
                const url = URL.createObjectURL(blob);
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", url);
                downloadAnchorNode.setAttribute("download", `${report.title.replace(/\s+/g, '_')}.${extension}`);
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                URL.revokeObjectURL(url);
            });
            
            setIsExporting(false);
        }, 1000);
    };

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-xl font-bold text-slate-700 mb-2">暂无仿真报告</p>
                <p className="text-slate-500 mb-6">请前往“数据分析与仿真”模块运行您的第一次政策仿真。</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <Card title="报告管理与导出">
                <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
                    <div className="text-sm text-gray-600">
                        <span className="font-bold text-slate-800 mr-2">已生成报告:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold">{reports.length}</span>
                    </div>
                    <div className="space-x-4">
                        <button onClick={toggleAll} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            {selectedReportIds.length === reports.length ? '取消全选' : '全选'}
                        </button>
                        <button onClick={() => setSelectedReportIds([])} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">重置</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8 max-h-[400px] overflow-y-auto">
                    {reports.map(report => (
                        <div 
                            key={report.id} 
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                                selectedReportIds.includes(report.id) ? 'border-slate-900 bg-slate-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => toggleReport(report.id)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                                    selectedReportIds.includes(report.id) ? 'bg-slate-900 border-slate-900' : 'border-gray-300 bg-white'
                                }`}>
                                    {selectedReportIds.includes(report.id) && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <h4 className={`font-bold ${selectedReportIds.includes(report.id) ? 'text-slate-900' : 'text-gray-700'}`}>{report.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">生成日期: {report.date} • 包含企业数: {report.companyCount}</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 group-hover:text-blue-600">
                                点击选择
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-bold text-gray-700">导出格式:</span>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="format" 
                                    checked={exportFormat === 'md'} 
                                    onChange={() => setExportFormat('md')}
                                    className="text-slate-900 focus:ring-slate-900" 
                                />
                                <span className="text-sm">Markdown (.md)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="format" 
                                    checked={exportFormat === 'txt'}
                                    onChange={() => setExportFormat('txt')}
                                    className="text-slate-900 focus:ring-slate-900" 
                                />
                                <span className="text-sm">纯文本 (.txt)</span>
                            </label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">已选 {selectedReportIds.length} 份</span>
                            <Button 
                                className="bg-slate-900 text-white px-6 py-2 shadow-lg transform active:scale-95 transition-all" 
                                onClick={handleExport}
                                disabled={selectedReportIds.length === 0 || isExporting}
                            >
                                {isExporting ? '生成文件中...' : `下载 .${exportFormat.toUpperCase()} 文件`}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}