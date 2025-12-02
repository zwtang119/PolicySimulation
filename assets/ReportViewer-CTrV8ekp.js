import{A as i,r as $,j as n,S as N}from"./index-aVURP7xC.js";import{M as k}from"./MarkdownRenderer-DM5o9KIi.js";const v=({status:s})=>{const r={[i.PolicyParsing]:"正在解析政策文件...",[i.DnaLoading]:"正在加载企业数字画像...",[i.Simulating_RunningTurns]:"多智能体博弈推演中...",[i.Simulating_Aggregation]:"正在汇总博弈数据...",[i.Simulating_SynthesizingReport]:"正在撰写最终评估报告..."};return r[s]?n.jsxs("div",{className:"flex flex-col items-center justify-center h-full text-center",children:[n.jsx(N,{size:"lg"}),n.jsx("p",{className:"mt-4 text-lg text-gray-500 animate-pulse",children:r[s]})]}):n.jsx("p",{className:"mt-4 text-lg text-gray-500",children:"处理中..."})},A=({report:s,status:r,error:c,companies:f})=>{const j=[i.PolicyParsing,i.DnaLoading,i.Simulating_RunningTurns,i.Simulating_Aggregation,i.Simulating_SynthesizingReport].includes(r),p=$.useMemo(()=>{var m,d,x,u,g,h;if(!s)return"";const t=s.executiveSummary;let a=t!=null&&t.verdict?`### 总体评价：${t.verdict}

`:"";t!=null&&t.key_takeaways?a+=t.key_takeaways.map(e=>`- **${e.conclusion}** (置信度: ${e.confidence})
  > 证据: ${e.evidence_ref}`).join(`
`):typeof t=="string"?a=t:a="暂无内容";const l=s.riskMatrix;let o="";l?o=`
**行为风险**:
${(l.behavioral_risks||[]).map(e=>`- ${e}`).join(`
`)}

**结构风险**:
${(l.structural_risks||[]).map(e=>`- ${e}`).join(`
`)}

**安全风险**:
${(l.security_risks||[]).map(e=>`- ${e}`).join(`
`)}
            `.trim():o="暂无风险数据";let y=(s.policyRecommendations||[]).map(e=>`
### ${e.action_item}
- **针对对象**: ${e.target_group}
- **紧迫性**: ${e.urgency}
- **理由**: ${e.rationale}
        `).join(`
`);return`
# ${s.title||"政策仿真推演评估专报"}

---

## 1. 总体研判 (Executive Summary)

${a}

## 2. 实施效能与微观响应 (Mechanism & Response)

- **政策落点与合规度**: ${((m=s.policyEffectiveness)==null?void 0:m.goalAlignment)||"N/A"}
- **行为模式强度**: ${((d=s.policyEffectiveness)==null?void 0:d.impactStrength)||"N/A"}
- **异化风险监测**: ${((x=s.policyEffectiveness)==null?void 0:x.unintendedConsequences)||"N/A"}

## 3. 衍生风险与异化倾向 (Risks & Patterns)

${(s.emergentPatterns||[]).map(e=>`### ${e.patternName}

${e.analysis}`).join(`

`)}

## 4. 风险矩阵 (Risk Matrix)

${o}

## 5. 重点主体行为策略监测 (Micro Analysis)

${(s.microAnalysis||[]).map(e=>`### ${e.companyName} (影响评分: ${e.impactScore})

- **预测反应**: ${e.predictedResponse}
- **分析原理**: ${e.rationale}`).join(`

`)}

## 6. 决策建议 (Action Plan)

${y||"暂无建议"}

## 7. 中长期发展态势研判 (Future Outlook)

**潜在结构性风险**:

${(((u=s.industryOutlook)==null?void 0:u.emergingRisks)||[]).map(e=>`- ${e}`).join(`
`)}

**战略机遇窗口**:

${(((g=s.industryOutlook)==null?void 0:g.newOpportunities)||[]).map(e=>`- ${e}`).join(`
`)}

**终局格局推演**:

${((h=s.industryOutlook)==null?void 0:h.marketStructurePrediction)||"N/A"}
`.trim()},[s]);if(j)return n.jsx("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex items-center justify-center min-h-[400px]",children:n.jsx(v,{status:r})});if(c)return n.jsxs("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]",children:[n.jsx("div",{className:"text-red-100 bg-red-600 rounded-full p-3 mb-4",children:n.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:n.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),n.jsx("h3",{className:"text-xl font-bold text-red-600 mb-2",children:"仿真过程发生错误"}),n.jsx("p",{className:"text-gray-600 max-w-md",children:c})]});if(!s){const t=f.some(o=>!!o.dna),a="等待仿真结果",l=t?"请在“数据分析与仿真”页面配置并运行仿真，结果将在此处展示。":"请先录入企业数据并生成 DNA。";return n.jsxs("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]",children:[n.jsx("div",{className:"text-gray-200 mb-4",children:n.jsx("svg",{className:"w-16 h-16 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:n.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}),n.jsx("h3",{className:"text-xl font-bold text-gray-800",children:a}),n.jsx("p",{className:"mt-2 text-gray-500",children:l})]})}return n.jsxs("div",{className:"bg-white shadow-lg rounded-lg h-full flex flex-col",children:[n.jsxs("div",{className:"px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center flex-shrink-0",children:[n.jsx("h2",{className:"text-xl font-bold text-gray-900",children:"仿真结果报告"}),n.jsx("span",{className:"text-xs font-mono text-gray-400",children:"FORMAT: MARKDOWN"})]}),n.jsx("div",{className:"flex-1 overflow-y-auto p-8 custom-scrollbar",children:n.jsx("div",{className:"prose prose-slate prose-sm max-w-4xl mx-auto",children:n.jsx(k,{content:p})})})]})};export{A as ReportViewer};
