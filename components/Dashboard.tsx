
import React from 'react';
import { ReportViewer } from './ReportViewer';
import { SimulationReport, AiStatus, Company } from '../types';

interface DashboardProps {
    report: SimulationReport | null;
    status: AiStatus;
    error: string | null;
    companies: Company[];
}

export const Dashboard: React.FC<DashboardProps> = ({ report, status, error, companies }) => {
    return (
        <main className="flex-1 p-4">
            <ReportViewer report={report} status={status} error={error} companies={companies} />
        </main>
    );
};