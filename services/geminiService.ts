import { EnterpriseDNA, SimulationReport, StrategicMemo, AgentDecision, SimulationTurn, ReportLevel } from "../types";

// --- Configuration: Model Tiering & Rate Limits ---
// 优先读取 VITE_ 前缀的环境变量 (Vite标准)，兼容 process.env (Node环境)
const API_KEY = (import.meta as any).env?.VITE_API_KEY || (typeof process !== 'undefined' ? process.env?.API_KEY : '') || '';
const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

// 统一管理模型配置：名称与并发限制
// 注意：限制值设定得比官方上限略低，以留有余地
const MODELS = {
    SMART: { name: "glm-4.6", limit: 4 },      // 主力推理，官方限制 5
    BALANCED: { name: "glm-4-air", limit: 15 }, // 搜索/生成，官方限制 30
    FAST: { name: "glm-4-flash", limit: 20 }    // 简单提取，官方限制 30
};

const canRunAI = () => !!API_KEY && API_KEY !== 'undefined';

// --- Utilities ---

// 鲁棒的 JSON 清洗器
const cleanJson = (text: string | undefined): string => {
    if (!text) return "{}";
    const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    return match ? match[1] || match[0] : text.trim();
};

// 政策层级检测
export const detectReportLevel = (text: string): ReportLevel => {
    if (text.includes('国家') || text.includes('国务院') || text.includes('部委')) return 'national';
    if (text.includes('市') || text.includes('区') || text.includes('县')) return 'municipal';
    return 'provincial';
};

/**
 * 核心并发调度器：突破串行瓶颈，同时保护 API 不超限
 * @param items 待处理项数组
 * @param limit 并发限制数
 * @param task 处理函数
 */
async function runBatch<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
    const results: Promise<R>[] = [];
    const executing: Promise<void>[] = [];

    for (const item of items) {
        const p = task(item);
        results.push(p);
        
        // 当任务完成时，从正在执行的列表中移除
        const e = p.then(() => { executing.splice(executing.indexOf(e), 1); });
        executing.push(e);

        // 如果达到并发限制，等待任意一个任务完成
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}

// --- AI Core ---

async function callGLM(
    messages: any[], 
    options: { model: string, thinking?: boolean, webSearch?: boolean, stream?: boolean }, 
    onStream?: (c: string) => void
): Promise<string> {
    const payload: any = {
        model: options.model,
        messages,
        temperature: 0.95,
        stream: options.stream ?? false,
        max_tokens: 4096
    };

    // 仅特定模型支持 Thinking
    if (options.thinking && (options.model === "glm-4.6" || options.model === "glm-4.5v")) {
        payload.thinking = { type: "enabled" };
    }
    
    // 启用联网搜索
    if (options.webSearch) {
        payload.tools = [{ type: "web_search", web_search: { enable: true, search_result: true } }];
    }

    try {
        const res = await fetch(GLM_API_URL, {
            method: "POST",
            headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`GLM Error ${res.status}: ${errorText}`);
        }

        // 处理流式响应
        if (options.stream && res.body && onStream) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            // 过滤掉 thinking 过程内容，只获取最终 content
                            const delta = data.choices[0]?.delta?.content || "";
                            if (delta) { fullText += delta; onStream(fullText); }
                        } catch (e) { /* ignore parse errors */ }
                    }
                }
            }
            return fullText;
        }
        
        // 处理普通响应
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) {
        console.error("AI Call Failed", e);
        throw e;
    }
}

