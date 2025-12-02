import{A as t,r as h,j as e,S as f}from"./index-BB6b09wg.js";import{M as j}from"./MarkdownRenderer-DfT_zI-Y.js";const p=({status:s})=>{const i={[t.PolicyParsing]:"正在解析政策文件...",[t.DnaLoading]:"正在加载企业数字画像...",[t.Simulating_RunningTurns]:"多智能体博弈推演中...",[t.Simulating_Aggregation]:"正在汇总博弈数据...",[t.Simulating_SynthesizingReport]:"正在撰写最终评估报告..."};return i[s]?e.jsxs("div",{className:"flex flex-col items-center justify-center h-full text-center",children:[e.jsx(f,{size:"lg"}),e.jsx("p",{className:"mt-4 text-lg text-gray-500 animate-pulse",children:i[s]})]}):e.jsx("p",{className:"mt-4 text-lg text-gray-500",children:"处理中..."})},v=({report:s,status:i,error:c,companies:x})=>{const u=[t.PolicyParsing,t.DnaLoading,t.Simulating_RunningTurns,t.Simulating_Aggregation,t.Simulating_SynthesizingReport].includes(i),g=h.useMemo(()=>{var l,a,r,o,d,m;return s?`
# ${s.title||"政策仿真推演评估专报"}

---

## 1. 总体研判 (Executive Summary)

${s.executiveSummary||"暂无内容"}

## 2. 实施效能与微观响应 (Mechanism & Response)

- **政策落点与合规度**: ${((l=s.policyEffectiveness)==null?void 0:l.goalAlignment)||"N/A"}
- **行为模式强度**: ${((a=s.policyEffectiveness)==null?void 0:a.impactStrength)||"N/A"}
- **异化风险监测**: ${((r=s.policyEffectiveness)==null?void 0:r.unintendedConsequences)||"N/A"}

## 3. 衍生风险与异化倾向 (Risks & Patterns)

${(s.emergentPatterns||[]).map(n=>`### ${n.patternName}

${n.analysis}`).join(`

`)}

## 4. 中长期发展态势研判 (Future Outlook)

**潜在结构性风险**:

${(((o=s.industryOutlook)==null?void 0:o.emergingRisks)||[]).map(n=>`- ${n}`).join(`
`)}

**战略机遇窗口**:

${(((d=s.industryOutlook)==null?void 0:d.newOpportunities)||[]).map(n=>`- ${n}`).join(`
`)}

**终局格局推演**:

${((m=s.industryOutlook)==null?void 0:m.marketStructurePrediction)||"N/A"}

## 5. 重点主体行为策略监测 (Micro Analysis)

${(s.microAnalysis||[]).map(n=>`### ${n.companyName} (影响评分: ${n.impactScore})

- **预测反应**: ${n.predictedResponse}
- **分析原理**: ${n.rationale}`).join(`

`)}
`.trim():""},[s]);if(u)return e.jsx("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex items-center justify-center min-h-[400px]",children:e.jsx(p,{status:i})});if(c)return e.jsxs("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]",children:[e.jsx("div",{className:"text-red-100 bg-red-600 rounded-full p-3 mb-4",children:e.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),e.jsx("h3",{className:"text-xl font-bold text-red-600 mb-2",children:"仿真过程发生错误"}),e.jsx("p",{className:"text-gray-600 max-w-md",children:c})]});if(!s){const l=x.some(o=>!!o.dna),a="等待仿真结果",r=l?"请在“数据分析与仿真”页面配置并运行仿真，结果将在此处展示。":"请先录入企业数据并生成 DNA。";return e.jsxs("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]",children:[e.jsx("div",{className:"text-gray-200 mb-4",children:e.jsx("svg",{className:"w-16 h-16 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:a}),e.jsx("p",{className:"mt-2 text-gray-500",children:r})]})}return e.jsxs("div",{className:"bg-white shadow-lg rounded-lg h-full flex flex-col",children:[e.jsxs("div",{className:"px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center flex-shrink-0",children:[e.jsx("h2",{className:"text-xl font-bold text-gray-900",children:"仿真结果报告"}),e.jsx("span",{className:"text-xs font-mono text-gray-400",children:"FORMAT: MARKDOWN"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-8 custom-scrollbar",children:e.jsx("div",{className:"prose prose-slate prose-sm max-w-4xl mx-auto",children:e.jsx(j,{content:g})})})]})};export{v as ReportViewer};
