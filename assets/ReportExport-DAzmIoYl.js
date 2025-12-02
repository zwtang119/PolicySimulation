import{u as A,r as g,j as t,B as E}from"./index-Cau-3Nv0.js";import{C as R}from"./Card-DiFdwV1j.js";const S=()=>{const{reports:r}=A(),[a,p]=g.useState([]),[j,y]=g.useState(!1),[x,b]=g.useState("md"),f=n=>{a.includes(n)?p(a.filter(s=>s!==n)):p([...a,n])},N=()=>{a.length===r.length?p([]):p(r.map(n=>n.id))},v=n=>{var m,d,c,i,h,$;const s=n.content,l=s.policyRecommendations||{immediate:[],midTerm:[],longTerm:[]},u=s.glossary||{};return`
# ${n.title}
**日期**: ${n.date}
**参演企业数**: ${n.companyCount}

---

## 1. 核心结论摘要（决策者三句话版本）
${s.executiveSummary||"暂无"}

## 2. 政策目标匹配度评估
### 2.1 目标对齐度
${((m=s.policyEffectiveness)==null?void 0:m.alignment)||"N/A"}

### 2.2 政策影响强度
${((d=s.policyEffectiveness)==null?void 0:d.impactStrength)||"N/A"}

### 2.3 非预期效应与偏差
${((c=s.policyEffectiveness)==null?void 0:c.deviations)||"N/A"}

## 3. 趋势模式 (Emergent Patterns)
${(s.emergentPatterns||[]).map((e,o)=>`### 3.${o+1} ${e.patternName}
${e.mechanism}`).join(`

`)}

## 4. 产业结构展望与推演
### 4.1 新机会
${(((i=s.industryOutlook)==null?void 0:i.newOpportunities)||[]).map(e=>`- ${e}`).join(`
`)}

### 4.2 新风险
${(((h=s.industryOutlook)==null?void 0:h.newRisks)||[]).map(e=>`- ${e}`).join(`
`)}

### 4.3 市场结构预测
${(($=s.industryOutlook)==null?void 0:$.marketStructurePrediction)||"N/A"}

## 5. 企业微观分析 (Top Insights)
${(s.microAnalysis||[]).map((e,o)=>`### 5.${o+1} ${e.companyName} (影响: ${e.impactScore})
- **推演行为**: ${e.behaviorAnalysis}
- **政策含义**: ${e.policyImplication}`).join(`

`)}

## 6. 政策建议
### 6.1 即时建议（0–6个月）
${(l.immediate||[]).map(e=>`- **${e.action}**: ${e.rationale}`).join(`
`)}

### 6.2 中期建议（6–24个月）
${(l.midTerm||[]).map(e=>`- **${e.action}**: ${e.rationale}`).join(`
`)}

### 6.3 长期建议（24个月以上）
${(l.longTerm||[]).map(e=>`- **${e.action}**: ${e.rationale}`).join(`
`)}

## 附录：术语对照表
| 原始术语 | 中文释义 |
| :--- | :--- |
${Object.entries(u).map(([e,o])=>`| ${e} | ${o} |`).join(`
`)}
        `.trim()},k=n=>{var m,d,c,i,h,$;const s=n.content,l=s.policyRecommendations||{immediate:[],midTerm:[],longTerm:[]},u=s.glossary||{};return`
================================================================
${n.title}
================================================================
日期: ${n.date}
参演企业数: ${n.companyCount}

[1. 核心结论摘要（决策者三句话版本）]
${s.executiveSummary||"暂无"}

[2. 政策目标匹配度评估]
* 目标对齐度:
${((m=s.policyEffectiveness)==null?void 0:m.alignment)||"N/A"}

* 政策影响强度:
${((d=s.policyEffectiveness)==null?void 0:d.impactStrength)||"N/A"}

* 非预期效应与偏差:
${((c=s.policyEffectiveness)==null?void 0:c.deviations)||"N/A"}

[3. 趋势模式]
${(s.emergentPatterns||[]).map((e,o)=>`${o+1}. ${e.patternName}
   机制: ${e.mechanism}`).join(`
`)}

[4. 产业结构展望]
* 新机会:
${(((i=s.industryOutlook)==null?void 0:i.newOpportunities)||[]).map(e=>`  - ${e}`).join(`
`)}
* 新风险:
${(((h=s.industryOutlook)==null?void 0:h.newRisks)||[]).map(e=>`  - ${e}`).join(`
`)}
* 市场结构预测: 
${(($=s.industryOutlook)==null?void 0:$.marketStructurePrediction)||"N/A"}

[5. 企业微观分析]
${(s.microAnalysis||[]).map((e,o)=>`${o+1}. ${e.companyName} (影响: ${e.impactScore})
   推演行为: ${e.behaviorAnalysis}
   政策含义: ${e.policyImplication}`).join(`
`)}

[6. 政策建议]
[即时建议 0-6月]
${(l.immediate||[]).map(e=>`* ${e.action}: ${e.rationale}`).join(`
`)}

[中期建议 6-24月]
${(l.midTerm||[]).map(e=>`* ${e.action}: ${e.rationale}`).join(`
`)}

[长期建议 24月+]
${(l.longTerm||[]).map(e=>`* ${e.action}: ${e.rationale}`).join(`
`)}

[附录: 术语对照]
${Object.entries(u).map(([e,o])=>`${e} = ${o}`).join(`
`)}
        `.trim()},w=()=>{y(!0),setTimeout(()=>{r.filter(s=>a.includes(s.id)).forEach(s=>{const l=x==="md"?v(s):k(s),u=x==="md"?"text/markdown":"text/plain",m=x,d=new Blob([l],{type:`${u};charset=utf-8`}),c=URL.createObjectURL(d),i=document.createElement("a");i.setAttribute("href",c),i.setAttribute("download",`${s.title.replace(/\s+/g,"_")}.${m}`),document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(c)}),y(!1)},1e3)};return r.length===0?t.jsxs("div",{className:"flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow",children:[t.jsx("div",{className:"text-6xl mb-4",children:"📄"}),t.jsx("p",{className:"text-xl font-bold text-slate-700 mb-2",children:"暂无仿真报告"}),t.jsx("p",{className:"text-slate-500 mb-6",children:"请前往“数据分析与仿真”模块运行您的第一次政策仿真。"})]}):t.jsx("div",{className:"space-y-6 animate-fade-in",children:t.jsxs(R,{title:"报告管理与导出",children:[t.jsxs("div",{className:"mb-6 flex justify-between items-center border-b border-gray-100 pb-4",children:[t.jsxs("div",{className:"text-sm text-gray-600",children:[t.jsx("span",{className:"font-bold text-slate-800 mr-2",children:"已生成报告:"}),t.jsx("span",{className:"bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold",children:r.length})]}),t.jsxs("div",{className:"space-x-4",children:[t.jsx("button",{onClick:N,className:"text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors",children:a.length===r.length?"取消全选":"全选"}),t.jsx("button",{onClick:()=>p([]),className:"text-sm text-gray-400 hover:text-gray-600 transition-colors",children:"重置"})]})]}),t.jsx("div",{className:"grid grid-cols-1 gap-4 mb-8 max-h-[400px] overflow-y-auto",children:r.map(n=>t.jsxs("div",{className:`border rounded-lg p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group ${a.includes(n.id)?"border-slate-900 bg-slate-50 shadow-md":"border-gray-200 hover:border-gray-300 hover:shadow-sm"}`,onClick:()=>f(n.id),children:[t.jsxs("div",{className:"flex items-center space-x-4",children:[t.jsx("div",{className:`w-6 h-6 rounded border flex items-center justify-center transition-colors ${a.includes(n.id)?"bg-slate-900 border-slate-900":"border-gray-300 bg-white"}`,children:a.includes(n.id)&&t.jsx("svg",{className:"w-4 h-4 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:3,d:"M5 13l4 4L19 7"})})}),t.jsxs("div",{children:[t.jsx("h4",{className:`font-bold ${a.includes(n.id)?"text-slate-900":"text-gray-700"}`,children:n.title}),t.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["生成日期: ",n.date," • 包含企业数: ",n.companyCount]})]})]}),t.jsx("div",{className:"text-xs text-gray-400 group-hover:text-blue-600",children:"点击选择"})]},n.id))}),t.jsx("div",{className:"bg-gray-50 p-4 rounded-lg border border-gray-200",children:t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsxs("div",{className:"flex items-center space-x-4",children:[t.jsx("span",{className:"text-sm font-bold text-gray-700",children:"导出格式:"}),t.jsxs("label",{className:"flex items-center space-x-2 cursor-pointer",children:[t.jsx("input",{type:"radio",name:"format",checked:x==="md",onChange:()=>b("md"),className:"text-slate-900 focus:ring-slate-900"}),t.jsx("span",{className:"text-sm",children:"Markdown (.md)"})]}),t.jsxs("label",{className:"flex items-center space-x-2 cursor-pointer",children:[t.jsx("input",{type:"radio",name:"format",checked:x==="txt",onChange:()=>b("txt"),className:"text-slate-900 focus:ring-slate-900"}),t.jsx("span",{className:"text-sm",children:"纯文本 (.txt)"})]})]}),t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsxs("span",{className:"text-sm text-gray-500",children:["已选 ",a.length," 份"]}),t.jsx(E,{className:"bg-slate-900 text-white px-6 py-2 shadow-lg transform active:scale-95 transition-all",onClick:w,disabled:a.length===0||j,children:j?"生成文件中...":`下载 .${x.toUpperCase()} 文件`})]})]})})]})})};export{S as ReportExport};
