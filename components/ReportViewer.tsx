

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

    // 将结构化报告转换为 Markdown 文本，适配新的 6 段式结构
    const markdownContent = useMemo(() => {
        if (!report) return '';
        
        // 1. 核心结论摘要
        const summaryText = report.executiveSummary || "暂无摘要";

        // 2. 政策目标匹配度
        const effect = report.policyEffectiveness || { alignment: '', impactStrength: '', deviations: '' };
        const effectText = `
### 2.1 目标对齐度
${effect.alignment || "N/A"}

### 2.2 政策影响强度
${effect.impactStrength || "N/A"}

### 2.3 非预期效应与偏差
${effect.deviations || "N/A"}
        `.trim();

        // 3. 趋势模式
        const patterns = report.emergentPatterns || [];
        const patternText = patterns.map((p, i) => `
### 3.${i+1} ${p.patternName}
${p.mechanism}
        `).join('\n');

        // 4. 产业结构展望
        const outlook = report.industryOutlook || { newOpportunities: [], newRisks: [], marketStructurePrediction: '' };
        const outlookText = `
### 4.1 新机会
${(Array.isArray(outlook.newOpportunities) ? outlook.newOpportunities : []).map(o => `- ${o}`).join('\n')}

### 4.2 新风险
${(Array.isArray(outlook.newRisks) ? outlook.newRisks : []).map(r => `- ${r}`).join('\n')}

### 4.3 市场结构预测
${outlook.marketStructurePrediction || "N/A"}
        `.trim();

        // 5. 企业微观分析
        const micro = report.microAnalysis || [];
        const microText = micro.map((m, i) => `
### 5.${i+1} ${m.companyName} (影响评分: ${m.impactScore})
- **推演行为**: ${m.behaviorAnalysis}
- **政策含义**: ${m.policyImplication}
        `).join('\n\n');

        // 6. 政策建议
        const recs = report.policyRecommendations || { immediate: [], midTerm: [], longTerm: [] };
        const recText = `
### 6.1 即时建议（0–6个月）
${(Array.isArray(recs.immediate) ? recs.immediate : []).map(r => `- **${r.action}**: ${r.rationale}`).join('\n')}

### 6.2 中期建议（6–24个月）
${(Array.isArray(recs.midTerm) ? recs.midTerm : []).map(r => `- **${r.action}**: ${r.rationale}`).join('\n')}

### 6.3 长期建议（24个月以上）
${(Array.isArray(recs.longTerm) ? recs.longTerm : []).map(r => `- **${r.action}**: ${r.rationale}`).join('\n')}
        `.trim();

        // 附录：术语表
        const glossary = report.glossary || {};
        const glossaryText = Object.keys(glossary).length > 0 ? `
## 附录：术语对照表
| 原始术语 (Code) | 中文释义 |
| :--- | :--- |
${Object.entries(glossary).map(([key, value]) => `| ${key} | ${value} |`).join('\n')}
        ` : '';

        return `
# ${report.title || "政策仿真推演报告"}

---

## 1. 核心结论摘要（决策者三句话版本）
${summaryText}

## 2. 政策目标匹配度评估
${effectText}

## 3. 趋势模式 (Emergent Patterns)
${patternText || "未识别显著模式"}

## 4. 产业结构展望与推演
${outlookText}

## 5. 企业微观分析 (Top Insights)
${microText || "暂无微观分析数据"}

## 6. 政策建议
${recText}

${glossaryText}
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
