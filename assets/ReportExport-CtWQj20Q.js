import{u as v,r as x,j as t,B as k}from"./index-3AcpJkId.js";import{C as N}from"./Card-B4FjYln4.js";const S=()=>{const{reports:c}=v(),[i,d]=x.useState([]),[u,p]=x.useState(!1),[l,$]=x.useState("md"),y=a=>{i.includes(a)?d(i.filter(e=>e!==a)):d([...i,a])},g=()=>{i.length===c.length?d([]):d(c.map(a=>a.id))},f=a=>{const e=a.content;let r="";e.executiveSummary&&(r=`### 总体评价：${e.executiveSummary.verdict}

`,e.executiveSummary.key_takeaways&&(r+=e.executiveSummary.key_takeaways.map(n=>`- **${n.conclusion}** (置信度: ${n.confidence})
  > 证据: ${n.evidence_ref}`).join(`
`)));let o="";e.riskMatrix&&(o=`
**行为风险**:
${(e.riskMatrix.behavioral_risks||[]).map(n=>`- ${n}`).join(`
`)}

**结构风险**:
${(e.riskMatrix.structural_risks||[]).map(n=>`- ${n}`).join(`
`)}

**安全风险**:
${(e.riskMatrix.security_risks||[]).map(n=>`- ${n}`).join(`
`)}
            `.trim());let s="";return e.policyRecommendations&&(s=e.policyRecommendations.map(n=>`
### ${n.action_item}
- **针对对象**: ${n.target_group}
- **紧迫性**: ${n.urgency}
- **理由**: ${n.rationale}
            `).join(`
`)),`
# ${a.title}
**日期**: ${a.date}
**参演企业数**: ${a.companyCount}

---

## 1. 核心结论摘要
${r}

## 2. 政策有效性评估
- **目标契合度**: ${e.policyEffectiveness.goalAlignment}
- **影响强度**: ${e.policyEffectiveness.impactStrength}
- **意外效应**: ${e.policyEffectiveness.unintendedConsequences}

## 3. 涌现模式分析
${e.emergentPatterns.map(n=>`### ${n.patternName}
${n.analysis}`).join(`

`)}

## 4. 风险矩阵
${o}

## 5. 决策建议
${s}

## 6. 行业前景展望
**潜在风险**:
${e.industryOutlook.emergingRisks.map(n=>`- ${n}`).join(`
`)}

**新兴机遇**:
${e.industryOutlook.newOpportunities.map(n=>`- ${n}`).join(`
`)}

**市场结构预测**:
${e.industryOutlook.marketStructurePrediction}

## 7. 微观企业响应
${e.microAnalysis.map(n=>`### ${n.companyName} (影响: ${n.impactScore})
- **预测反应**: ${n.predictedResponse}
- **分析原理**: ${n.rationale}`).join(`

`)}
        `.trim()},j=a=>{const e=a.content;let r="";e.executiveSummary&&(r=`[总体评价]：${e.executiveSummary.verdict}
`,e.executiveSummary.key_takeaways&&(r+=e.executiveSummary.key_takeaways.map(s=>`- ${s.conclusion} [${s.confidence}]
  证据: ${s.evidence_ref}`).join(`
`)));let o="";return e.riskMatrix&&(o=`
[行为风险]:
${(e.riskMatrix.behavioral_risks||[]).map(s=>`- ${s}`).join(`
`)}

[结构风险]:
${(e.riskMatrix.structural_risks||[]).map(s=>`- ${s}`).join(`
`)}

[安全风险]:
${(e.riskMatrix.security_risks||[]).map(s=>`- ${s}`).join(`
`)}
            `.trim()),`
================================================================
${a.title}
================================================================
日期: ${a.date}
参演企业数: ${a.companyCount}

[核心结论摘要]
${r}

[政策有效性评估]
- 目标契合度: ${e.policyEffectiveness.goalAlignment}
- 影响强度: ${e.policyEffectiveness.impactStrength}
- 意外效应: ${e.policyEffectiveness.unintendedConsequences}

[风险矩阵]
${o}

[涌现模式分析]
${e.emergentPatterns.map(s=>`* ${s.patternName}: ${s.analysis}`).join(`
`)}

[决策建议]
${(e.policyRecommendations||[]).map(s=>`* ${s.action_item} (${s.target_group}, ${s.urgency}) - ${s.rationale}`).join(`
`)}

[行业前景展望]
* 潜在风险:
${e.industryOutlook.emergingRisks.map(s=>`  - ${s}`).join(`
`)}
* 新兴机遇:
${e.industryOutlook.newOpportunities.map(s=>`  - ${s}`).join(`
`)}
* 市场结构预测: ${e.industryOutlook.marketStructurePrediction}

[微观企业响应]
${e.microAnalysis.map(s=>`* ${s.companyName} (影响: ${s.impactScore})
  - 预测反应: ${s.predictedResponse}
  - 分析原理: ${s.rationale}`).join(`
`)}
        `.trim()},b=()=>{p(!0),setTimeout(()=>{c.filter(e=>i.includes(e.id)).forEach(e=>{const r=l==="md"?f(e):j(e),o=l==="md"?"text/markdown":"text/plain",s=l,n=new Blob([r],{type:`${o};charset=utf-8`}),h=URL.createObjectURL(n),m=document.createElement("a");m.setAttribute("href",h),m.setAttribute("download",`${e.title.replace(/\s+/g,"_")}.${s}`),document.body.appendChild(m),m.click(),m.remove(),URL.revokeObjectURL(h)}),p(!1)},1e3)};return c.length===0?t.jsxs("div",{className:"flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow",children:[t.jsx("div",{className:"text-6xl mb-4",children:"📄"}),t.jsx("p",{className:"text-xl font-bold text-slate-700 mb-2",children:"暂无仿真报告"}),t.jsx("p",{className:"text-slate-500 mb-6",children:"请前往“数据分析与仿真”模块运行您的第一次政策仿真。"})]}):t.jsx("div",{className:"space-y-6 animate-fade-in",children:t.jsxs(N,{title:"报告管理与导出",children:[t.jsxs("div",{className:"mb-6 flex justify-between items-center border-b border-gray-100 pb-4",children:[t.jsxs("div",{className:"text-sm text-gray-600",children:[t.jsx("span",{className:"font-bold text-slate-800 mr-2",children:"已生成报告:"}),t.jsx("span",{className:"bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold",children:c.length})]}),t.jsxs("div",{className:"space-x-4",children:[t.jsx("button",{onClick:g,className:"text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors",children:i.length===c.length?"取消全选":"全选"}),t.jsx("button",{onClick:()=>d([]),className:"text-sm text-gray-400 hover:text-gray-600 transition-colors",children:"重置"})]})]}),t.jsx("div",{className:"grid grid-cols-1 gap-4 mb-8 max-h-[400px] overflow-y-auto",children:c.map(a=>t.jsxs("div",{className:`border rounded-lg p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group ${i.includes(a.id)?"border-slate-900 bg-slate-50 shadow-md":"border-gray-200 hover:border-gray-300 hover:shadow-sm"}`,onClick:()=>y(a.id),children:[t.jsxs("div",{className:"flex items-center space-x-4",children:[t.jsx("div",{className:`w-6 h-6 rounded border flex items-center justify-center transition-colors ${i.includes(a.id)?"bg-slate-900 border-slate-900":"border-gray-300 bg-white"}`,children:i.includes(a.id)&&t.jsx("svg",{className:"w-4 h-4 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:3,d:"M5 13l4 4L19 7"})})}),t.jsxs("div",{children:[t.jsx("h4",{className:`font-bold ${i.includes(a.id)?"text-slate-900":"text-gray-700"}`,children:a.title}),t.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["生成日期: ",a.date," • 包含企业数: ",a.companyCount]})]})]}),t.jsx("div",{className:"text-xs text-gray-400 group-hover:text-blue-600",children:"点击选择"})]},a.id))}),t.jsx("div",{className:"bg-gray-50 p-4 rounded-lg border border-gray-200",children:t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsxs("div",{className:"flex items-center space-x-4",children:[t.jsx("span",{className:"text-sm font-bold text-gray-700",children:"导出格式:"}),t.jsxs("label",{className:"flex items-center space-x-2 cursor-pointer",children:[t.jsx("input",{type:"radio",name:"format",checked:l==="md",onChange:()=>$("md"),className:"text-slate-900 focus:ring-slate-900"}),t.jsx("span",{className:"text-sm",children:"Markdown (.md)"})]}),t.jsxs("label",{className:"flex items-center space-x-2 cursor-pointer",children:[t.jsx("input",{type:"radio",name:"format",checked:l==="txt",onChange:()=>$("txt"),className:"text-slate-900 focus:ring-slate-900"}),t.jsx("span",{className:"text-sm",children:"纯文本 (.txt)"})]})]}),t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsxs("span",{className:"text-sm text-gray-500",children:["已选 ",i.length," 份"]}),t.jsx(k,{className:"bg-slate-900 text-white px-6 py-2 shadow-lg transform active:scale-95 transition-all",onClick:b,disabled:i.length===0||u,children:u?"生成文件中...":`下载 .${l.toUpperCase()} 文件`})]})]})})]})})};export{S as ReportExport};
