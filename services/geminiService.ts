import { EnterpriseDNA, SimulationReport, StrategicMemo, AgentDecision, SimulationTurn } from "../types";

// --- Mock Data Generator (Fallback) ---
// 当没有 API Key 时，使用这些函数生成逼真的演示数据

const getMockDNA = (url: string): EnterpriseDNA => {
    const isSpaceX = url.toLowerCase().includes('spacex');
    const isBlueOrigin = url.toLowerCase().includes('blueorigin');
    const isTraditional = url.toLowerCase().includes('boeing') || url.toLowerCase().includes('lockheed');
    
    // 研发效能推断：SpaceX为1.0标杆
    let rdEff = 0.65; // 默认中等
    if (isSpaceX) rdEff = 1.0;
    else if (isBlueOrigin) rdEff = 0.6; // 历史迭代较慢
    else if (isTraditional) rdEff = 0.3; // 传统军工企业通常流程繁琐
    else rdEff = 0.75; // 一般新兴商业航天初创企业，通常比较敏捷

    return {
        id: `mock-${Date.now()}`,
        name: isSpaceX ? "SpaceX" : (url.includes('landspace') ? "蓝箭航天" : "Generic Aerospace Corp"),
        archetype: isSpaceX ? "技术颠覆者" : "市场跟随者",
        description: "基于Mock模式生成的演示数据：该企业专注于低成本入轨与星座组网。",
        rdEffectiveness: rdEff,
        corporateValues: ["技术驱动", "长期愿景"],
        riskProfile: { ambitionLevel: "行业主导", financialRiskAversion: "低" },
        legacy: { technologicalDebt: "低", regulatoryBurden: "中" },
        policySensitivities: { subsidySensitivity: 0.8, regulationSensitivity: 0.4 },
        technologyFocus: ["可回收火箭", "液氧甲烷发动机"],
        fundingSource: "风险投资",
        corporateCulture: "敏捷迭代"
    };
};

const getMockDecision = (companyName: string, turn: number): StrategicMemo => ({
    perception: "扫描到政策中关于‘液氧甲烷’的强力支持信号，这与我们的技术路线高度一致。",
    internalMonologue: "虽然现金流紧张，但这是千载难逢的机会。如果现在不跟进，未来三年将被边缘化。我们必须赌一把。",
    actions: [
        `启动${turn}号专项研发计划，追加预算15%`,
        "申请入驻海南商业发射场",
        "与上游碳纤维供应商签订长期协议"
    ],
    reasoning: `${companyName}作为技术驱动型企业，决定利用政策窗口期激进扩张。虽然面临短期现金流压力，但长期来看能通过技术壁垒获得超额收益。`
});

const getMockFinalReport = (history: SimulationTurn[]): SimulationReport => ({
    title: "关于液氧甲烷发动机补贴政策的仿真评估报告",
    executiveSummary: "本次仿真显示，补贴政策极大地加速了头部企业的技术迭代速度，但在行业尾部引发了无效的产能过剩。建议在第3年引入‘末位淘汰’机制。",
    policyEffectiveness: {
        goalAlignment: "高 - 核心技术突破符合预期",
        impactStrength: "强 - 头部企业研发投入平均增加40%",
        unintendedConsequences: "中 - 原材料价格因集中采购上涨15%"
    },
    emergentPatterns: [
        { patternName: "技术路线锁定", analysis: "90%的企业放弃了液氧煤油路线，转向液氧甲烷。" },
        { patternName: "人才虹吸效应", analysis: "初创企业核心技术骨干向头部三家企业集中。" }
    ],
    industryOutlook: {
        emergingRisks: ["供应链交付延迟", "融资过热后的估值回调"],
        newOpportunities: ["太空旅游服务的提前商业化", "发动机外销市场打开"],
        marketStructurePrediction: "从‘百花齐放’向‘两超多强’的寡头格局演变"
    },
    microAnalysis: history[0]?.decisions.map(d => ({
        companyId: d.companyId,
        companyName: d.companyName,
        impactScore: Math.floor(Math.random() * 10) - 2,
        predictedResponse: "积极扩张，增加研发投入",
        rationale: "基于低风险厌恶DNA，企业倾向于利用补贴杠杆撬动更多社会资本。"
    })) || [],
    turnHistory: history
});

// --- Zhipu AI (GLM) Service ---

const getApiKey = () => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
        // @ts-ignore
        return import.meta.env.VITE_API_KEY;
    }
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        return process.env.API_KEY;
    }
    return '';
};

