


import { EnterpriseDNA, SimulationReport, SimulationTurn } from "../types";

// --- Zhipu AI (GLM) Constants ---
const MODEL_HIGH_INTELLECT = "glm-4.5-air"; // 旗舰模型：用于复杂推演
const MODEL_FAST = "glm-4-flash";       // 高速模型：用于搜索与批处理

const API_KEY = process.env.API_KEY;
const API_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";

// --- Error Handling ---
const ZHIPU_ERROR_CODES: Record<string, string> = {
    "400": "参数错误 检查接口参数是否正确",
    "429": "接口请求并发超额 上传文件频率过快 账户余额已用完 账户异常",
    "500": "服务器处理请求时发生错误",
    "1000": "身份验证失败",
    "1113": "您的账户已欠费，请充值后重试",
    "1211": "模型不存在，请检查模型代码",
    "1301": "系统检测到输入或生成内容可能包含不安全或敏感内容，请您避免输入易产生敏感内容的提示语，感谢您的配合",
    "1303": "您当前使用该 API 的频率过高，请降低频率，或联系客服增加限额",
    "1304": "该 API 已达今日调用次数限额，如有更多需求，请联系客服购买"
};

async function handleZhipuError(response: Response) {
    let errorBody: any = {};
    try { errorBody = await response.json(); } catch { }

    const error = errorBody.error || {};
    const code = String(error.code);
    const msg = error.message || response.statusText;
    
    const friendlyMsg = ZHIPU_ERROR_CODES[code] 
        ? `${ZHIPU_ERROR_CODES[code]} (Code: ${code})` 
        : `AI Service Error: ${msg} (${code || response.status})`;

    throw new Error(friendlyMsg);
}

// --- Helper: Robust JSON Extraction ---
function extractJson(text: string): any {
    if (!text) return null;
    try {
        // 1. 尝试直接解析
        return JSON.parse(text);
    } catch (e) {
        // 2. 尝试从 Markdown 代码块提取
        const match = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (match && match[1]) {
            try { return JSON.parse(match[1]); } catch(e2) {}
        }
        // 3. 尝试寻找首尾大括号 (最宽容模式)
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end > start) {
             try { return JSON.parse(text.substring(start, end + 1)); } catch (e3) {}
        }
        throw new Error("无法解析 AI 返回的 JSON 数据，请重试。");
    }
}

// --- Core API Call (Standard & Streaming) ---
async function callZhipuAI(
    model: string, 
    messages: any[], 
    jsonMode: boolean = false,
    enableSearch: boolean = false,
    onToken?: (fullText: string) => void
): Promise<string> {
    if (!API_KEY) throw new Error("未配置 API_KEY，请在 Secrets 中配置 VITE_API_KEY");

    const tools = enableSearch ? [{ "type": "web_search", "web_search": { "enable": true, "search_result": true } }] : undefined;

    const payload: any = {
        model,
        messages,
        temperature: jsonMode ? 0.1 : 0.7, // JSON模式下降低随机性
        top_p: 0.7,
        tools,
        stream: !!onToken,
        request_id: `polaris-${Date.now()}`
    };

    if (jsonMode) {
        payload.response_format = { "type": "json_object" };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) await handleZhipuError(response);

        // Handle Streaming (SSE)
        if (onToken && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = ""; // 累积全文
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ""; // 保留未完成的行

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('data:')) {
                        const dataStr = trimmed.slice(5).trim();
                        if (dataStr === '[DONE]') continue;
                        try {
                            const data = JSON.parse(dataStr);
                            const content = data.choices[0]?.delta?.content || "";
                            if (content) {
                                fullText += content; // 累积内容
                                onToken(fullText);   // 将累积后的全文传给回调
                            }
                        } catch (e) {}
                    }
                }
            }
            return fullText;
        } else {
            const data = await response.json();
            return data.choices[0]?.message?.content || "";
        }
    } catch (error) {
        console.error("Zhipu API Call Failed", error);
        throw error;
    }
}

// --- Business Functions ---

