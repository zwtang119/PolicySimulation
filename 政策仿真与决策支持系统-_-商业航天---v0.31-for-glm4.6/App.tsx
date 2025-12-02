
import React, { Suspense } from 'react';
import { Spinner } from './components/common/Spinner';

// Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UIProvider, useUI } from './contexts/UIContext';
import { DataProvider } from './contexts/DataContext';

// Components
import { Login } from './components/Login';
import { ForgotPassword } from './components/ForgotPassword';
import { DashboardLayout } from './components/DashboardLayout';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { LeadGenModal } from './components/LeadGenModal';

// Lazy load heavy components
const DataEntry = React.lazy(() => import('./components/DataEntry').then(m => ({ default: m.DataEntry })));
const DataQuery = React.lazy(() => import('./components/DataQuery').then(m => ({ default: m.DataQuery })));
const Simulation = React.lazy(() => import('./components/Simulation').then(m => ({ default: m.Simulation })));
const SimulationResult = React.lazy(() => import('./components/SimulationResult').then(m => ({ default: m.SimulationResult })));
const ReportExport = React.lazy(() => import('./components/ReportExport').then(m => ({ default: m.ReportExport })));
const Profile = React.lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const ReportViewer = React.lazy(() => import('./components/ReportViewer').then(m => ({ default: m.ReportViewer })));
const AboutUs = React.lazy(() => import('./components/AboutUs').then(m => ({ default: m.AboutUs })));
const HowItWorks = React.lazy(() => import('./components/HowItWorks').then(m => ({ default: m.HowItWorks })));
const UseCases = React.lazy(() => import('./components/UseCases').then(m => ({ default: m.UseCases })));
const WhitepaperViewer = React.lazy(() => import('./components/WhitepaperViewer').then(m => ({ default: m.WhitepaperViewer })));

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full min-h-[400px] w-full">
        <div className="flex flex-col items-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">资源加载中...</p>
        </div>
    </div>
);

// 内部路由组件，使用 Context
const AppRoutes: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const { currentView, navigate, isLeadModalOpen, setLeadModalOpen } = useUI();

    const publicViews = ['home', 'about-us', 'how-it-works', 'use-cases', 'whitepaper'];
    const showPublicLayout = publicViews.includes(currentView);

    if (showPublicLayout) {
        return (
            <div className="min-h-screen bg-white text-slate-900 font-sans">
                 <Header />
                <div className="pt-16">
                    <Suspense fallback={<LoadingFallback />}>
                        {currentView === 'home' && <Homepage onNavigate={navigate} />}
                        {currentView === 'about-us' && <AboutUs onOpenLeadModal={() => setLeadModalOpen(true)} />}
                        {currentView === 'how-it-works' && <HowItWorks />}
                        {currentView === 'use-cases' && <UseCases />}
                        {currentView === 'whitepaper' && <WhitepaperViewer />}
                    </Suspense>
                </div>
                <LeadGenModal isOpen={isLeadModalOpen} onClose={() => setLeadModalOpen(false)} />
            </div>
        );
    }

    if (!isAuthenticated) {
        if (currentView === 'forgot-password') {
            return <ForgotPassword onBack={() => navigate('login')} />;
        }
        return <Login onLogin={(user) => { login(user); navigate('data-entry'); }} onForgotPassword={() => navigate('forgot-password')} />;
    }

    return (
        <DashboardLayout>
            <Suspense fallback={<LoadingFallback />}>
                {currentView === 'data-entry' && <DataEntry />}
                {currentView === 'data-query' && <DataQuery />}
                {currentView === 'simulation' && <Simulation />}
                {currentView === 'simulation-result' && <SimulationResult />}
                {currentView === 'reports' && <ReportExport />}
                {currentView === 'profile' && <Profile />}
            </Suspense>
        </DashboardLayout>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <UIProvider>
                <DataProvider>
                    <AppRoutes />
                </DataProvider>
            </UIProvider>
        </AuthProvider>
    );
};

export default App;