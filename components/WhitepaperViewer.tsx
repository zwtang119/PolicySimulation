
import React, { useState, useEffect, useRef } from 'react';
import { structuredWhitepaperData } from '../content/structure';
import { MarkdownRenderer } from './common/MarkdownRenderer';

const Introduction: React.FC = () => (
    <div className="prose prose-slate max-w-none mb-12 bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 !mt-0">
            商业航天政策动力学引擎 v3.0
            <span className="block text-lg font-medium text-blue-600 mt-2">国家治理的数字基座</span>
        </h1>
        <p className="text-slate-700 text-lg leading-relaxed mb-4">
            这不仅仅是一份技术文档，而是关于<b>“计算政策科学”</b>与<b>“制度智能”</b>的完整思想体系。
            全书共五篇十四卷，系统阐述了如何通过多智能体仿真、因果推断与人机共生技术，将国家战略决策从经验驱动的“艺术”升维为数据驱动的“科学”。
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                内部研讨版
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                共 5 篇 14 卷
            </span>
            <span className="text-xs text-slate-400 ml-auto">
                最后更新：2025-11-12
            </span>
        </div>
    </div>
);

export const WhitepaperViewer: React.FC = () => {
    const [selected, setSelected] = useState({ partIndex: 0, volumeIndex: 0 });
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const mainContentRef = useRef<HTMLElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const handleSelect = (partIndex: number, volumeIndex: number) => {
        setSelected({ partIndex, volumeIndex });
        // Reset scroll and active section when changing volumes
        if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
        const firstSectionId = structuredWhitepaperData[partIndex].volumes[volumeIndex].sections[0]?.id;
        setActiveSection(firstSectionId || null);
        
        // Update URL without scrolling (scrolling handled by render)
        const volume = structuredWhitepaperData[partIndex].volumes[volumeIndex];
        // Optional: could update hash to volume ID if we had one, currently relying on section hash
    };
    
    const handleNavClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', `#${sectionId}`);
        }
    };

    // Initial Load & Hash Handling
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (!hash) return;

            for (let pIndex = 0; pIndex < structuredWhitepaperData.length; pIndex++) {
                const part = structuredWhitepaperData[pIndex];
                for (let vIndex = 0; vIndex < part.volumes.length; vIndex++) {
                    const volume = part.volumes[vIndex];
                    if (volume.sections.some(s => s.id === hash)) {
                        setSelected({ partIndex: pIndex, volumeIndex: vIndex });
                        // Use timeout to ensure content is rendered before scrolling
                        setTimeout(() => {
                            const element = document.getElementById(hash);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }, 100);
                        return;
                    }
                }
            }
        };

        handleHashChange(); // Initial load
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Scroll Spy
    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        const options = {
            root: mainContentRef.current,
            rootMargin: '0px 0px -80% 0px', // Trigger when section is in the top 20% of the viewport
            threshold: 0
        };

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, options);

        const sections = mainContentRef.current?.querySelectorAll('h1[id], h2[id], h3[id]');
        sections?.forEach(section => observer.current?.observe(section));

        return () => observer.current?.disconnect();
    }, [selected]); // Rerun when volume changes

    const currentPart = structuredWhitepaperData[selected.partIndex];
    const currentVolume = currentPart.volumes[selected.volumeIndex];

    return (
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 gap-6 h-[calc(100vh-64px)]">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-1/4 xl:w-1/5 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">目录导览</h2>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    <ul className="space-y-6">
                        {structuredWhitepaperData.map((part, pIndex) => (
                            <li key={pIndex}>
                                <div className="px-2 mb-2 flex items-center space-x-2">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        {part.title.split('：')[0]}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                                        {part.title.split('：')[1]}
                                    </span>
                                </div>
                                <ul className="space-y-1 pl-1">
                                    {part.volumes.map((volume, vIndex) => {
                                        const isSelected = selected.partIndex === pIndex && selected.volumeIndex === vIndex;
                                        return (
                                            <li key={vIndex}>
                                                <button
                                                    onClick={() => handleSelect(pIndex, vIndex)}
                                                    className={`text-left text-sm w-full py-2 px-3 rounded-md transition-all duration-200 flex items-start ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <span className={`mr-2 text-xs mt-0.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {volume.title.split('：')[0]}
                                                    </span>
                                                    <span className="font-medium leading-tight">
                                                        {volume.title.split('：')[1]}
                                                    </span>
                                                </button>
                                                
                                                {/* Sections (Accordion style) */}
                                                {isSelected && (
                                                    <ul className="mt-1 mb-2 ml-3 pl-3 border-l-2 border-blue-100 space-y-1 animate-fade-in">
                                                        {volume.sections.map(section => (
                                                            <li key={section.id}>
                                                                <button 
                                                                    onClick={() => handleNavClick(section.id)}
                                                                    className={`text-left text-xs w-full py-1 px-2 rounded transition-colors leading-snug ${
                                                                        activeSection === section.id
                                                                        ? 'text-blue-700 font-bold bg-blue-50'
                                                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    {section.title}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main 
                ref={mainContentRef} 
                className="flex-1 bg-white shadow-lg rounded-lg border border-slate-200 overflow-y-auto custom-scrollbar relative"
            >
                <div className="max-w-4xl mx-auto p-8 md:p-12">
                    {selected.partIndex === 0 && selected.volumeIndex === 0 && <Introduction />}
                    
                    <article className="animate-fade-in">
                        <div className="mb-8 border-b border-slate-200 pb-6">
                            <div className="text-sm text-blue-600 font-semibold mb-2 tracking-wide uppercase">
                                {currentPart.title}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                                {currentVolume.title}
                            </h1>
                        </div>
                        <div className="prose prose-slate prose-lg max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-800">
                            <MarkdownRenderer content={currentVolume.rawContent} />
                        </div>
                        
                        {/* Footer Navigation */}
                        <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between text-sm font-medium text-slate-500">
                            <div>
                                {selected.volumeIndex > 0 || selected.partIndex > 0 ? (
                                    <button 
                                        onClick={() => {
                                            if (selected.volumeIndex > 0) handleSelect(selected.partIndex, selected.volumeIndex - 1);
                                            else handleSelect(selected.partIndex - 1, structuredWhitepaperData[selected.partIndex - 1].volumes.length - 1);
                                        }}
                                        className="hover:text-blue-600 flex items-center"
                                    >
                                        ← 上一卷
                                    </button>
                                ) : null}
                            </div>
                            <div>
                                {selected.volumeIndex < currentPart.volumes.length - 1 || selected.partIndex < structuredWhitepaperData.length - 1 ? (
                                    <button 
                                        onClick={() => {
                                            if (selected.volumeIndex < currentPart.volumes.length - 1) handleSelect(selected.partIndex, selected.volumeIndex + 1);
                                            else handleSelect(selected.partIndex + 1, 0);
                                        }}
                                        className="hover:text-blue-600 flex items-center"
                                    >
                                        下一卷 →
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </article>
                </div>
            </main>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};