export const generateCompanyDna = async (url: string): Promise<EnterpriseDNA> => {
    // 技巧：清晰的指令 + 角色扮演 + 分隔符 + One-Shot 示例
    const systemPrompt = `你是一名专业的**商业情报分析师**。你的任务是基于Web搜索结果，构建目标企业的“战略基因（DNA）”。

### 指令
1. 使用搜索工具查询目标企业的公开信息。
2. 提取关键维度，严格按照 JSON 格式输出。
3. 如果信息缺失，基于行业常识进行合理推断（如：初创火箭公司通常现金流紧张）。

### 输出 Schema
\`\`\`json
{
    "id": "string (generated)",
    "name": "string",
    "archetype": "string (e.g. 技术颠覆者, 市场跟随者)",
    "description": "string (50字内简介)",
    "rdEffectiveness": "number (0.1-1.0, 研发转化率)",
    "corporateValues": ["string"],
    "riskProfile": {
        "ambitionLevel": "string (survival/domination)",
        "financialRiskAversion": "string (low/medium/high)"
    },
    "legacy": {
        "technologicalDebt": "string (low/medium/high)",
        "regulatoryBurden": "string (low/medium/high)"
    },
    "policySensitivities": {
        "subsidySensitivity": "number (0-1)",
        "regulationSensitivity": "number (0-1)"
    },
    "technologyFocus": ["string"],
    "fundingSource": "string",
    "corporateCulture": "string"
}
\`\`\`
`;
    
    // 使用分隔符标示输入部分
    const userContent = `请分析以下目标：
"""
${url}
"""`;

    const content = await callZhipuAI(MODEL_FAST, [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
    ], true, true);

    return extractJson(content);
};

export const analyzePolicyStructure = async (policyText: string): Promise<void> => {
    const systemPrompt = `你是一个数据预处理助手。请简要扫描用户提供的文本。
    任务：
    1. 判断输入是否为连贯的自然语言文本。
    2. 如果是乱码、纯数字或无意义字符，请忽略。
    3. 如果是有效文本，简要确认其字数和语言类型。
    保持回复简短。`;
    
    // 使用分隔符
    await callZhipuAI(MODEL_HIGH_INTELLECT, [
        { role: "system", content: systemPrompt },
        { role: "user", content: `待检测文本片段：\n"""\n${policyText.substring(0, 500)}...\n"""` }
    ]);
};

export const runSimulationTurn = async (
    policyText: string, 
    companies: any[], 
    turn: number, 
    history: SimulationTurn[]
): Promise<SimulationTurn> => {
    // 技巧：博弈论推演 + 标准行动库 + 状态更新
    const systemPrompt = `你是一个**基于博弈论的理性推演引擎**。你的任务不是写故事，而是基于企业 DNA 和当前局势，计算出**最符合利益最大化**或**生存最小风险**的下一步行动。

### 核心指令：行动标准化
智能体的决策 \`actions\` **必须且只能** 从以下标准动作库中选择（可多选，但需组合合理）：

**A. 投资与研发类**
- \`R&D_Surge\`: 激进增加研发投入（牺牲现金流换技术）
- \`Tech_Pivot\`: 转换技术路线（响应政策号召）
- \`Cost_Cutting\`: 削减非核心开支（保生存）
- \`Talent_Poaching\`: 高薪挖角竞争对手核心人才

**B. 市场与商业类**
- \`Price_War\`: 发动价格战（抢占份额）
- \`Aggressive_Expansion\`: 扩建产能/基地
- \`Gov_Lobbying\`: 游说政府/申请专项补贴
- \`IPO_Sprint\`: 冲刺上市/资本运作

**C. 合作与博弈类**
- \`M&A_Hunter\`: 寻求并购小企业
- \`Alliance_Forming\`: 组建产业联盟
- \`Supply_Chain_Lock\`: 锁定上游关键供应链

**禁止事项**：禁止输出模糊的描述，如“观望”、“努力工作”。

### 任务
根据输入的【环境参数】和【企业列表】，计算第 ${turn} 回合的博弈策略。

### 思考步骤 (Chain of Thought)
对于每一家企业，请在生成 JSON 之前，先在 \`_thought_process\` 字段中进行隐式推理：
1. **感知**: 政策中哪一条款直接影响我的核心利益？
2. **内省**: 我的现金流和技术栈允许我响应吗？
3. **博弈**: 竞争对手（如列表中的其他企业）会怎么做？我该激进还是防守？
4. **决策**: 从标准动作库中选择行动。

### 输出要求：正文全部使用中文表达。所有内部策略标签或英文术语必须在首次出现时给出中文翻译并在括号内保留原始英文（如：研发冲刺（R&DSurge）），随后仅使用中文表述；禁止在正文中出现驼峰、下划线或未翻译的英文标签。报告末尾附‘术语对照表’列出原始标签与中文映射。

### 输出 Schema
\`\`\`json
{ 
    "turn": ${turn}, 
    "decisions": [
        { 
            "companyId": "string", 
            "companyName": "string", 
            "memo": { 
                "_thought_process": "STEP1: 感知... STEP2: 权衡... (推理链条)",
                "perception": "string (关键环境信号)", 
                "internalMonologue": "string (CEO内心独白)", 
                "actions": ["string (Standard Action Enum)"], 
                "reasoning": "string (最终决策逻辑)" 
            },
            "next_state": {
               "cash_flow_status": "string (Critical/Stable/Abundant)",
               "market_position": "string (Leader/Challenger/Niche/Laggard)",
               "policy_compliance_score": "number (0-100)",
               "tech_readiness_level": "number (1-9)"
            }
        }
    ] 
}
\`\`\`
`;

    const shortHistory = history.map(h => ({
        turn: h.turn,
        summaries: h.decisions.map(d => `${d.companyName}在${d.memo.actions.join(',')}，状态：${JSON.stringify(d.next_state)}`)
    }));

    // 使用明确的分隔符构建上下文，防止 Prompt 注入
    const context = `
### 1. 当前环境参数 (Policy/Market)
"""
${policyText.substring(0, 1500)}
"""

### 2. 参演虚拟企业 (Agents)
\`\`\`json
${JSON.stringify(companies.map((c:any) => ({id: c.id, name: c.name, dna: c.dna})))}
\`\`\`

### 3. 过往回合摘要 (History)
\`\`\`json
${JSON.stringify(shortHistory)}
\`\`\`
`;

    const content = await callZhipuAI(MODEL_HIGH_INTELLECT, [
        { role: "system", content: systemPrompt },
        { role: "user", content: context }
    ], true); 

    return extractJson(content);
};

