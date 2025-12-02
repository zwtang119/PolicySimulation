

import React, { useMemo } from 'react';
import { SimulationReport, AiStatus, Company } from '../types';
import { Spinner } from './common/Spinner';
import { MarkdownRenderer } from './common/MarkdownRenderer';

interface ReportViewerProps {
    report: SimulationReport | null;
    status: AiStatus;
    error: string | null;
    companies: Company[];
}

const StatusMessage: React.FC<{ status: AiStatus }> = ({ status }) => {
    const messages: Record<string, string> = {
        [AiStatus.PolicyParsing]: "正在解析政策文件...",
        [AiStatus.DnaLoading]: "正在加载企业数字画像...",
        [AiStatus.Simulating_RunningTurns]: "多智能体博弈推演中...",
        [AiStatus.Simulating_Aggregation]: "正在汇总博弈数据...",
        [AiStatus.Simulating_SynthesizingReport]: "正在撰写最终评估报告...",
    };
    
    if (!messages[status]) return <p className="mt-4 text-lg text-gray-500">处理中...</p>;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-lg text-gray-500 animate-pulse">{messages[status]}</p>
        </div>
    );
};

export const ReportViewer: React.FC<ReportViewerProps> = ({ report, status, error, companies }) => {
    // 修正：明确界定哪些状态属于"仿真进行中"，排除 Completed
    const isSimulating = [
        AiStatus.PolicyParsing,
        AiStatus.DnaLoading,
        AiStatus.Simulating_RunningTurns,
        AiStatus.Simulating_Aggregation,
        AiStatus.Simulating_SynthesizingReport
    ].includes(status);

    // 将结构化报告转换为 Markdown 文本，与导出格式保持一致
    // 关键修复：确保标题与正文、段落之间有足够的换行符 (\n\n)，否则自定义 Markdown 解析器会渲染错误
    const markdownContent = useMemo(() => {
        if (!report) return '';
        
        // 处理 Executive Summary
        const summary = report.executiveSummary;
        let summaryText = summary?.verdict ? `### 总体评价：${summary.verdict}\n\n` : '';
        if (summary?.key_takeaways) {
            summaryText += summary.key_takeaways.map(k => `- **${k.conclusion}** (置信度: ${k.confidence})\n  > 证据: ${k.evidence_ref}`).join('\n');
        } else if (typeof summary === 'string') {
             summaryText = summary;
        } else {
             summaryText = "暂无内容";
        }

        // 处理 Risk Matrix
        const risks = report.riskMatrix;
        let riskText = "";
        if (risks) {
            riskText = `
**行为风险**:
${(risks.behavioral_risks || []).map(r => `- ${r}`).join('\n')}

**结构风险**:
${(risks.structural_risks || []).map(r => `- ${r}`).join('\n')}

**安全风险**:
${(risks.security_risks || []).map(r => `- ${r}`).join('\n')}
            `.trim();
        } else {
            riskText = "暂无风险数据";
        }

        // 处理 Recommendations
        const recommendations = report.policyRecommendations || [];
        let recText = recommendations.map(r => `
### ${r.action_item}
- **针对对象**: ${r.target_group}
- **紧迫性**: ${r.urgency}
- **理由**: ${r.rationale}
        `).join('\n');


        return `
# ${report.title || "政策仿真推演评估专报"}

---

## 1. 总体研判 (Executive Summary)

${summaryText}

## 2. 实施效能与微观响应 (Mechanism & Response)

- **政策落点与合规度**: ${report.policyEffectiveness?.goalAlignment || "N/A"}
- **行为模式强度**: ${report.policyEffectiveness?.impactStrength || "N/A"}
- **异化风险监测**: ${report.policyEffectiveness?.unintendedConsequences || "N/A"}

## 3. 衍生风险与异化倾向 (Risks & Patterns)

${(report.emergentPatterns || []).map(p => `### ${p.patternName}\n\n${p.analysis}`).join('\n\n')}

## 4. 风险矩阵 (Risk Matrix)

${riskText}

## 5. 重点主体行为策略监测 (Micro Analysis)

${(report.microAnalysis || []).map(m => `### ${m.companyName} (影响评分: ${m.impactScore})

- **预测反应**: ${m.predictedResponse}
- **分析原理**: ${m.rationale}`).join('\n\n')}

## 6. 决策建议 (Action Plan)

${recText || "暂无建议"}

## 7. 中长期发展态势研判 (Future Outlook)

**潜在结构性风险**:

${(report.industryOutlook?.emergingRisks || []).map(r => `- ${r}`).join('\n')}

**战略机遇窗口**:

${(report.industryOutlook?.newOpportunities || []).map(o => `- ${o}`).join('\n')}

**终局格局推演**:

${report.industryOutlook?.marketStructurePrediction || "N/A"}
`.trim();
    }, [report]);

    if (isSimulating) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6 h-full flex items-center justify-center min-h-[400px]">
                <StatusMessage status={status} />
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="text-red-100 bg-red-600 rounded-full p-3 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">仿真过程发生错误</h3>
                <p className="text-gray-600 max-w-md">{error}</p>
            </div>
        );
    }

    if (!report) {
        const hasDna = companies.some(c => !!c.dna);
        const placeholderTitle = "等待仿真结果";
        const placeholderText = hasDna
            ? "请在“数据分析与仿真”页面配置并运行仿真，结果将在此处展示。"
            : "请先录入企业数据并生成 DNA。";

        return (
            <div className="bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="text-gray-200 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{placeholderTitle}</h3>
                <p className="mt-2 text-gray-500">{placeholderText}</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg h-full flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">仿真结果报告</h2>
                <span className="text-xs font-mono text-gray-400">FORMAT: MARKDOWN</span>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="prose prose-slate prose-sm max-w-4xl mx-auto">
                    <MarkdownRenderer content={markdownContent} />
                </div>
            </div>
        </div>
    );
};
