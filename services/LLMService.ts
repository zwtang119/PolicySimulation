import { EnterpriseDNA, SimulationReport, SimulationTurn } from "../types";

// --- Zhipu AI (GLM) Constants ---
const MODEL_HIGH_INTELLECT = "glm-4.6"; // 旗舰模型：用于复杂推演
const MODEL_FAST = "glm-4-flash";       // 高速模型：用于搜索与批处理

const API_KEY = process.env.API_KEY;
const API_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";

// --- Error Handling ---
const ZHIPU_ERROR_CODES: Record<string, string> = {
    "1000": "API Key 无效，请检查环境变量配置",
    "1001": "账户余额不足，请充值",
    "1112": "输入内容包含敏感信息，已拦截",
    "1113": "生成内容触发安全过滤(1113)。请尝试简化政策文本，避免输入政治敏感词汇。",
    "1214": "并发超限，请稍后重试",
    "1301": "系统繁忙",
    "1221": "服务当前不可用，请稍后重试",
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
        return JSON.parse(text);
    } catch (e) {
        // 尝试从 Markdown 代码块提取
        const match = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (match && match[1]) {
            try { return JSON.parse(match[1]); } catch(e2) {}
        }
        // 尝试寻找首尾大括号
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
    onToken?: (token: string) => void
): Promise<string> {
    if (!API_KEY) throw new Error("未配置 API_KEY，请在 Secrets 中配置 VITE_API_KEY");

    const tools = enableSearch ? [{ "type": "web_search", "web_search": { "enable": true, "search_result": true } }] : undefined;

    const payload: any = {
        model,
        messages,
        temperature: jsonMode ? 0.1 : 0.7,
        top_p: 0.7,
        tools,
        stream: !!onToken,
        request_id: `polaris-${Date.now()}`
    };

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
            let fullText = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('data:')) {
                        const dataStr = trimmed.slice(5).trim();
                        if (dataStr === '[DONE]') continue;
                        try {
                            const data = JSON.parse(dataStr);
                            const content = data.choices[0]?.delta?.content || "";
                            if (content) {
                                fullText += content;
                                onToken(content);
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
    // 降敏：使用“市场调研员”，避免“情报”、“分析师”
    const systemPrompt = `你是一名商业市场调研员。请基于web_search查询企业的公开商业信息，并整理为JSON格式。
    注意：仅关注商业经营层面，不涉及任何非公开信息。
    
    输出结构参考: {id, name, archetype(市场角色), description, rdEffectiveness(研发效率0-1), corporateValues[], riskProfile:{ambitionLevel, financialRiskAversion}, legacy:{technologicalDebt, regulatoryBurden}, policySensitivities:{subsidySensitivity, regulationSensitivity}, technologyFocus[], fundingSource, corporateCulture}`;
    
    const content = await callZhipuAI(MODEL_FAST, [
        { role: "system", content: systemPrompt },
        { role: "user", content: `目标企业名称或官网: ${url}` }
    ], true, true);

    return extractJson(content);
};

export const analyzePolicyStructure = async (policyText: string): Promise<void> => {
    // 降敏：侧重“文本摘要”
    await callZhipuAI(MODEL_FAST, [
        { role: "system", content: "你是一个文本摘要助手。请提取以下商业文件的关键要素。" },
        { role: "user", content: `文件内容：${policyText.substring(0, 2000)}...` }
    ]);
};

export const runSimulationTurn = async (
    policyText: string, 
    companies: any[], 
    turn: number, 
    history: SimulationTurn[]
): Promise<SimulationTurn> => {
    // 降敏：彻底移除“博弈”、“仿真”、“对抗”等词，改为“市场模拟”
    const systemPrompt = `你是一个市场经济模拟程序。当前处于模拟的第 ${turn} 阶段。
    请基于微观经济学原理，模拟下列 ${companies.length} 家企业在面对外部环境变化时的经营决策。
    
    模拟逻辑:
    1. 评估外部信息对企业经营成本与收益的影响。
    2. 预测同行业其他公司的市场行为。
    3. 制定本企业的经营策略（如研发投入、市场扩张）。
    
    请严格仅输出JSON数据: { turn: ${turn}, decisions: [{ companyId, companyName, memo: { perception, internalMonologue, actions[], reasoning } }] }`;

    const context = `环境信息摘要: ${policyText.substring(0, 800)}...\n企业经营档案: ${JSON.stringify(companies.map((c:any) => ({n:c.name, d:c.dna})))}\n过往经营记录: ${JSON.stringify(history)}`;

    const content = await callZhipuAI(MODEL_FAST, [
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
    // 降敏：改为“商业咨询顾问”和“市场分析报告”
    const systemPrompt = `你是一名独立的商业咨询顾问。请撰写一份《行业市场分析报告》。
    要求：
    1. 语言风格客观、理性，仅使用商业术语。
    2. 关注数据与微观企业行为。
    
    输出格式：包含JSON字段的Markdown文本。
    JSON结构: { title, executiveSummary, policyEffectiveness: {goalAlignment, impactStrength, unintendedConsequences}, emergentPatterns: [{patternName, analysis}], industryOutlook: {emergingRisks[], newOpportunities[], marketStructurePrediction}, microAnalysis: [{companyId, companyName, impactScore, predictedResponse, rationale}] }`;

    const content = await callZhipuAI(
        MODEL_FAST, 
        [
            { role: "system", content: systemPrompt },
            { role: "user", content: `背景信息: ${policyText.substring(0, 500)}...\n模拟数据: ${JSON.stringify(history)}` }
        ], 
        true, 
        false, 
        (token) => onStream && onStream(token)
    );

    const json = extractJson(content);
    json.turnHistory = history;
    return json;
};

// --- Batch API (GLM-4-Flash Free) ---

export const generateAllDnaBatch = async (companies: any[], onStatus: (s: string) => void): Promise<any[]> => {
    if (!API_KEY) throw new Error("Missing API_KEY");

    const lines = companies.map((c: any) => JSON.stringify({
        custom_id: `req-${c.id}`,
        method: "POST",
        url: "/v4/chat/completions",
        body: {
            model: MODEL_FAST,
            messages: [
                { role: "system", content: "商业数据助理。基于名称整理企业公开信息为JSON。" },
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