export const aggregateSimulationResults = async (history: SimulationTurn[]): Promise<void> => {
    await new Promise(r => setTimeout(r, 800));
};

export const generateFinalReport = async (
    policyText: string,
    companies: any[],
    history: SimulationTurn[],
    onStream?: (text: string) => void
): Promise<SimulationReport> => {
    // 技巧：国家级战略顾问 + BLUF原则 + 分层建议 + 术语翻译
    const systemPrompt = `你是一名服务于**国家发改委或战略制定部门**的高级产业顾问。你的工作不是描述发生了什么，而是**诊断**政策效果，并提供**可操作的决策建议**。

### 报告生成规则
1. **角色设定**：你是国家级战略参谋，语风需严谨、犀利、有前瞻性。
2. **输出要求**：正文全部使用中文表达。所有内部策略标签或英文术语必须在首次出现时给出中文翻译并在括号内保留原始英文（如：研发冲刺（R&DSurge）），随后仅使用中文表述；禁止在正文中出现驼峰、下划线或未翻译的英文标签。报告末尾附‘术语对照表’列出原始标签与中文映射。
3. **逻辑要求**：
    - **拒绝空谈**：任何结论必须引用仿真日志中的具体事件作为证据链。
    - **三段式论述**：在分析趋势时，必须遵循“产生原因 → 影响路径 → 对政策的启示”的逻辑。

### 报告固定结构（必须严格执行）
1. **核心结论摘要（决策者三句话版本）**：BLUF (Bottom Line Up Front) 原则，直击要害。
2. **政策目标匹配度评估**：
    - 目标对齐度
    - 政策影响强度
    - 非预期效应与偏差
3. **趋势模式 (Emergent Patterns)**：
    - 识别 2-3 个关键模式
    - 每个模式必须包含：产生原因 -> 影响路径 -> 对政策的启示
4. **产业结构展望与推演**：
    - 新机会
    - 新风险
    - 市场结构预测 (如：寡头垄断、百花齐放等)
5. **企业微观分析 (Top Insights)**：
    - 选择最具代表性的企业
    - 分析：得分 -> 推演行为 -> 政策含义
6. **政策建议 (分层)**：
    - 即时建议（0–6个月）：救火、止损
    - 中期建议（6–24个月）：调整、优化
    - 长期建议（24个月以上）：布局、改革

### 输出 Schema
请直接输出 JSON 数据，结构严格如下：
{ 
    "title": "string (报告标题)", 
    "executiveSummary": "string (核心结论摘要，决策者三句话版本，高度浓缩)",
    "policyEffectiveness": {
        "alignment": "string (目标对齐度评估)", 
        "impactStrength": "string (政策影响强度评估)", 
        "deviations": "string (非预期效应与偏差分析)"
    }, 
    "emergentPatterns": [
        { 
            "patternName": "string (模式名称)", 
            "mechanism": "string (产生原因 -> 影响路径 -> 对政策的启示)" 
        }
    ], 
    "industryOutlook": {
        "newOpportunities": ["string (新机会)"], 
        "newRisks": ["string (新风险)"], 
        "marketStructurePrediction": "string (市场结构预测)"
    }, 
    "microAnalysis": [
        { 
            "companyName": "string", 
            "impactScore": number (0-10, 受影响程度), 
            "behaviorAnalysis": "string (推演行为分析)", 
            "policyImplication": "string (对政策的含义)" 
        }
    ],
    "policyRecommendations": {
        "immediate": [{ "action": "string", "rationale": "string" }], 
        "midTerm": [{ "action": "string", "rationale": "string" }], 
        "longTerm": [{ "action": "string", "rationale": "string" }]
    },
    "glossary": {
        "Original_Code": "中文翻译"
    }
}`;

    const context = `
### 输入素材

**1. 政策环境**
"""
${policyText.substring(0, 1000)}...
"""

**2. 参演主体概览**
${companies.map((c:any) => c.name).join(', ')}

**3. 沙盘推演全纪录 (The Truth)**
"""
${JSON.stringify(history.map(h => ({
    turn: h.turn,
    events: h.decisions.map(d => ({
        who: d.companyName,
        did: d.memo.actions,
        why: d.memo.internalMonologue,
        state_after: d.next_state
    }))
})), null, 2)}
"""

请基于以上【沙盘推演全纪录】撰写报告，严格遵循 Schema 结构。
`;

    const content = await callZhipuAI(
        MODEL_HIGH_INTELLECT, 
        [
            { role: "system", content: systemPrompt },
            { role: "user", content: context }
        ], 
        true, // JSON Mode
        false, // No Search
        (fullText) => onStream && onStream(fullText)
    );

    const json = extractJson(content);
    json.turnHistory = history;
    return json;
};

