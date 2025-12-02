import React from 'react';
import { DnaGenerator } from './DnaGenerator';
import { SimulationSandbox } from './SimulationSandbox';
import { Company, AiStatus } from '../types';

interface SidebarProps {
    companies: Company[];
    selectedCompanyIds: string[];
    status: AiStatus;
    onAddCompany: (url: string) => void;
    onGenerateDna: (id: string) => void;
    onRemoveCompany: (id: string) => void;
    setSelectedCompanyIds: (ids: string[]) => void;
    onRunSimulation: (policyText: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const isSimulating = props.status !== AiStatus.Ready && props.status !== AiStatus.GeneratingDna;
    const hasCompaniesWithDna = props.companies.some(c => !!c.dna);

    return (
        <aside className="w-full md:w-1/3 lg:w-2/5 p-4 space-y-4">
            <DnaGenerator 
                companies={props.companies}
                onAddCompany={props.onAddCompany}
                onGenerateDna={props.onGenerateDna}
                onRemoveCompany={props.onRemoveCompany}
                status={props.status}
            />
            <div 
                className={`transition-opacity duration-500 ${hasCompaniesWithDna ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}
                title={!hasCompaniesWithDna ? '请先生成至少一个企业DNA以开始仿真' : ''}
            >
                <SimulationSandbox 
                    companies={props.companies}
                    selectedCompanies={props.selectedCompanyIds}
                    setSelectedCompanies={props.setSelectedCompanyIds}
                    onRunSimulation={props.onRunSimulation}
                    isLoading={isSimulating || props.status === AiStatus.GeneratingDna}
                />
            </div>
        </aside>
    );
};