const API_KEY = getApiKey();
const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const MODEL_NAME = "glm-4.6"; 

const canRunAI = () => !!API_KEY && API_KEY !== 'undefined' && API_KEY !== '';

// Robust JSON cleaner
const cleanJson = (text: string | undefined): string => {
    if (!text) return "{}";
    // First, try to find a code block marked as json
    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
        return jsonBlockMatch[1].trim();
    }
    // Fallback: try to find the first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return text.substring(firstBrace, lastBrace + 1);
    }
    return text.trim();
};

interface GLMMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface GLMOptions {
    thinking?: boolean;
    webSearch?: boolean;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}

/**
 * Generic function to call Zhipu AI GLM-4 API
 */
const callGLM = async (
    messages: GLMMessage[], 
    options: GLMOptions = {}, 
    onStream?: (content: string) => void
): Promise<string> => {
    const { thinking = false, webSearch = false, temperature = 0.95, stream = false } = options;

    const payload: any = {
        model: MODEL_NAME,
        messages: messages,
        temperature: temperature,
        stream: stream,
        max_tokens: options.maxTokens || 4096,
    };

    // Enable Deep Thinking (GLM-4.6 feature)
    if (thinking) {
        payload.thinking = { type: "enabled" };
    }

    // Enable Web Search (Tools)
    if (webSearch) {
        payload.tools = [{
            type: "web_search",
            web_search: {
                enable: true, // Boolean true is standard for modern APIs, though some legacy docs say "True" string
                search_result: true
            }
        }];
    }

    try {
        const response = await fetch(GLM_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`GLM API Error ${response.status}: ${err}`);
        }

        if (stream && onStream && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullContent = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                // Keep the last line if it's incomplete
                buffer = lines.pop() || ""; 

                for (const line of lines) {
                    if (line.trim().startsWith("data: ")) {
                        const dataStr = line.replace("data: ", "").trim();
                        if (dataStr === "[DONE]") break;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            const choice = data.choices?.[0];
                            
                            // 关键修正：GLM-4.6 的 Thinking 模式下，reasoning_content 是思考过程
                            // 我们只关心最终的 content，或者在需要时才处理思考过程。
                            // 这里为了保证 JSON 解析的纯净性，我们只累加 content。
                            const deltaContent = choice?.delta?.content || "";
                            
                            if (deltaContent) {
                                fullContent += deltaContent;
                                onStream(fullContent);
                            }
                        } catch (e) {
                            // console.warn("SSE Parse Error", e);
                        }
                    }
                }
            }
            return fullContent;
        } else {
            const data = await response.json();
            // Non-streaming response
            return data.choices[0].message.content;
        }

    } catch (error) {
        console.error("GLM Call Failed:", error);
        throw error;
    }
};

/**
 * Robust AI Call Wrapper with Retry Logic
 */
