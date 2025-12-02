
import React from 'react';
import { AppView } from '../types';

interface HomepageProps {
    onNavigate: (view: AppView) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-100">
        <div className="text-4xl text-blue-700 mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
);

export const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
    return (
        <div className="animate-fade-in font-sans">
            {/* Hero Section */}
            <section className="bg-slate-50 py-24 md:py-32 relative overflow-hidden">
                {/* Background Element */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
                     <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
                     <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-indigo-400 blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-6 tracking-wide">
                        POLARIS ENGINE v3.0
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                        商业航天政策动态仿真与决策支撑系统
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                            全球首个AI驱动的领域政策推演平台
                        </span>
                    </h1>
                    <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
                        基于复杂适应系统（CAS）理论与多智能体仿真技术，构建“数据-模型-交互”三层架构，整合全球开源情报（OSINT）、企业数字孪生与政策动力学引擎，实现产业生态高精度数字映射与未来情景可计算推演。
                        <br/>
                        核心能力覆盖全景态势感知、因果归因分析、多情景博弈推演及智能决策支撑，推动政策制定从主观经验判断跃升至 AI 战略决策支持。
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
                        <button
                            onClick={() => onNavigate('how-it-works')}
                            className="bg-slate-900 text-white px-8 py-4 rounded-md text-lg font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            探索核心架构
                        </button>
                        <button
                            onClick={() => onNavigate('whitepaper')}
                            className="bg-white text-slate-800 px-8 py-4 rounded-md text-lg font-bold border border-slate-300 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                        >
                            查阅白皮书 (v3.0)
                        </button>
                    </div>
                    <p className="mt-6 text-xs text-slate-400 uppercase tracking-widest">
                        自主可控 · 科学推演 · 战略决胜
                    </p>
                </div>
            </section>

            {/* Pain Points Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900">传统决策模式的三大失灵</h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 mb-6"></div>
                        <p className="max-w-2xl mx-auto text-slate-600">
                            在高度动态、强耦合的产业生态中，基于线性外推与专家经验的传统范式正面临系统性失效。
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard 
                            icon="🌫️"
                            title="信息失灵：全景迷雾"
                            description="产业情报分散在数百个异构数据源中。决策者面临的不是数据匮乏，而是“数据过载”导致的认知瘫痪。缺乏统一的知识图谱，使得决策如同盲人摸象，无法形成对产业生态的结构化认知。"
                        />
                        <FeatureCard 
                            icon="📦"
                            title="归因失灵：因果黑箱"
                            description="“去年投入的50亿补贴究竟带来了多少技术突破？”传统评估依赖定性访谈，难以剥离混杂因素。缺乏科学的因果推断（Causal Inference），使得政策效果无法量化，财政资金效率无法评估。"
                        />
                        <FeatureCard 
                            icon="⚠️"
                            title="预测失灵：博弈盲区"
                            description="将企业视为被动的同质化个体，忽略了其作为“智能体”的博弈行为。线性模型无法预测政策刺激下，企业是选择“技术创新”还是“骗补套利”，更无法预见供应链涌现出的非线性风险。"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
