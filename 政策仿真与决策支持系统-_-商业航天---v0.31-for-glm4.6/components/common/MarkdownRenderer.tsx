import React from 'react';

declare global {
    interface Window {
        katex: any;
    }
}

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};


const KatexRenderer: React.FC<{ math: string; block?: boolean }> = ({ math, block }) => {
    const ref = React.useRef<any>(null);
    const Component = block ? 'div' : 'span';

    React.useEffect(() => {
        if (ref.current && window.katex) {
            try {
                window.katex.render(math, ref.current, {
                    throwOnError: false,
                    displayMode: block,
                });
            } catch (e) {
                console.error('KaTeX rendering error:', e);
                ref.current.textContent = math;
            }
        }
    }, [math, block]);

    return <Component ref={ref} className={block ? 'my-4' : ''} />;
};


const parseInline = (line: string) => {
    const parts = line.split(/(`.*?\`|\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|\$.*?\$|\\\[.*?\\]|\\\(.*?\\\))/g);
    return parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-slate-100 text-slate-700 rounded-md px-1.5 py-0.5 text-sm font-mono">{part.slice(1, -1)}</code>;
        }
        if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
         if (part.startsWith('$') && part.endsWith('$')) {
            return <KatexRenderer key={index} math={part.slice(1, -1)} />;
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
            return <KatexRenderer key={index} math={part.slice(2, -2)} />;
        }
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
            return <KatexRenderer key={index} math={part.slice(2, -2)} block />;
        }
        return part;
    });
};

const renderBlock = (block: string, index: number | string) => {
    // Headings
    if (block.startsWith('# ')) {
        const content = block.substring(2);
        const id = slugify(content);
        return <h1 key={index} id={id} className="text-3xl font-bold mt-10 mb-6 text-slate-900 border-b pb-4">{parseInline(content)}</h1>;
    }
    if (block.startsWith('## ')) {
        const content = block.substring(3);
        const id = slugify(content);
        return <h2 key={index} id={id} className="text-2xl font-bold mt-8 mb-4 border-b pb-3 text-slate-800">{parseInline(content)}</h2>;
    }
    if (block.startsWith('### ')) {
        const content = block.substring(4);
        const id = slugify(content);
        return <h3 key={index} id={id} className="text-xl font-semibold mt-6 mb-3 text-slate-700">{parseInline(content)}</h3>;
    }
    
    // Horizontal Rule
    if (block.startsWith('---')) return <hr key={index} className="my-8" />;

    // Blockquote
    if (block.startsWith('> ')) {
        const lines = block.split('\n').map(line => line.substring(2)).join('\n');
        return <blockquote key={index} className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4">{parseInline(lines)}</blockquote>;
    }

    // List
    if (block.match(/^(\* |- |[0-9]+\.) /m)) {
       const isOrdered = /^[0-9]+\. /.test(block.trim());
        const items = block.split('\n').map((item, i) => {
            if (!item.trim()) return null;
            const content = item.replace(/^(\* |- |[0-9]+\.)\s*/, '');
            return <li key={i} className="my-1">{parseInline(content)}</li>
        }).filter(Boolean);
        
        if (isOrdered) {
            return <ol key={index} className="list-decimal pl-6 space-y-2 my-4">{items}</ol>;
        }
        return <ul key={index} className="list-disc pl-6 space-y-2 my-4">{items}</ul>;
    }
    
    // Table
    if (block.includes('|')) {
        const lines = block.split('\n').filter(line => line.trim().length > 0 && line.includes('|'));
        if (lines.length > 1 && lines[1].includes('---')) {
            const header = lines[0].split('|').map(h => h.trim()).filter(Boolean);
            const body = lines.slice(2).map(row => row.split('|').map(c => c.trim()));

            return (
                <div key={index} className="my-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 border border-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                {header.map((h, i) => <th key={i} className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{parseInline(h)}</th>)}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {body.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    {row.slice(1, -1).map((cell, j) => <td key={j} className="px-4 py-3 text-sm text-slate-700">{parseInline(cell)}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    // Code Block
    if (block.startsWith('```')) {
        const lang = block.split('\n')[0].substring(3);
        const code = block.substring(block.indexOf('\n') + 1, block.lastIndexOf('```')).trim();
        return (
            <div key={index} className="my-6">
                {lang && <div className="text-xs text-slate-400 font-mono bg-slate-800 rounded-t-md px-3 py-1 inline-block">{lang}</div>}
                <pre className={`bg-slate-800 text-white p-4 ${lang ? 'rounded-b-md' : 'rounded-md'} overflow-x-auto text-sm`}>
                    <code>{code}</code>
                </pre>
            </div>
        );
    }
    
    // Math Block
    if (block.startsWith('$$')) {
        const math = block.slice(2, -2).trim();
        return <KatexRenderer key={index} math={math} block />;
    }

    // Paragraph
    if (block.trim()) {
        return <p key={index} className="my-4 leading-relaxed text-slate-800">{parseInline(block)}</p>;
    }

    return null;
};

export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Robust Two-Phase Parsing Strategy:
    // Phase 1: Split content by multi-line delimited blocks (code, tables, math), keeping the blocks.
    // This correctly handles content within these blocks that might contain empty lines.
    const parts = content.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$|\|[\s\S]*?\|\n)/g);
    
    const renderedParts = parts.map((part, index) => {
        if (!part || part.trim() === '') return null;

        // Odd-indexed parts are the captured special blocks.
        if (index % 2 === 1) {
            return renderBlock(part.trim(), `part-${index}`);
        } 
        // Even-indexed parts are the regular content between special blocks.
        else {
            // Phase 2: Split the regular content by one or more empty lines.
            // This correctly separates paragraphs, lists, quotes, and headers.
            const normalBlocks = part.split(/\n\s*\n/);
            return normalBlocks.map((block, subIndex) => {
                const trimmedBlock = block.trim();
                if (trimmedBlock === '') return null;
                return renderBlock(trimmedBlock, `part-${index}-${subIndex}`);
            });
        }
    });

    return <>{renderedParts}</>;
};