const callAIWithRetry = async <T>(
    apiCall: () => Promise<T>, 
    retries = 2, 
    initialDelay = 1000 
): Promise<T> => {
    let currentDelay = initialDelay;
    
    for (let i = 0; i < retries; i++) {
        try {
            return await apiCall();
        } catch (error: any) {
            const isQuotaError = error.message?.includes('429') || 
                                 error.message?.includes('quota') || 
                                 error.status === 429;
                                 
            // If it's a quota error or we have retries left, wait and retry
            if ((isQuotaError || i < retries - 1) && i < retries - 1) {
                console.warn(`API Error. Retrying in ${currentDelay}ms... (Attempt ${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, currentDelay));
                currentDelay *= 2; 
            } else {
                throw error;
            }
        }
    }
    throw new Error("Failed to call API after multiple retries.");
};

// 1. Policy Parsing
export const analyzePolicyStructure = async (policyText: string): Promise<{ incentives: string[], constraints: string[] }> => {
    if (!canRunAI()) {
        console.warn("No API Key configured. Using Mock Data.");
        return new Promise(resolve => setTimeout(() => resolve({
            incentives: ["研发补贴", "税收减免", "人才引进"],
            constraints: ["环保排放标准", "安全生产红线"]
        }), 500));
    }

    const systemPrompt = `你是一位精通政策科学的专家。请分析政策文本，提取关键的“激励因子”和“约束条件”。返回 JSON 格式。`;
    const userPrompt = `政策文本: "${policyText.substring(0, 5000)}..."\n\n请返回 JSON: { "incentives": ["string"], "constraints": ["string"] }`;

    try {
        const result = await callAIWithRetry(async () => {
            return await callGLM([
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ], { thinking: true }); // Enable Thinking
        });
        return JSON.parse(cleanJson(result));
    } catch (e) {
        console.error("Policy Parse Error", e);
        return { incentives: [], constraints: [] };
    }
};

// 2. DNA Generation
export const generateCompanyDna = async (companyUrl: string): Promise<EnterpriseDNA> => {
    if (!canRunAI()) {
        console.warn("No API Key configured. Using Mock Data.");
        return new Promise(resolve => setTimeout(() => resolve(getMockDNA(companyUrl)), 800));
    }

    const systemInstruction = `你是一位顶尖的商业航天行业战略分析师。
你的任务是基于提供的企业官网内容(或根据名称推断),生成该公司的“企业DNA”档案。
**重要：所有输出文本必须使用简体中文。**`;

    const prompt = `
# 输入
- 企业: ${companyUrl}

# 任务
请检索该企业的最新动态（技术路线、融资情况、最近发射记录），并生成以下 JSON 档案。

# 输出要求
请返回严格的 JSON 格式 (不要使用 Markdown 代码块)。
**注意关于“研发效能(rdEffectiveness)”的评分标准：请以 SpaceX 为绝对标杆(1.0)。**
- SpaceX = 1.0 (极高效率、快速迭代、第一性原理)
- 敏捷型初创企业(如Rocket Lab) = 0.7 ~ 0.9
- 传统国有航天/军工巨头 = 0.2 ~ 0.4 (流程繁琐、成本高)
- 转型中的企业 = 0.4 ~ 0.6

{
  "id": "string",
  "name": "string",
  "archetype": "技术颠覆者|成本领先者|国家队|市场跟随者|绝地求生者|体系依托者",
  "description": "简短描述，20字以内",
  "rdEffectiveness": number, // 0.1-1.2, 浮点数
  "corporateValues": ["string"],
  "riskProfile": { 
      "ambitionLevel": "生存|市场份额|行业垄断|技术皇冠", 
      "financialRiskAversion": "低|中|高" 
  },
  "legacy": { "technologicalDebt": "低|中|高", "regulatoryBurden": "低|中|高" },
  "policySensitivities": {
      "subsidySensitivity": 0.1-1.0,
      "regulationSensitivity": 0.1-1.0
  },
  "technologyFocus": ["string"],
  "fundingSource": "string",
  "corporateCulture": "string"
}
`;
    
    try {
        const result = await callAIWithRetry(async () => {
            return await callGLM([
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ], { webSearch: true }); // Enable Web Search
        });
        return JSON.parse(cleanJson(result));
    } catch (e) {
        console.error("AI Error:", e);
        return getMockDNA(companyUrl);
    }
};

// 3. Simulation Turn
export const runSimulationTurn = async (
    policyText: string, 
    companies: any[], 
    turnIndex: number, 
    previousHistory: any[]
): Promise<SimulationTurn> => {
    if (!canRunAI()) {
        const decisions = companies.map(c => ({
            companyId: c.id,
            companyName: c.name,
            memo: getMockDecision(c.name, turnIndex)
        }));
        return new Promise(resolve => setTimeout(() => resolve({ turn: turnIndex, decisions }), 1000));
    }

    const historySummary = previousHistory.map(h => 
        `[第 ${h.turn} 轮] ${h.decisions.map((d:any) => d.companyName + ': ' + d.memo.actions[0]).join('; ')}`
    ).join('\n\n');

    const decisions: AgentDecision[] = [];
    
    // Serial execution to avoid rate limits
    for (const company of companies) {
        const systemInstruction = `你现在是 **${company.name}** 的CEO。
你的企业DNA: ${JSON.stringify(company.dna)}
你的任务是基于企业DNA和政策环境，制定符合公司利益的战略决策。
**重要：所有思考过程、决策内容和输出必须使用简体中文。**`;

        const prompt = `
# 仿真背景
1. **政策原文**: 
"""
${policyText.substring(0, 5000)}
"""
2. **当前轮次**: 第 ${turnIndex} 轮.
3. **市场动态 (竞争对手行动)**: 
${historySummary || "这是第一轮，尚无历史记录。"}

# 你的战略任务
基于你的DNA（特别是‘战略原型’和‘研发效能’），阅读上述政策原文，并对市场动态做出反应。
必须遵循以下思维链 (CoT) 过程：

1. **Perception (感知)**: 识别政策中直接影响你生存或发展的关键条款，以及竞争对手的威胁动作。
2. **Internal Monologue (内省)**: 第一人称 ("我") 的内心独白。反思你的技术栈（如液氧甲烷、固体火箭等）和资金状况。表达符合你DNA的恐惧、贪婪或雄心。
3. **Strategic Decisions (决策)**: 制定 2-3 个具体的、可执行的行动。要具体（例如“启动ZQ-3项目”，“转型可回收技术”）。
4. **Rationale (归因)**: 解释为什么基于你的DNA和政策激励，这是最佳举措。

# 输出要求
请返回严格的 JSON 格式。不要包含 Markdown 标记。
**再次强调：所有内容必须使用简体中文。**

{
  "perception": "string",
  "internalMonologue": "string",
  "actions": ["string"],
  "reasoning": "string"
}
`;
        try {
            const result = await callAIWithRetry(async () => {
                return await callGLM([
                    { role: "system", content: systemInstruction },
                    { role: "user", content: prompt }
                ], { thinking: true }); // Enable Thinking
            }, 3, 2000); 

            decisions.push({ companyId: company.id, companyName: company.name, memo: JSON.parse(cleanJson(result)) });
        } catch (e) {
            console.error(`AI Failed for ${company.name}`, e);
            decisions.push({ companyId: company.id, companyName: company.name, memo: getMockDecision(company.name, turnIndex) });
        }
    }

    return { turn: turnIndex, decisions };
};

// 4. Aggregation
export const aggregateSimulationResults = async (history: SimulationTurn[]): Promise<any> => {
    if (!canRunAI()) {
        return new Promise(resolve => setTimeout(() => resolve({ status: "success" }), 500));
    }
    return new Promise(resolve => setTimeout(() => resolve({ status: "aggregated" }), 200));
};

// 5. Final Report with Streaming (Optimized with Dynamic Level Detection)
export const generateFinalReport = async (
    policyText: string, 
    companies: any[], 
    history: SimulationTurn[],
    onStream?: (chunk: string) => void
): Promise<SimulationReport> => {
    
    if (!canRunAI()) {
        if (onStream) {
            const mockTitle = "关于液氧甲烷发动机补贴政策的仿真评估报告";
            const mockSummary = "本次仿真显示，补贴政策极大地加速了头部企业的技术迭代速度...";
            let currentText = "";
            const fullText = `# ${mockTitle}\n\n${mockSummary}\n\n... (模拟生成中)`;
            
            for (let i = 0; i < fullText.length; i+=5) {
                currentText += fullText.slice(i, i+5);
                onStream(currentText);
                await new Promise(r => setTimeout(r, 20));
            }
        }
        return new Promise(resolve => setTimeout(() => resolve(getMockFinalReport(history)), 300));
    }

    const historyContext = JSON.stringify(history, null, 2);

    // --- 动态层级判断逻辑 (开始) ---
    let level: 'national' | 'provincial' | 'municipal' = 'provincial'; // 默认为省级
    const textSample = policyText.substring(0, 1000);
    if (textSample.includes('国家') || textSample.includes('国务院') || textSample.includes('部') || textSample.includes('中央')) {
        level = 'national';
    } else if (textSample.includes('市') || textSample.includes('区') || textSample.includes('县')) {
        level = 'municipal';
    }
    // --- 动态层级判断逻辑 (结束) ---

    // --- 差异化角色设定 (System Instruction) ---
    const roleDefinitions = {
        national: `你是指挥部最高战略顾问。你的核心视角是**“国家安全与体系效能”**。
请站在**航天强国**的高度，重点评估政策对**供应链自主可控、国际博弈能力、全国资源统筹**的影响。
你的语言要宏大、稳健、政治站位高。`,
        
        provincial: `你是省政府的首席产业策略官。你的核心视角是**“区域竞争与产业集聚”**。
请站在**全省GDP与招商引资**的角度，重点评估政策能否从周边省份**抢夺龙头企业**，能否形成**本地产业链闭环**。
你的语言要进取、强调比较优势。`,
        
        municipal: `你是市长的经济顾问与招商局专家。你的核心视角是**“项目落地与要素保障”**。
请站在**财政投入产出比**的角度，重点评估政策条款对企业**拿地、建厂、税收**的实际吸引力。
你的语言要务实、具体、关注执行细节。`
    };

    const systemInstruction = `${roleDefinitions[level]}
    
你的任务是基于“多智能体博弈仿真”日志，撰写一份**《政策仿真推演评估专报》**（内参）。
**核心原则**：
1. **问题导向**：不歌功颂德。重点揭示仿真中暴露的“合成谬误”、“政策套利”等风险。
2. **数据支撑**：所有观点必须基于“博弈演化日志”中的具体企业行为。
3. **格式规范**：严格按照要求的 JSON 结构输出。`;

    // --- 差异化分析任务 (User Prompt) ---
    const taskDefinitions = {
        national: `
1. **国家战略一致性**：企业的微观行为是否符合“新质生产力”与“航天强国”的顶层设计？
2. **系统性风险**：是否存在技术路线单一化风险？关键供应链是否仍有对外依赖？
3. **终局预判**：是否形成了有利于参与国际竞争的“航天国家队+商业独角兽”格局？`,

        provincial: `
1. **区域吸引力**：本省政策相比竞争省份（如周边省份），对头部企业是否有足够吸引力？
2. **产业链缺口**：仿真中暴露出本省产业链还缺哪些环节（如缺发动机制造、缺测控）？
3. **终局预判**：能否实现“千亿级产业集群”的目标？还是会出现“有项目无产业”的空心化？`,

        municipal: `
1. **政策实效性**：具体的补贴条款（如房租减免、首台套）是否真的触动了企业的投资决策？
2. **落地痛点**：企业在仿真中是否表现出对用地、人才公寓、能耗指标的顾虑？
3. **终局预判**：未来3年预计能落地多少家实体企业？税收贡献如何？`
    };

    const prompt = `
# 1. 仿真输入数据
**[A] 政策底稿 (节选)**: 
"""
${policyText.substring(0, 3000)}...
"""

**[B] 参演主体**: 
${companies.map(c => `- ${c.name} [类型:${c.dna?.archetype}]`).join('\n')}

**[C] 博弈演化日志**: 
${historyContext}

# 2. 深度思考任务 (Deep Thinking Chain)
请基于你的角色（${level === 'national' ? '国家顾问' : level === 'provincial' ? '省级策略官' : '市级顾问'}），重点执行以下推演：
${taskDefinitions[level]}

# 3. 报告撰写要求 (JSON Schema)
请严格按照以下 JSON 结构输出。**字符串字段建议使用 Markdown 格式（加粗、列表）以增强可读性。**

\`\`\`json
{
  "title": "主标题：需体现公文规范（如：关于《[政策名]》实施效果的仿真推演与风险预警专报）",
  "executiveSummary": "【决策摘要】300字以内。直击要害。包含：核心定性判断（优/良/中/差）、关键量化预测、最大风险点。",
  "policyEffectiveness": { 
      "goalAlignment": "【目标契合度】。分析政策指挥棒是否有效传导。", 
      "impactStrength": "【政策效能】。政策是否改变了企业的惯性轨道？", 
      "unintendedConsequences": "【非预期效应监测】（关键）。揭示仿真中涌现的副作用。" 
  },
  "emergentPatterns": [
      { 
          "patternName": "模式名称（如：‘资源向头部集中的马太效应’）", 
          "analysis": "深度解析：该模式是如何在微观互动中涌现的？对${level === 'national' ? '国家' : '区域'}生态意味着什么？" 
      }
  ],
  "industryOutlook": { 
      "emergingRisks": [
          "风险点1...", 
          "风险点2..."
      ], 
      "newOpportunities": [
          "机遇点1...", 
          "机遇点2..."
      ], 
      "marketStructurePrediction": "终局画像。预测未来的市场竞争格局。" 
  },
  "microAnalysis": [
      { 
          "companyId": "对应输入中的id", 
          "companyName": "企业名称", 
          "impactScore": number, // 评分标准：+10(受益最大) ~ 0(无感) ~ -10(受损/出局)
          "predictedResponse": "基于日志的核心战术总结。", 
          "rationale": "归因诊断。结合企业DNA和政策激励，解释其行为逻辑。" 
      }
  ]
}
\`\`\`
`;

    try {
        // Stream calling via GLM
        // 开启 thinking: true 以激活 GLM-4.6 的深度思考能力
        const fullText = await callGLM([
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
        ], { stream: true, thinking: true }, onStream);

        const cleanedText = cleanJson(fullText);
        
        try {
            const report = JSON.parse(cleanedText);
            report.turnHistory = history; 
            return report;
        } catch (parseError) {
            console.error("JSON Parse Failed. Raw text:", fullText);
            throw new Error("模型生成了非法的 JSON 格式，请重试。");
        }

    } catch (e) {
        console.error("Report Gen Error", e);
        return getMockFinalReport(history);
    }
};
