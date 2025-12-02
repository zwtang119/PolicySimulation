
// Note: To avoid issues with backticks inside template literals,
// they are escaped as `\``. The MarkdownRenderer will handle this.
import { VOL_1 } from './whitepaper/vol-01';
import { VOL_2 } from './whitepaper/vol-02';
import { VOL_3 } from './whitepaper/vol-03';
import { VOL_4 } from './whitepaper/vol-04';
import { VOL_5 } from './whitepaper/vol-05';
import { VOL_6 } from './whitepaper/vol-06';
import { VOL_7 } from './whitepaper/vol-07';
import { VOL_8 } from './whitepaper/vol-08';
import { VOL_9 } from './whitepaper/vol-09';
import { VOL_10 } from './whitepaper/vol-10';
import { VOL_11 } from './whitepaper/vol-11';
import { VOL_12 } from './whitepaper/vol-12';
import { VOL_13 } from './whitepaper/vol-13';
import { VOL_14 } from './whitepaper/vol-14';


export const whitepaperData = [
    {
        title: '第一篇：战略与理论',
        volumes: [
            { title: '卷一：战略总论与体系概览', content: VOL_1 },
            { title: '卷二：政策科学与复杂系统方法论', content: VOL_2 },
        ]
    },
    {
        title: '第二篇：模型与仿真',
        volumes: [
            { title: '卷三：模型设计原理', content: VOL_3 },
            { title: '卷四：企业数字孪生', content: VOL_4 },
            { title: '卷五：政策扩散与仿真引擎', content: VOL_5 },
        ]
    },
    {
        title: '第三篇：工程与数据',
        volumes: [
            { title: '卷六：数据体系与可观测现实', content: VOL_6 },
            { title: '卷七：人机共生决策界面', content: VOL_7 },
            { title: '卷九：工程架构与实现指引', content: VOL_9 },
        ]
    },
     {
        title: '第四篇：应用与安全',
        volumes: [
            { title: '卷八：应用案例与战略推演', content: VOL_8 },
            { title: '卷十一：安全架构与自主化体系', content: VOL_11 },
            { title: '卷十三：数据基石：国产可信数据库', content: VOL_13 },
            { title: '卷十四：智能核心：国产开源大模型', content: VOL_14 },
        ]
    },
    {
        title: '第五篇：价值与展望',
        volumes: [
            { title: '卷十：前瞻展望与制度价值', content: VOL_10 },
            { title: '卷十二：国家治理的数字基座', content: VOL_12 },
        ]
    }
];
