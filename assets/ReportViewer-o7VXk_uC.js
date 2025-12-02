import{A as s,r as w,j as e,S as b}from"./index-Cau-3Nv0.js";import{M as v}from"./MarkdownRenderer-CWoB3nwY.js";const k=({status:n})=>{const i={[s.PolicyParsing]:"正在解析政策文件...",[s.DnaLoading]:"正在加载企业数字画像...",[s.Simulating_RunningTurns]:"多智能体博弈推演中...",[s.Simulating_Aggregation]:"正在汇总博弈数据...",[s.Simulating_SynthesizingReport]:"正在撰写最终评估报告..."};return i[n]?e.jsxs("div",{className:"flex flex-col items-center justify-center h-full text-center",children:[e.jsx(b,{size:"lg"}),e.jsx("p",{className:"mt-4 text-lg text-gray-500 animate-pulse",children:i[n]})]}):e.jsx("p",{className:"mt-4 text-lg text-gray-500",children:"处理中..."})},R=({report:n,status:i,error:x,companies:u})=>{const h=[s.PolicyParsing,s.DnaLoading,s.Simulating_RunningTurns,s.Simulating_Aggregation,s.Simulating_SynthesizingReport].includes(i),p=w.useMemo(()=>{if(!n)return"";const o=n.executiveSummary||"暂无摘要",a=n.policyEffectiveness||{alignment:"",impactStrength:"",deviations:""},l=`
### 2.1 目标对齐度
${a.alignment||"N/A"}

### 2.2 政策影响强度
${a.impactStrength||"N/A"}

### 2.3 非预期效应与偏差
${a.deviations||"N/A"}
        `.trim(),j=(n.emergentPatterns||[]).map((t,r)=>`
### 3.${r+1} ${t.patternName}
${t.mechanism}
        `).join(`
`),c=n.industryOutlook||{newOpportunities:[],newRisks:[],marketStructurePrediction:""},f=`
### 4.1 新机会
${(c.newOpportunities||[]).map(t=>`- ${t}`).join(`
`)}

### 4.2 新风险
${(c.newRisks||[]).map(t=>`- ${t}`).join(`
`)}

### 4.3 市场结构预测
${c.marketStructurePrediction||"N/A"}
        `.trim(),$=(n.microAnalysis||[]).map((t,r)=>`
### 5.${r+1} ${t.companyName} (影响评分: ${t.impactScore})
- **推演行为**: ${t.behaviorAnalysis}
- **政策含义**: ${t.policyImplication}
        `).join(`

`),m=n.policyRecommendations||{immediate:[],midTerm:[],longTerm:[]},y=`
### 6.1 即时建议（0–6个月）
${(m.immediate||[]).map(t=>`- **${t.action}**: ${t.rationale}`).join(`
`)}

### 6.2 中期建议（6–24个月）
${(m.midTerm||[]).map(t=>`- **${t.action}**: ${t.rationale}`).join(`
`)}

### 6.3 长期建议（24个月以上）
${(m.longTerm||[]).map(t=>`- **${t.action}**: ${t.rationale}`).join(`
`)}
        `.trim(),g=n.glossary||{},N=Object.keys(g).length>0?`
## 附录：术语对照表
| 原始术语 (Code) | 中文释义 |
| :--- | :--- |
${Object.entries(g).map(([t,r])=>`| ${t} | ${r} |`).join(`
`)}
        `:"";return`
# ${n.title||"政策仿真推演报告"}

---

## 1. 核心结论摘要（决策者三句话版本）
${o}

## 2. 政策目标匹配度评估
${l}

## 3. 趋势模式 (Emergent Patterns)
${j||"未识别显著模式"}

## 4. 产业结构展望与推演
${f}

## 5. 企业微观分析 (Top Insights)
${$||"暂无微观分析数据"}

## 6. 政策建议
${y}

${N}
`.trim()},[n]);if(h)return e.jsx("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex items-center justify-center min-h-[400px]",children:e.jsx(k,{status:i})});if(x)return e.jsxs("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]",children:[e.jsx("div",{className:"text-red-100 bg-red-600 rounded-full p-3 mb-4",children:e.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),e.jsx("h3",{className:"text-xl font-bold text-red-600 mb-2",children:"仿真过程发生错误"}),e.jsx("p",{className:"text-gray-600 max-w-md",children:x})]});if(!n){const o=u.some(d=>!!d.dna),a="等待仿真结果",l=o?"请在“数据分析与仿真”页面配置并运行仿真，结果将在此处展示。":"请先录入企业数据并生成 DNA。";return e.jsxs("div",{className:"bg-white shadow-lg rounded-lg p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]",children:[e.jsx("div",{className:"text-gray-200 mb-4",children:e.jsx("svg",{className:"w-16 h-16 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:a}),e.jsx("p",{className:"mt-2 text-gray-500",children:l})]})}return e.jsxs("div",{className:"bg-white shadow-lg rounded-lg h-full flex flex-col",children:[e.jsxs("div",{className:"px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center flex-shrink-0",children:[e.jsx("h2",{className:"text-xl font-bold text-gray-900",children:"仿真结果报告"}),e.jsx("span",{className:"text-xs font-mono text-gray-400",children:"FORMAT: MARKDOWN"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-8 custom-scrollbar",children:e.jsx("div",{className:"prose prose-slate prose-sm max-w-4xl mx-auto",children:e.jsx(v,{content:p})})})]})};export{R as ReportViewer};
