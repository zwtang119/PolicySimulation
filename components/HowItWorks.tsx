
import React from 'react';

const LayerCard: React.FC<{ 
    number: string; 
    title: string; 
    subtitle: string;
    features: string[];
    isLast?: boolean 
}> = ({ number, title, subtitle, features, isLast = false }) => (
    <div className="relative flex gap-8 group">
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-lg z-10 group-hover:bg-blue-700 transition-colors">
                {number}
            </div>
            {!isLast && <div className="w-0.5 h-full bg-slate-200 my-2 group-hover:bg-blue-200 transition-colors"></div>}
        </div>
        <div className="pb-16 flex-1">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-blue-600 font-semibold text-sm mb-6 uppercase tracking-wide">{subtitle}</p>
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start text-slate-600">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export const HowItWorks: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">核心架构：三层闭环体系</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
                        Polaris 不仅仅是一个仿真软件，它是基于复杂系统科学（Complexity Science）构建的国家级决策操作系统。
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Architecture Layers */}
                    <div className="space-y-0">
                         <LayerCard 
                            number="L1"
                            title="数据现实层"
                            subtitle="Data Reality Layer"
                            features={[
                                "全球OSINT情报网络：实时采集卫星、发射、投融资数据。",
                                "统一产业知识图谱：消除数据孤岛，构建实体关联网络。",
                                "可观测现实重构：将碎片化信息转化为可计算的数字孪生底座。"
                            ]}
                        />
                         <LayerCard 
                            number="L2"
                            title="动力引擎层"
                            subtitle="Dynamics Engine Layer"
                            features={[
                                "多智能体博弈仿真：模拟成千上万家异质企业在政策激励下的自适应行为。",
                                "政策扩散动力学：计算政策信号在产业链网络中的传导与衰减。",
                                "因果推断模型：剥离混杂因素，科学量化政策的真实贡献度。"
                            ]}
                        />
                         <LayerCard 
                            number="L3"
                            title="决策应用层"
                            subtitle="Decision Application Layer"
                            features={[
                                "人机共生界面：将复杂的算法逻辑转化为直观的战略仪表盘。",
                                "全景作战地图：实时监控全球产业态势与竞争格局。",
                                "沙盘推演系统：支持“政策复盘”、“危机应对”、“战略设计”全场景。"
                            ]}
                            isLast
                        />
                    </div>

                    {/* Conceptual Visual */}
                    <div className="lg:sticky lg:top-24 space-y-8">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden min-h-[400px] flex flex-col justify-center items-center">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50 animate-pulse">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Policy Dynamics Engine</h3>
                                <p className="text-slate-400 text-sm">v3.0 Kernel Running</p>
                                <div className="mt-8 grid grid-cols-2 gap-4 text-left text-xs font-mono text-blue-200">
                                    <div className="bg-white/10 p-3 rounded">
                                        <div className="text-slate-400">Agents</div>
                                        <div className="text-white text-lg">5,240+</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded">
                                        <div className="text-slate-400">Relations</div>
                                        <div className="text-white text-lg">1.2M+</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded">
                                        <div className="text-slate-400">Policies</div>
                                        <div className="text-white text-lg">850+</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded">
                                        <div className="text-slate-400">Simulation</div>
                                        <div className="text-green-400 text-lg">Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                            <h4 className="font-bold text-blue-900 mb-2">从“治理”到“智理”</h4>
                            <p className="text-slate-700 text-sm">
                                这一架构标志着治理范式的跃迁。它不再依赖静态的统计报表，而是构建了一个具备自我演化能力的<strong>“社会计算实验室”</strong>。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
