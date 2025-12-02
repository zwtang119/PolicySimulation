import{u as N,r as o,j as e,B as v}from"./index-DVDMW9Fx.js";import{C as k}from"./Card-DaxQEPSa.js";const E=()=>{const{reports:i}=N(),[a,r]=o.useState([]),[d,m]=o.useState(!1),[l,x]=o.useState("md"),p=s=>{a.includes(s)?r(a.filter(t=>t!==s)):r([...a,s])},h=()=>{a.length===i.length?r([]):r(i.map(s=>s.id))},g=s=>{const t=s.content;return`
# ${s.title}
**日期**: ${s.date}
**参演企业数**: ${s.companyCount}

---

## 1. 核心结论摘要
${t.executiveSummary}

## 2. 政策有效性评估
- **目标契合度**: ${t.policyEffectiveness.goalAlignment}
- **影响强度**: ${t.policyEffectiveness.impactStrength}
- **意外效应**: ${t.policyEffectiveness.unintendedConsequences}

## 3. 涌现模式分析
${t.emergentPatterns.map(n=>`### ${n.patternName}
${n.analysis}`).join(`

`)}

## 4. 行业前景展望
**潜在风险**:
${t.industryOutlook.emergingRisks.map(n=>`- ${n}`).join(`
`)}

**新兴机遇**:
${t.industryOutlook.newOpportunities.map(n=>`- ${n}`).join(`
`)}

**市场结构预测**:
${t.industryOutlook.marketStructurePrediction}

## 5. 微观企业响应
${t.microAnalysis.map(n=>`### ${n.companyName} (影响: ${n.impactScore})
- **预测反应**: ${n.predictedResponse}
- **分析原理**: ${n.rationale}`).join(`

`)}
        `.trim()},f=s=>{const t=s.content;return`
================================================================
${s.title}
================================================================
日期: ${s.date}
参演企业数: ${s.companyCount}

[核心结论摘要]
${t.executiveSummary}

[政策有效性评估]
- 目标契合度: ${t.policyEffectiveness.goalAlignment}
- 影响强度: ${t.policyEffectiveness.impactStrength}
- 意外效应: ${t.policyEffectiveness.unintendedConsequences}

[涌现模式分析]
${t.emergentPatterns.map(n=>`* ${n.patternName}: ${n.analysis}`).join(`
`)}

[行业前景展望]
* 潜在风险:
${t.industryOutlook.emergingRisks.map(n=>`  - ${n}`).join(`
`)}
* 新兴机遇:
${t.industryOutlook.newOpportunities.map(n=>`  - ${n}`).join(`
`)}
* 市场结构预测: ${t.industryOutlook.marketStructurePrediction}

[微观企业响应]
${t.microAnalysis.map(n=>`* ${n.companyName} (影响: ${n.impactScore})
  - 预测反应: ${n.predictedResponse}
  - 分析原理: ${n.rationale}`).join(`
`)}
        `.trim()},j=()=>{m(!0),setTimeout(()=>{i.filter(t=>a.includes(t.id)).forEach(t=>{const n=l==="md"?g(t):f(t),b=l==="md"?"text/markdown":"text/plain",y=l,$=new Blob([n],{type:`${b};charset=utf-8`}),u=URL.createObjectURL($),c=document.createElement("a");c.setAttribute("href",u),c.setAttribute("download",`${t.title.replace(/\s+/g,"_")}.${y}`),document.body.appendChild(c),c.click(),c.remove(),URL.revokeObjectURL(u)}),m(!1)},1e3)};return i.length===0?e.jsxs("div",{className:"flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow",children:[e.jsx("div",{className:"text-6xl mb-4",children:"📄"}),e.jsx("p",{className:"text-xl font-bold text-slate-700 mb-2",children:"暂无仿真报告"}),e.jsx("p",{className:"text-slate-500 mb-6",children:"请前往“数据分析与仿真”模块运行您的第一次政策仿真。"})]}):e.jsx("div",{className:"space-y-6 animate-fade-in",children:e.jsxs(k,{title:"报告管理与导出",children:[e.jsxs("div",{className:"mb-6 flex justify-between items-center border-b border-gray-100 pb-4",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"font-bold text-slate-800 mr-2",children:"已生成报告:"}),e.jsx("span",{className:"bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold",children:i.length})]}),e.jsxs("div",{className:"space-x-4",children:[e.jsx("button",{onClick:h,className:"text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors",children:a.length===i.length?"取消全选":"全选"}),e.jsx("button",{onClick:()=>r([]),className:"text-sm text-gray-400 hover:text-gray-600 transition-colors",children:"重置"})]})]}),e.jsx("div",{className:"grid grid-cols-1 gap-4 mb-8 max-h-[400px] overflow-y-auto",children:i.map(s=>e.jsxs("div",{className:`border rounded-lg p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group ${a.includes(s.id)?"border-slate-900 bg-slate-50 shadow-md":"border-gray-200 hover:border-gray-300 hover:shadow-sm"}`,onClick:()=>p(s.id),children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("div",{className:`w-6 h-6 rounded border flex items-center justify-center transition-colors ${a.includes(s.id)?"bg-slate-900 border-slate-900":"border-gray-300 bg-white"}`,children:a.includes(s.id)&&e.jsx("svg",{className:"w-4 h-4 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:3,d:"M5 13l4 4L19 7"})})}),e.jsxs("div",{children:[e.jsx("h4",{className:`font-bold ${a.includes(s.id)?"text-slate-900":"text-gray-700"}`,children:s.title}),e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["生成日期: ",s.date," • 包含企业数: ",s.companyCount]})]})]}),e.jsx("div",{className:"text-xs text-gray-400 group-hover:text-blue-600",children:"点击选择"})]},s.id))}),e.jsx("div",{className:"bg-gray-50 p-4 rounded-lg border border-gray-200",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-sm font-bold text-gray-700",children:"导出格式:"}),e.jsxs("label",{className:"flex items-center space-x-2 cursor-pointer",children:[e.jsx("input",{type:"radio",name:"format",checked:l==="md",onChange:()=>x("md"),className:"text-slate-900 focus:ring-slate-900"}),e.jsx("span",{className:"text-sm",children:"Markdown (.md)"})]}),e.jsxs("label",{className:"flex items-center space-x-2 cursor-pointer",children:[e.jsx("input",{type:"radio",name:"format",checked:l==="txt",onChange:()=>x("txt"),className:"text-slate-900 focus:ring-slate-900"}),e.jsx("span",{className:"text-sm",children:"纯文本 (.txt)"})]})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("span",{className:"text-sm text-gray-500",children:["已选 ",a.length," 份"]}),e.jsx(v,{className:"bg-slate-900 text-white px-6 py-2 shadow-lg transform active:scale-95 transition-all",onClick:j,disabled:a.length===0||d,children:d?"生成文件中...":`下载 .${l.toUpperCase()} 文件`})]})]})})]})})};export{E as ReportExport};
