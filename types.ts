
export type AppView = 
    | 'login' 
    | 'forgot-password'
    | 'data-entry'      // 数据录入与编辑 (Page 5, 6)
    | 'data-query'      // 数据查询 (Page 7)
    | 'simulation'      // 政策仿真 (Page 8)
    | 'simulation-result' // 仿真结果 (New)
    | 'reports'         // 报告导出 (Page 9, 10)
    | 'profile'         // 个人中心 (Page 11)
    | 'home'            // 首页
    | 'about-us'        // 关于我们
    | 'how-it-works'    // 工作原理
    | 'use-cases'       // 应用场景
    | 'whitepaper';     // 项目白皮书

export interface User {
    username: string;
    avatar?: string;
    organization?: string;
}

export interface AppState {
    currentView: AppView;
    user: User | null;
    isAuthenticated: boolean;
}

export type AppAction =
    | { type: 'SET_VIEW', payload: { view: AppView } }
    | { type: 'LOGIN', payload: { user: User } }
    | { type: 'LOGOUT' };

// --- AI & Simulation Types (Existing) ---

export enum AiStatus {
    Ready = 'Ready',
    GeneratingDna = 'GeneratingDna',
    // New 5-Step Pipeline
    PolicyParsing = 'PolicyParsing',                 // 1. 读取政策数据
    DnaLoading = 'DnaLoading',                       // 2. 读取企业战略画像
    Simulating_RunningTurns = 'Simulating_RunningTurns', // 3. 执行企业战略仿真
    Simulating_Aggregation = 'Simulating_Aggregation',   // 4. 分析汇总企业战略仿真
    Simulating_SynthesizingReport = 'Simulating_SynthesizingReport', // 5. 生成最终政策仿真报告
    Completed = 'Completed'
}

export interface EnterpriseDNA {
    id: string;
    name: string;
    archetype: string; // 战略原型: 技术颠覆者, 市场跟随者, etc.
    description: string;
    rdEffectiveness: number; // 研发效能 (R&D Effectiveness): 以 SpaceX 为标杆 (1.0). 反映迭代速度与资金利用率.
    corporateValues: string[];
    riskProfile: {
        ambitionLevel: string; // 雄心水平: 生存, 垄断, etc.
        financialRiskAversion: string; // 财务风险厌恶: 低, 中, 高
    };
    legacy: {
        technologicalDebt: string;
        regulatoryBurden: string;
    };
    policySensitivities: { // 对特定政策类型的敏感度
        subsidySensitivity: number; // 补贴敏感度
        regulationSensitivity: number; // 监管敏感度
    };
    technologyFocus: string[];
    fundingSource: string;
    corporateCulture: string;
}

export interface Company {
    id: string;
    url: string; 
    name: string;
    country: string; 
    createdDate?: string; 
    dna: EnterpriseDNA | null;
    isGenerating: boolean;
}

export interface Report {
    id: string;
    title: string;
    date: string;
    companyCount: number;
    content: SimulationReport; 
}

export interface StrategicMemo {
    perception: string; // [感知]: 扫描到的关键环境变化
    internalMonologue: string; // [内省]: CEO 的内心独白与权衡
    actions: string[]; // [决策]: 具体行动列表
    reasoning: string; // [分析]: 决策背后的理性分析
}

export interface AgentDecision {
    companyId: string;
    companyName: string;
    memo: StrategicMemo;
}

export interface SimulationTurn {
    turn: number;
    year?: string; // e.g., "2025 H1"
    decisions: AgentDecision[];
}

export interface SimulationReport {
    title: string;
    executiveSummary: string;
    policyEffectiveness: {
        goalAlignment: string;
        impactStrength: string;
        unintendedConsequences: string;
    };
    emergentPatterns: {
        patternName: string;
        analysis: string;
    }[];
    industryOutlook: {
        emergingRisks: string[];
        newOpportunities: string[];
        marketStructurePrediction: string; // 市场格局预测 (e.g., 寡头垄断)
    };
    microAnalysis: {
        companyId: string;
        companyName: string;
        impactScore: number;
        predictedResponse: string;
        rationale: string;
    }[];
    turnHistory: SimulationTurn[];
}