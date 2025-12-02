import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Report, AiStatus, SimulationReport, SimulationTurn } from '../types';
import { generateCompanyDna, runSimulationTurn, generateFinalReport, analyzePolicyStructure, aggregateSimulationResults, generateAllDnaBatch } from '../services/LLMService';

// 初始 Mock 数据
const initialCompanies: Company[] = [
    { id: 'cn-1', url: 'https://www.landspace.com', name: '蓝箭航天 (LandSpace)', country: '中国', createdDate: '2023-10-25', dna: null, isGenerating: false },
    { id: 'cn-2', url: 'https://www.i-space.com.cn', name: '星际荣耀 (i-Space)', country: '中国', createdDate: '2023-11-12', dna: null, isGenerating: false },
    { id: 'cn-3', url: 'http://www.galactic-energy.cn', name: '星河动力 (Galactic Energy)', country: '中国', createdDate: '2024-01-15', dna: null, isGenerating: false },
    { id: 'us-1', url: 'https://www.spacex.com', name: 'SpaceX', country: '美国', createdDate: '2023-09-01', dna: null, isGenerating: false },
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
    batchStatus: string; // 批处理状态描述
    
    addCompany: (nameOrUrl: string) => void;
    removeCompany: (id: string) => void;
    generateDna: (id: string) => Promise<void>;
    generateAllDnas: () => Promise<void>; // New Batch Function
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
            if (parsed.length > 0) return parsed;
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
    const [batchStatus, setBatchStatus] = useState<string>("");
    
    const [simulationProgress, setSimulationProgress] = useState(0);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);
    const [reportPreviewText, setReportPreviewText] = useState("");

    useEffect(() => { localStorage.setItem('app_companies', JSON.stringify(companies)); }, [companies]);
    useEffect(() => { localStorage.setItem('app_reports', JSON.stringify(reports)); }, [reports]);

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
        setError(null);
        
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

    // 批处理生成所有 DNA
    const generateAllDnas = async () => {
        const targetCompanies = companies.filter(c => !c.dna);
        if (targetCompanies.length === 0) return;

        setAiStatus(AiStatus.GeneratingBatchDna);
        setCompanies(prev => prev.map(c => !c.dna ? { ...c, isGenerating: true } : c));
        setBatchStatus("正在准备批处理文件...");
        setError(null);

        try {
            const results = await generateAllDnaBatch(targetCompanies, (status) => {
                setBatchStatus(status);
            });

            setCompanies(prev => prev.map(company => {
                const result = results.find(r => r.companyId === company.id);
                if (result) return { ...company, dna: result.dna, isGenerating: false };
                if (targetCompanies.find(t => t.id === company.id)) return { ...company, isGenerating: false };
                return company;
            }));
            
            setAiStatus(AiStatus.Ready);
            setBatchStatus("");
        } catch (e: any) {
            console.error(e);
            setError(e.message);
            setBatchStatus("任务失败");
            setCompanies(prev => prev.map(c => ({ ...c, isGenerating: false })));
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
            setAiStatus(AiStatus.PolicyParsing);
            setSimulationProgress(5);
            addLog("步骤 1/5: 正在解析政策语义结构...");
            await analyzePolicyStructure(policyText); 
            setSimulationProgress(20);

            setAiStatus(AiStatus.DnaLoading);
            addLog("步骤 2/5: 正在加载参演企业战略画像 (DNA)...");
            await new Promise(r => setTimeout(r, 500)); 
            setSimulationProgress(30);

            setAiStatus(AiStatus.Simulating_RunningTurns);
            let history: SimulationTurn[] = [];
            addLog(`步骤 3/5: 开始执行多轮博弈推演 (共 ${depth} 轮)...`);
            
            for (let i = 1; i <= depth; i++) {
                addLog(`[第 ${i} 回合] 智能体正在基于企业DNA和政策原文进行博弈决策...`);
                setSimulationProgress(30 + (i / depth) * 40); 
                const turnResult = await runSimulationTurn(policyText, targetCompanies, i, history);
                history.push(turnResult);
            }
            
            setAiStatus(AiStatus.Simulating_Aggregation);
            setSimulationProgress(75);
            addLog("步骤 4/5: 正在汇总博弈数据与因果归因分析...");
            await aggregateSimulationResults(history);
            setSimulationProgress(85);

            setAiStatus(AiStatus.Simulating_SynthesizingReport);
            addLog("步骤 5/5: 正在撰写最终政策评估报告 (GLM-4.6 Stream)...");
            
            const reportContent = await generateFinalReport(
                policyText, 
                targetCompanies, 
                history,
                (text) => setReportPreviewText(text)
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
            setError(e.message);
            addLog("错误: " + e.message);
            setAiStatus(AiStatus.Ready);
        }
    };

    return (
        <DataContext.Provider value={{
            companies, reports, selectedCompanyIds, aiStatus, 
            simulationProgress, progressLogs, simulationReport, error, reportPreviewText, batchStatus,
            addCompany, removeCompany, generateDna, generateAllDnas,
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