
import React, { useState, useMemo } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../contexts/DataContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c'];

export const DataQuery: React.FC = () => {
    const { companies } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    // Filter Logic
    const filteredCompanies = useMemo(() => {
        return companies.filter(c => {
            const matchName = c.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCountry = countryFilter ? c.country === countryFilter : true;
            return matchName && matchCountry;
        });
    }, [companies, searchTerm, countryFilter]);

    // Derived Data for Charts (Aggregated by Country)
    const pieData = useMemo(() => {
        const countries: Record<string, number> = {};
        companies.forEach(c => {
            const cnt = c.country || '未知';
            countries[cnt] = (countries[cnt] || 0) + 1;
        });
        return Object.keys(countries).map(key => ({ name: key, value: countries[key] }));
    }, [companies]);

    // Mocking size data for bar chart
    const barData = useMemo(() => {
        return filteredCompanies.slice(0, 8).map(c => ({
            name: c.name,
            value: c.dna ? 80 + Math.floor(Math.random() * 50) : 20 // Mock data or low if no DNA
        }));
    }, [filteredCompanies]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Search Filters */}
            <Card title="全球商业航天企业库查询">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">国家筛选</label>
                        <select 
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-slate-500"
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                        >
                            <option value="">全部国家</option>
                            <option value="中国">中国</option>
                            <option value="美国">美国</option>
                            <option value="欧洲">欧洲</option>
                            <option value="日本">日本</option>
                            <option value="未知">未知</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">企业名称</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-slate-500" 
                            placeholder="输入名称关键字..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">录入时间</label>
                        <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-slate-500" />
                    </div>
                    <div className="flex items-end space-x-2">
                        <Button variant="secondary" className="flex-1" onClick={() => {setSearchTerm(''); setCountryFilter('')}}>重置</Button>
                        <Button variant="primary" className="flex-1 bg-slate-900">查询</Button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">企业名称</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属国家</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">官网 / 数据源</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">核心特征 (DNA)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCompanies.length === 0 ? (
                                <tr><td colSpan={4} className="p-4 text-center text-gray-500 text-sm">无匹配数据</td></tr>
                            ) : filteredCompanies.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{c.name}</td>
                                    <td className="px-4 py-2 text-sm">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            c.country === '中国' ? 'bg-red-50 text-red-700' :
                                            c.country === '美国' ? 'bg-blue-50 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {c.country}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-xs text-gray-500 truncate max-w-[200px]">{c.url}</td>
                                    <td className="px-4 py-2 text-sm text-gray-500">
                                        {c.dna ? (
                                            <div className="flex flex-wrap gap-1">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{c.dna.archetype}</span>
                                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">研效:{c.dna.rdEffectiveness}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">待生成DNA...</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="全球商业航天力量分布 (按国家)">
                    <div className="h-64">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">暂无数据</div>
                        )}
                    </div>
                </Card>
                <Card title="筛选企业综合影响力指数">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={barData}
                                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} style={{fontSize: '11px'}} interval={0} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" fill="#334155" barSize={15} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
