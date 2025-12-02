
import React from 'react';

const UseCaseCard: React.FC<{
    badge: string;
    title: string;
    scenario: string;
    result: string;
    icon: string;
}> = ({ badge, title, scenario, result, icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-lg bg-slate-50 flex items-center justify-center text-3xl group-hover:bg-blue-50 transition-colors">
                    {icon}
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {badge}
                </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">{title}</h3>
            
            <div className="space-y-4">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">推演场景</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{scenario}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-green-600 uppercase mb-1">量化价值 & 洞察</p>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{result}</p>
                </div>
            </div>
        </div>
    </div>
);

export const UseCases: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-fade-in">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">实战推演案例</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
                        从历史归因到未来博弈，Polaris 在三大核心战略场景中展现了不可替代的决策支持能力。
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <UseCaseCard 
                        badge="历史复盘 (Retrodiction)"
                        icon="🕰️"
                        title="低轨星座政策绩效归因"
                        scenario="基于2015-2020年真实数据，利用合成控制法（SCM）构建‘虚拟对照组’，剥离全球技术红利与资本热度，精准评估国家发改委《民用空间基础设施规划》的净效应。"
                        result="量化证明该政策对产业融资的净贡献为120亿元（占比35%），但对技术专利的拉动存在9个月滞后。识别出“信号效应”优于“资金效应”的早期特征。"
                    />
                    <UseCaseCard 
                        badge="危机推演 (Crisis Sim)"
                        icon="🌪️"
                        title="关键芯片断供压力测试"
                        scenario="模拟‘宇航级FPGA芯片’突发出口禁令。在72小时内，通过多智能体仿真推演冲击在供应链网络中的二阶、三阶传导路径，以及不同应对预案的修复曲线。"
                        result="预警：若无干预，2年后卫星产能将下降40%。对比推演显示，‘多元供应链基金’方案比‘强力替代补贴’方案能更快稳定产能（12个月 vs 24个月），避免了短期人才恶性争夺。"
                    />
                    <UseCaseCard 
                        badge="生成式博弈 (Wargaming)"
                        icon="♟️"
                        title="国际补贴对抗策略生成"
                        scenario="设定‘红蓝军’多回合博弈场景。AI模拟竞争对手在面对我国产业补贴时可能采取的‘技术封锁’或‘反补贴调查’反制措施，自动生成最优博弈策略树。"
                        result="系统涌现出非直觉的‘不对称创新’策略：建议将资源从跟随型制造环节，战略性转移至‘天基算力’等非共识领域，以规避红海竞争并建立新型非对称优势。"
                    />
                </div>

                <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
                    <p className="text-slate-600 mb-6">
                        这些案例仅是冰山一角。Polaris 正在为国家级决策部门提供<strong>7x24小时</strong>的战略伴随服务。
                    </p>
                    <p className="font-bold text-slate-800">
                        详细的技术实现与数学模型，请参阅白皮书《卷八：应用案例与战略推演》。
                    </p>
                </div>
            </div>
        </div>
    );
};
