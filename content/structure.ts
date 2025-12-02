
import { whitepaperData } from './whitepaperData';

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '');        // Trim - from end of text
};

const structureContent = () => {
    return whitepaperData.map((part, partIndex) => {
        return {
            ...part,
            volumes: part.volumes.map((volume, volumeIndex) => {
                const sections: { id: string; title: string; level: number }[] = [];
                const lines = (volume.content as string).split('\n');
                
                lines.forEach(line => {
                    if (line.startsWith('## ') || line.startsWith('### ')) {
                        const level = line.startsWith('## ') ? 2 : 3;
                        const title = line.replace(/^(##|###) /, '').trim();
                        // Create a unique ID for deep linking
                        const id = `part-${partIndex}-vol-${volumeIndex}-sec-${slugify(title)}`;
                        sections.push({ id, title, level });
                    }
                });

                return {
                    ...volume,
                    rawContent: volume.content as string, // Keep the original raw content for the renderer
                    sections,
                };
            }),
        };
    });
};

export const structuredWhitepaperData = structureContent();