// 简单的重试包装器
async function retry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
    for (let i = 0; i <= retries; i++) {
        try { return await fn(); }
        catch (e: any) {
            if (i === retries) throw e;
            // 如果是限流错误 (429)，指数退避
            if (e.message?.includes('429')) {
                console.warn(`Rate limited. Retrying in ${(i + 1) * 2}s...`);
                await new Promise(r => setTimeout(r, 2000 * (i + 1)));
            } else {
                // 其他错误也稍微等待一下
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }
    throw new Error("Retry failed");
}

// --- Business Services ---

// 1. 政策解析 (使用 Flash 模型，高并发)
export const analyzePolicyStructure = async (policyText: string) => {
    if (!canRunAI()) return { incentives: [], constraints: [] }; 
    
    const prompt = `你是一位精通政策科学的专家。请分析政策文本，提取关键的“激励因子”和“约束条件”。
    政策文本: "${policyText.substring(0, 4000)}..."
    请返回 JSON: { "incentives": ["string"], "constraints": ["string"] }`;
    
    try {
        const res = await retry(() => callGLM(
            [{ role: "user", content: prompt }],
            { model: MODELS.FAST.name } // 使用 Flash
        ));
        return JSON.parse(cleanJson(res));
    } catch (e) {
        console.error("Policy Parse Error", e);
        return { incentives: [], constraints: [] };
    }
};

// 2. DNA 生成 (使用 Air 模型 + 联网搜索，中等并发)
export const generateCompanyDna = async (url: string): Promise<EnterpriseDNA> => {
    if (!canRunAI()) return getMockDNA(url);

    const prompt = `检索 ${url} 的最新动态（技术路线、融资情况、最近发射记录），并生成该公司的“企业DNA”档案。
    **注意关于“研发效能(rdEffectiveness)”的评分标准：请以 SpaceX 为绝对标杆(1.0)。**
    - SpaceX = 1.0 (极高效率、快速迭代)
    - 敏捷型初创企业 = 0.7 ~ 0.9
    - 传统国有航天 = 0.2 ~ 0.4
    
    请返回严格的 JSON 格式:
    {
      "id": "string",
      "name": "string",
      "archetype": "技术颠覆者|成本领先者|国家队|市场跟随者|绝地求生者|体系依托者",
      "description": "简短描述，20字以内",
      "rdEffectiveness": number, // 0.1-1.2
      "corporateValues": ["string"],
      "riskProfile": { "ambitionLevel": "生存|市场份额|行业垄断|技术皇冠", "financialRiskAversion": "低|中|高" },
      "legacy": { "technologicalDebt": "低|中|高", "regulatoryBurden": "低|中|高" },
      "policySensitivities": { "subsidySensitivity": 0.1-1.0, "regulationSensitivity": 0.1-1.0 },
      "technologyFocus": ["string"],
      "fundingSource": "string",
      "corporateCulture": "string"
    }`;
    
    try {
        const res = await retry(() => callGLM(
            [{ role: "user", content: prompt }],
            { model: MODELS.BALANCED.name, webSearch: true } // 使用 Air + 联网
        ));
        const dna = JSON.parse(cleanJson(res));
        // 确保 ID 存在且不覆盖原有 ID (如果前端需要保持一致性，这里通常是生成新数据)
        return { ...dna, id: dna.id || `gen-${Date.now()}` };
    } catch (e) {
        console.error("DNA Gen Error", e);
        return getMockDNA(url);
    }
};

// 3. 仿真推演 (使用 4.6 模型 + 深度思考，低并发)
export const runSimulationTurn = async (policyText: string, companies: any[], turnIndex: number, history: any[]): Promise<SimulationTurn> => {
    if (!canRunAI()) {
        const decisions = companies.map((c: any) => ({ companyId: c.id, companyName: c.name, memo: getMockDecision(c.name, turnIndex) }));
        return { turn: turnIndex, decisions };
    }

    const historySummary = history.map(h => `[第 ${h.turn} 轮] ${h.decisions.map((d:any) => d.companyName + ':' + d.memo.actions[0]).join('; ')}`).join('\n');

    // 定义单个企业的决策任务
    const task = async (company: any): Promise<AgentDecision> => {
        const sys = `你是 **${company.name}** 的CEO。
你的企业DNA: ${JSON.stringify(company.dna)}
你的任务是基于企业DNA和政策环境，制定符合公司利益的战略决策。
**重要：所有思考过程、决策内容和输出必须使用简体中文。**`;

        const usr = `
# 仿真背景
1. **政策原文**: """${policyText.substring(0, 3000)}"""
2. **当前轮次**: 第 ${turnIndex} 轮.
3. **市场动态**: 
${historySummary || "这是第一轮，尚无历史记录。"}

# 你的战略任务
基于你的DNA（特别是‘战略原型’和‘研发效能’），阅读上述政策原文，并对市场动态做出反应。
必须遵循以下思维链 (CoT) 过程：
1. **Perception (感知)**: 识别关键条款和威胁。
2. **Internal Monologue (内省)**: 第一人称 ("我") 的内心独白。
3. **Strategic Decisions (决策)**: 制定 2-3 个具体的行动。
4. **Rationale (归因)**: 解释为什么。

# 输出要求
请返回严格的 JSON 格式:
{ "perception": "string", "internalMonologue": "string", "actions": ["string"], "reasoning": "string" }`;
        
        try {
            const res = await retry(() => callGLM(
                [{ role: "system", content: sys }, { role: "user", content: usr }],
                { model: MODELS.SMART.name, thinking: true } // 使用 4.6 + Thinking
            ), 3); // 最多重试3次
            return { companyId: company.id, companyName: company.name, memo: JSON.parse(cleanJson(res)) };
        } catch (e) {
            console.error(`Sim Failed for ${company.name}`, e);
            return { companyId: company.id, companyName: company.name, memo: getMockDecision(company.name, turnIndex) };
        }
    };

    // 使用并发控制器执行，限制并发数为 4 (GLM-4.6 限制为 5)
    const decisions = await runBatch(companies, MODELS.SMART.limit, task);
    return { turn: turnIndex, decisions };
};

// 4. 汇总 (Mock - 实际上这里可以加一个简单的 AI 汇总步骤，但为了省 Token 和时间，先略过)
export const aggregateSimulationResults = async (history: SimulationTurn[]) => {
    if (!canRunAI()) await new Promise(r => setTimeout(r, 500));
    else await new Promise(r => setTimeout(r, 200)); // 简单延迟
    return { status: "aggregated" };
};

// 5. 最终报告 (使用 4.6 模型 + 流式输出 + 动态层级Prompt)
export const generateFinalReport = async (policyText: string, companies: any[], history: SimulationTurn[], onStream?: (c: string) => void): Promise<SimulationReport> => {
    const level = detectReportLevel(policyText);
    
    if (!canRunAI()) {
        if(onStream) {
            const text = "正在生成模拟报告..."; 
            for(let i=0; i<text.length; i++) { onStream(text.slice(0, i)); await new Promise(r=>setTimeout(r, 50)); }
        }
        return getMockFinalReport(history, level);
    }

    // 动态角色设定
    const roles = {
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

    // 动态任务设定
    const tasks = {
        national: `1. **国家战略一致性**：企业的微观行为是否符合“新质生产力”与“航天强国”的顶层设计？\n2. **系统性风险**：是否存在技术路线单一化风险？关键供应链是否仍有对外依赖？\n3. **终局预判**：是否形成了有利于参与国际竞争的“航天国家队+商业独角兽”格局？`,
        provincial: `1. **区域吸引力**：本省政策相比竞争省份（如周边省份），对头部企业是否有足够吸引力？\n2. **产业链缺口**：仿真中暴露出本省产业链还缺哪些环节（如缺发动机制造、缺测控）？\n3. **终局预判**：能否实现“千亿级产业集群”的目标？还是会出现“有项目无产业”的空心化？`,
        municipal: `1. **政策实效性**：具体的补贴条款（如房租减免、首台套）是否真的触动了企业的投资决策？\n2. **落地痛点**：企业在仿真中是否表现出对用地、人才公寓、能耗指标的顾虑？\n3. **终局预判**：未来3年预计能落地多少家实体企业？税收贡献如何？`
    };

    const sys = `${roles[level]}
    
你的任务是基于“多智能体博弈仿真”日志，撰写一份**《政策仿真推演评估专报》**（内参）。
**核心原则**：
1. **问题导向**：不歌功颂德。重点揭示仿真中暴露的“合成谬误”、“政策套利”等风险。
2. **数据支撑**：所有观点必须基于“博弈演化日志”中的具体企业行为。
3. **格式规范**：严格按照要求的 JSON 结构输出。`;

    const usr = `
# 1. 仿真输入数据
**[A] 政策底稿 (节选)**: """${policyText.substring(0, 3000)}..."""
**[B] 参演主体**: ${companies.map((c: any) => `- ${c.name} [类型:${c.dna?.archetype}]`).join('\n')}
**[C] 博弈演化日志**: ${JSON.stringify(history)}

# 2. 深度思考任务 (Deep Thinking Chain)
请基于你的角色（${level}），重点执行以下推演：
${tasks[level]}

# 3. 报告撰写要求 (JSON Schema)
请严格按照以下 JSON 结构输出。字符串字段建议使用 Markdown 格式。
\`\`\`json
{
  "title": "主标题：需体现公文规范",
  "executiveSummary": "【决策摘要】300字以内。直击要害。",
  "policyEffectiveness": { 
      "goalAlignment": "【目标契合度】", 
      "impactStrength": "【政策效能】", 
      "unintendedConsequences": "【非预期效应监测】（关键）" 
  },
  "emergentPatterns": [
      { "patternName": "模式名称", "analysis": "深度解析" }
  ],
  "industryOutlook": { 
      "emergingRisks": ["风险点1..."], 
      "newOpportunities": ["机遇点1..."], 
      "marketStructurePrediction": "终局画像" 
  },
  "microAnalysis": [
      { 
          "companyId": "对应输入中的id", 
          "companyName": "企业名称", 
          "impactScore": number, // +10 ~ -10
          "predictedResponse": "战术总结", 
          "rationale": "归因诊断" 
      }
  ]
}
\`\`\``;

    try {
        const res = await callGLM(
            [{ role: "system", content: sys }, { role: "user", content: usr }],
            { model: MODELS.SMART.name, thinking: true, stream: true }, 
            onStream
        );
        const report = JSON.parse(cleanJson(res));
        report.turnHistory = history;
        report.reportLevel = level;
        return report;
    } catch (e) {
        console.error("Report Gen Error", e);
        return getMockFinalReport(history, level);
    }
};

// --- Mock Helpers (保持不变，为了节省空间简写) ---

const getMockDNA = (url: string): EnterpriseDNA => ({
    id: `mock-${Date.now()}`,
    name: url.includes('spacex') ? "SpaceX" : "示例商业航天企业",
    archetype: "技术颠覆者",
    description: "这是基于Mock数据生成的示例企业画像，用于演示系统功能。",
    rdEffectiveness: 0.85,
    corporateValues: ["技术驱动", "第一性原理"],
    riskProfile: {
        ambitionLevel: "行业垄断",
        financialRiskAversion: "低"
    },
    legacy: {
        technologicalDebt: "低",
        regulatoryBurden: "中"
    },
    policySensitivities: {
        subsidySensitivity: 0.6,
        regulationSensitivity: 0.4
    },
    technologyFocus: ["液氧甲烷发动机", "可重复使用运载器"],
    fundingSource: "风险投资",
    corporateCulture: "工程师文化"
});

const getMockDecision = (name: string, turn: number): StrategicMemo => ({
    perception: "政策利好，符合预期。", 
    internalMonologue: "必须抓住这次机会，扩大市场份额。", 
    actions: [`启动${turn}号专项扩展计划`, "加大研发投入"], 
    reasoning: "基于公司长期战略，利用政策红利加速发展。"
});

const getMockFinalReport = (history: any[], level: any): SimulationReport => ({
    title: `商业航天政策仿真评估报告 (${level === 'national' ? '国家级' : level === 'provincial' ? '省级' : '市级'})`, 
    executiveSummary: "仿真显示政策总体有效，头部企业响应积极，但需警惕中下游企业的合规性套利风险。", 
    policyEffectiveness: { goalAlignment: "高", impactStrength: "强", unintendedConsequences: "局部过热" },
    emergentPatterns: [{patternName: "技术路线收敛", analysis: "多数企业转向液氧甲烷路线。"}], 
    industryOutlook: { emergingRisks: ["供应链瓶颈"], newOpportunities: ["星座组网加速"], marketStructurePrediction: "一超多强" },
    microAnalysis: history[0]?.decisions?.map((d: any) => ({
        companyId: d.companyId, companyName: d.companyName, impactScore: 8, predictedResponse: "积极扩张", rationale: "DNA匹配"
    })) || [], 
    turnHistory: history, 
    reportLevel: level
});