// --- Batch API (GLM-4-Flash Free) ---

export const generateAllDnaBatch = async (companies: any[], onStatus: (s: string) => void): Promise<any[]> => {
    if (!API_KEY) throw new Error("Missing API_KEY");

    // Batch 任务相对简单，保持简洁的 Prompt
    const lines = companies.map((c: any) => JSON.stringify({
        custom_id: `req-${c.id}`,
        method: "POST",
        url: "/v4/chat/completions",
        body: {
            model: MODEL_FAST,
            messages: [
                { role: "system", content: "商业数据助理。基于名称整理企业公开信息为JSON。确保包含 id, name, archetype, description, rdEffectiveness 等核心字段。" },
                { role: "user", content: `企业: ${c.name} (${c.url})` }
            ],
            temperature: 0.1
        }
    }));
    
    const blob = new Blob([lines.join('\n')], { type: 'application/jsonl' });
    const formData = new FormData();
    formData.append('file', blob, 'batch.jsonl');
    formData.append('purpose', 'batch');

    onStatus("上传任务文件...");
    const upRes = await fetch(`${API_BASE_URL}/files`, { method: "POST", headers: { "Authorization": `Bearer ${API_KEY}` }, body: formData });
    if (!upRes.ok) await handleZhipuError(upRes);
    const fileId = (await upRes.json()).id;

    onStatus("创建批处理任务...");
    const batchRes = await fetch(`${API_BASE_URL}/batches`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ input_file_id: fileId, endpoint: "/v4/chat/completions", auto_delete_input_file: true, metadata: { description: "dna_batch" } })
    });
    if (!batchRes.ok) await handleZhipuError(batchRes);
    const batchId = (await batchRes.json()).id;

    let status = "validating";
    while (!["completed", "failed", "cancelled", "expired"].includes(status)) {
        await new Promise(r => setTimeout(r, 3000));
        const checkRes = await fetch(`${API_BASE_URL}/batches/${batchId}`, { headers: { "Authorization": `Bearer ${API_KEY}` } });
        if(!checkRes.ok) await handleZhipuError(checkRes);
        const checkData = await checkRes.json();
        status = checkData.status;
        onStatus(`批处理中... [${status}] ${checkData.request_counts?.completed || 0}/${checkData.request_counts?.total || 0}`);
    }

    if (status !== "completed") throw new Error(`Batch Failed: ${status}`);

    onStatus("下载结果...");
    const finalBatchRes = await fetch(`${API_BASE_URL}/batches/${batchId}`, { headers: { "Authorization": `Bearer ${API_KEY}` } });
    const finalData = await finalBatchRes.json();
    const contentRes = await fetch(`${API_BASE_URL}/files/${finalData.output_file_id}/content`, { headers: { "Authorization": `Bearer ${API_KEY}` } });
    const resultText = await contentRes.text();

    return resultText.trim().split('\n').map(line => {
        try {
            if(!line) return null;
            const row = JSON.parse(line);
            return { companyId: row.custom_id.replace('req-', ''), dna: extractJson(row.response.body.choices[0].message.content) };
        } catch { return null; }
    }).filter(Boolean);
};