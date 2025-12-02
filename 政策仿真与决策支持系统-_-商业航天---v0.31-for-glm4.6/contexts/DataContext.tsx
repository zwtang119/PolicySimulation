
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Report, AiStatus, SimulationReport, SimulationTurn } from '../types';
import { generateCompanyDna, runSimulationTurn, generateFinalReport, analyzePolicyStructure, aggregateSimulationResults } from '../services/geminiService';

// 初始 Mock 数据 - 扩充版全球商业航天企业库
const initialCompanies: Company[] = [
    // --- 中国 (China) ---
    { id: 'cn-1', url: 'https://www.landspace.com', name: '蓝箭航天 (LandSpace)', country: '中国', createdDate: '2023-10-25', dna: null, isGenerating: false },
    { id: 'cn-2', url: 'https://www.i-space.com.cn', name: '星际荣耀 (i-Space)', country: '中国', createdDate: '2023-11-12', dna: null, isGenerating: false },
    { id: 'cn-3', url: 'http://www.galactic-energy.cn', name: '星河动力 (Galactic Energy)', country: '中国', createdDate: '2024-01-15', dna: null, isGenerating: false },
    { id: 'cn-4', url: 'http://www.cas-space.com', name: '中科宇航 (CAS Space)', country: '中国', createdDate: '2024-02-20', dna: null, isGenerating: false },
    { id: 'cn-5', url: 'https://www.deepblueaerospace.com', name: '深蓝航天 (Deep Blue)', country: '中国', createdDate: '2024-03-05', dna: null, isGenerating: false },
    { id: 'cn-6', url: 'https://www.orienspace.com', name: '东方空间 (Orienspace)', country: '中国', createdDate: '2024-03-10', dna: null, isGenerating: false },
    { id: 'cn-7', url: 'http://www.expace.com', name: '航天科工火箭 (ExPace)', country: '中国', createdDate: '2023-12-01', dna: null, isGenerating: false },
    { id: 'cn-8', url: 'https://www.minospace.com', name: '微纳星空 (MinoSpace)', country: '中国', createdDate: '2024-01-20', dna: null, isGenerating: false },
    { id: 'cn-9', url: 'https://www.yinhe.kr', name: '银河航天 (GalaxySpace)', country: '中国', createdDate: '2024-03-15', dna: null, isGenerating: false },
    { id: 'cn-10', url: 'https://www.charmingglobe.com', name: '长光卫星 (Chang Guang Satellite)', country: '中国', createdDate: '2024-03-18', dna: null, isGenerating: false },

    // --- 美国 (USA) ---
    { id: 'us-1', url: 'https://www.spacex.com', name: 'SpaceX', country: '美国', createdDate: '2023-09-01', dna: null, isGenerating: false },
    { id: 'us-2', url: 'https://www.blueorigin.com', name: 'Blue Origin', country: '美国', createdDate: '2023-09-15', dna: null, isGenerating: false },
    { id: 'us-3', url: 'https://www.virgingalactic.com', name: 'Virgin Galactic', country: '美国', createdDate: '2023-10-01', dna: null, isGenerating: false },
    { id: 'us-4', url: 'https://www.rocketlabusa.com', name: 'Rocket Lab', country: '美国', createdDate: '2023-09-20', dna: null, isGenerating: false },
    { id: 'us-5', url: 'https://www.relativityspace.com', name: 'Relativity Space', country: '美国', createdDate: '2023-11-05', dna: null, isGenerating: false },
    { id: 'us-6', url: 'https://www.sierraspace.com', name: 'Sierra Space', country: '美国', createdDate: '2023-12-12', dna: null, isGenerating: false },
    { id: 'us-7', url: 'https://www.planet.com', name: 'Planet Labs', country: '美国', createdDate: '2023-08-15', dna: null, isGenerating: false },
    { id: 'us-8', url: 'https://www.astra.com', name: 'Astra', country: '美国', createdDate: '2024-01-08', dna: null, isGenerating: false },

    // --- 欧洲 (Europe) ---
    { id: 'eu-1', url: 'https://www.arianespace.com', name: 'Arianespace', country: '欧洲', createdDate: '2023-07-10', dna: null, isGenerating: false },
    { id: 'eu-2', url: 'https://www.oneweb.net', name: 'Eutelsat OneWeb', country: '欧洲', createdDate: '2023-08-22', dna: null, isGenerating: false },
    { id: 'eu-3', url: 'https://www.isaraerospace.com', name: 'Isar Aerospace', country: '欧洲', createdDate: '2024-02-15', dna: null, isGenerating: false },
    { id: 'eu-4', url: 'https://www.pldspace.com', name: 'PLD Space', country: '欧洲', createdDate: '2024-03-01', dna: null, isGenerating: false },

    // --- 日本 (Japan) ---
    { id: 'jp-1', url: 'https://ispace-inc.com', name: 'ispace', country: '日本', createdDate: '2023-11-28', dna: null, isGenerating: false },
    { id: 'jp-2', url: 'https://astroscale.com', name: 'Astroscale', country: '日本', createdDate: '2024-01-05', dna: null, isGenerating: false },
];

interface DataContextType {
    companies: Company[];
    reports: Report[];
    selectedCompanyIds: string[];
    aiStatus: AiStatus;
    simulationProgress: number; // 0-100
    progressLogs: string[];     // 实时日志
    reportPreviewText: string;  // 报告生成时的预览文本
    simulationReport: SimulationReport | null;
    error: string | null;
    
    addCompany: (nameOrUrl: string) => void;
    removeCompany: (id: string) => void;
    generateDna: (id: string) => Promise<void>;
    toggleCompanySelection: (id: string) => void;
    setSelectedCompanyIds: (ids: string[]) => void;
    runSimulation: (policyText: string, depth?: number) => Promise<void>;
    setSimulationReport: (report: SimulationReport | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [companies, setCompanies] = useState<Company[]>(() => {
        const saved = localStorage.getItem('app_companies');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length >= initialCompanies.length) return parsed;
        }
        return initialCompanies;
    });

    const [reports, setReports] = useState<Report[]>(() => {
        const saved = localStorage.getItem('app_reports');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
    const [aiStatus, setAiStatus] = useState<AiStatus>(AiStatus.Ready);
    const [simulationReport, setSimulationReport] = useState<SimulationReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // P2: 真实感进度状态
    const [simulationProgress, setSimulationProgress] = useState(0);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);
    const [reportPreviewText, setReportPreviewText] = useState("");

    // 持久化
    useEffect(() => {
        localStorage.setItem('app_companies', JSON.stringify(companies));
    }, [companies]);

    useEffect(() => {
        localStorage.setItem('app_reports', JSON.stringify(reports));
    }, [reports]);

    const addCompany = (nameOrUrl: string) => {
        const isUrl = nameOrUrl.includes('http') || nameOrUrl.includes('www');
        const name = isUrl ? new URL(nameOrUrl).hostname.replace('www.', '') : nameOrUrl;
        
        const newCompany: Company = {
            id: Date.now().toString(),
            url: nameOrUrl,
            name: name,
            country: '未知',
            createdDate: new Date().toISOString().split('T')[0],
            dna: null,
            isGenerating: false
        };
        setCompanies(prev => [...prev, newCompany]);
    };

    const removeCompany = (id: string) => {
        setCompanies(companies.filter(c => c.id !== id));
        setSelectedCompanyIds(selectedCompanyIds.filter(cid => cid !== id));
    };

    const toggleCompanySelection = (id: string) => {
        if (selectedCompanyIds.includes(id)) {
            setSelectedCompanyIds(prev => prev.filter(cid => cid !== id));
        } else {
            setSelectedCompanyIds(prev => [...prev, id]);
        }
    };

    const generateDna = async (id: string) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, isGenerating: true } : c));
        setAiStatus(AiStatus.GeneratingDna);
        
        try {
            const company = companies.find(c => c.id === id);
            if (!company) return;
            const dna = await generateCompanyDna(company.url);
            setCompanies(prev => prev.map(c => c.id === id ? { ...c, dna, isGenerating: false } : c));
            setAiStatus(AiStatus.Ready);
        } catch (e: any) {
            setError(e.message);
            setCompanies(prev => prev.map(c => c.id === id ? { ...c, isGenerating: false } : c));
            setAiStatus(AiStatus.Ready);
        }
    };

    const addLog = (msg: string) => setProgressLogs(prev => [...prev, msg]);

    const runSimulation = async (policyText: string, depth: number = 1) => {
        setError(null);
        setSimulationReport(null);
        setProgressLogs([]);
        setSimulationProgress(0);
        setReportPreviewText("");

        const targetCompanies = companies.filter(c => selectedCompanyIds.includes(c.id));
        
        if (targetCompanies.length === 0) {
            setError("请至少选择一家企业进行仿真。");
            return;
        }

        try {
            // Step 1: Policy Parsing
            setAiStatus(AiStatus.PolicyParsing);
            setSimulationProgress(5);
            addLog("步骤 1/5: 正在解析政策语义结构与关键约束...");
            await analyzePolicyStructure(policyText); // We don't store result yet, just simulation step
            setSimulationProgress(20);
            addLog("政策解析完成。识别出关键激励因子与限制条件。");

            // Step 2: DNA Loading
            setAiStatus(AiStatus.DnaLoading);
            addLog("步骤 2/5: 正在加载参演企业战略画像 (DNA)...");
            // In a real app, we might check for missing DNAs here
            await new Promise(r => setTimeout(r, 500)); // Simulate loading
            setSimulationProgress(30);
            addLog(`画像加载完成。${targetCompanies.length} 家企业已就绪。`);

            // Step 3: Running Turns
            setAiStatus(AiStatus.Simulating_RunningTurns);
            let history: SimulationTurn[] = [];
            const TOTAL_TURNS = depth;
            addLog(`步骤 3/5: 开始执行多轮博弈推演 (共 ${TOTAL_TURNS} 轮)...`);
            
            for (let i = 1; i <= TOTAL_TURNS; i++) {
                addLog(`[第 ${i} 回合] 智能体正在基于企业DNA和政策原文进行博弈决策...`);
                // 模拟进度条平滑移动 (30% -> 70%)
                setSimulationProgress(30 + (i / TOTAL_TURNS) * 40); 
                
                const turnResult = await runSimulationTurn(policyText, targetCompanies, i, history);
                history.push(turnResult);
                
                addLog(`[第 ${i} 回合] 决策生成完毕。${turnResult.decisions.length} 家企业已响应。`);
            }
            
            // Step 4: Aggregation
            setAiStatus(AiStatus.Simulating_Aggregation);
            setSimulationProgress(75);
            addLog("步骤 4/5: 正在汇总博弈数据与因果归因分析...");
            await aggregateSimulationResults(history);
            setSimulationProgress(85);
            addLog("数据汇总完成。涌现模式识别完毕。");

            // Step 5: Report Synthesis
            setAiStatus(AiStatus.Simulating_SynthesizingReport);
            addLog("步骤 5/5: 正在撰写最终政策评估报告...");
            
            const reportContent = await generateFinalReport(
                policyText, 
                targetCompanies, 
                history,
                (text) => setReportPreviewText(text) // Callback for streaming preview
            );
            
            setSimulationProgress(100);
            addLog("仿真全流程结束。报告已生成。");
            setAiStatus(AiStatus.Completed);
            setSimulationReport(reportContent);

            const newReport: Report = {
                id: Date.now().toString(),
                title: reportContent.title || `仿真报告 - ${new Date().toLocaleDateString()}`,
                date: new Date().toISOString().split('T')[0],
                companyCount: targetCompanies.length,
                content: reportContent
            };
            setReports(prev => [newReport, ...prev]);

        } catch (e: any) {
            console.error(e);
            setError("仿真过程中断: " + (e.message || "未知错误"));
            addLog("错误: " + e.message);
            setAiStatus(AiStatus.Ready);
        }
    };

    return (
        <DataContext.Provider value={{
            companies, reports, selectedCompanyIds, aiStatus, 
            simulationProgress, progressLogs, simulationReport, error, reportPreviewText,
            addCompany, removeCompany, generateDna, 
            toggleCompanySelection, setSelectedCompanyIds, runSimulation, setSimulationReport
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
