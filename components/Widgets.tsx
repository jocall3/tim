import React, { useMemo, useState, useEffect } from 'react';
import { useThreatIntelligence } from '../context/ThreatContext';
import { Card, FilterableTable, DetailPanel, LoadingSpinner } from './Shared';
import { Users, AlertOctagon, Plus, Target, TrendingUp, Zap, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, FileText, ExternalLink, Play, Settings, Download, Search, Eye } from 'lucide-react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { generateRandomId } from '../utils/mockData';
import { IoC, ThreatActor, Vulnerability, AttackSimulationResult, AIModelConfig, ThreatReport, SecurityPolicy, UserBehaviorAnomaly, IncidentResponsePlaybook, DataPrivacyRegulation, EventLog, ThreatFeedSource } from '../types';

// --- Global Threat Summary ---
export const GlobalThreatSummaryWidget: React.FC = () => {
    const { globalSummary, refreshData } = useThreatIntelligence();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [globalSummary]);

    const dataPoints = useMemo(() => [
        { label: "Active Threat Actors", value: globalSummary.totalActiveThreatActors, icon: Users, color: "text-red-400" },
        { label: "Critical Vulnerabilities", value: globalSummary.criticalVulnerabilities, icon: AlertOctagon, color: "text-yellow-400" },
        { label: "New IoCs (24h)", value: globalSummary.newIoCsLast24h, icon: Plus, color: "text-blue-400" },
        { label: "Ongoing Campaigns", value: globalSummary.ongoingCampaigns, icon: Target, color: "text-green-400" },
    ], [globalSummary]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#AF19FF', '#FF0000'];

    if (isLoading) return <LoadingSpinner />;

    return (
        <Card title="Global Threat Summary" className="col-span-1 md:col-span-3 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {dataPoints.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-700 rounded-md shadow-md">
                        <item.icon className={`h-8 w-8 mr-3 ${item.color}`} />
                        <div>
                            <p className="text-xl font-bold text-white">{item.value}</p>
                            <p className="text-sm text-gray-400">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-blue-400" />Global Risk Score: <span className="ml-2 text-xl font-bold" style={{ color: globalSummary.globalRiskScore > 70 ? '#EF4444' : globalSummary.globalRiskScore > 40 ? '#F59E0B' : '#34D399' }}>{globalSummary.globalRiskScore}</span></h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                            data={[{ name: 'Score', value: globalSummary.globalRiskScore }]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis domain={[0, 100]} stroke="#6b7280" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} itemStyle={{ color: '#e5e7eb' }} />
                            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><Zap className="h-5 w-5 mr-2 text-yellow-400" />Top Attack Types Today</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={globalSummary.topAttacksToday}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="type"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {globalSummary.topAttacksToday.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} itemStyle={{ color: '#e5e7eb' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

// --- IoC Widget ---
export const IoCThreatFeedWidget: React.FC = () => {
    const { ioCs, addIoC, updateIoC, deleteIoC } = useThreatIntelligence();
    const [selectedIoC, setSelectedIoC] = useState<IoC | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formState, setFormState] = useState<Partial<IoC>>({});

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveIoC = () => {
        if (isAddingNew) {
            addIoC({
                id: generateRandomId(),
                timestamp: new Date().toISOString(),
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                tags: (formState.tags as any) || [],
                confidence: formState.confidence || 0,
                description: formState.description || '',
                ...formState
            } as IoC);
        } else if (selectedIoC) {
            updateIoC({ ...selectedIoC, ...formState } as IoC);
        }
        setSelectedIoC(null);
        setIsAddingNew(false);
        setFormState({});
    };

    const iocColumns = useMemo(() => [
        { header: "Type", accessor: "type" as keyof IoC },
        { header: "Value", accessor: "value" as keyof IoC, render: (ioc: IoC) => <span className="font-mono text-purple-300 break-all">{ioc.value}</span> },
        { header: "Severity", accessor: "severity" as keyof IoC, render: (ioc: IoC) => (
            <span className={`px-2 py-1 text-xs rounded-full ${ioc.severity === 'critical' ? 'bg-red-500' : ioc.severity === 'high' ? 'bg-orange-500' : ioc.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                {ioc.severity}
            </span>
        )},
        { header: "Confidence", accessor: "confidence" as keyof IoC, render: (ioc: IoC) => `${ioc.confidence}%` },
        { header: "Last Seen", accessor: "lastSeen" as keyof IoC, render: (ioc: IoC) => new Date(ioc.lastSeen).toLocaleDateString() },
    ], []);

    return (
        <Card title="Indicators of Compromise (IoCs)" className="col-span-1 md:col-span-3">
             <div className="mb-4 flex justify-end">
                <button
                    onClick={() => { setIsAddingNew(true); setFormState({}); setSelectedIoC(null); }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add New IoC
                </button>
            </div>
            <FilterableTable<IoC>
                data={ioCs}
                columns={iocColumns}
                title="IoC List"
                initialSortBy="lastSeen"
                initialSortDirection="desc"
                searchPlaceholder="Search IoCs..."
                onRowClick={setSelectedIoC}
                actionButtons={(ioc) => (
                    <div className="flex space-x-2">
                         <button onClick={(e) => { e.stopPropagation(); setFormState(ioc); setIsAddingNew(false); }} className="text-purple-400 hover:text-purple-300"><Edit className="h-4 w-4" /></button>
                         <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete ${ioc.value}?`)) deleteIoC(ioc.id); }} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                    </div>
                )}
            />
             {(selectedIoC || isAddingNew || (formState.id && !isAddingNew)) && (
                <DetailPanel title={isAddingNew ? "Add New IoC" : `IoC Details`} onClose={() => { setSelectedIoC(null); setIsAddingNew(false); }}>
                     {isAddingNew || formState.id ? (
                        <div className="space-y-4">
                            <div><label className="block text-gray-300 text-sm font-bold mb-2">Value</label><input name="value" value={formState.value || ''} onChange={handleFormChange} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white" /></div>
                             <button onClick={handleSaveIoC} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                        </div>
                     ) : (
                         <div className="text-gray-300">
                             <p className="mb-4">{selectedIoC?.description}</p>
                             <div className="grid grid-cols-2 gap-4">
                                <div><span className="font-bold">Type:</span> {selectedIoC?.type}</div>
                                <div><span className="font-bold">Value:</span> <span className="font-mono text-purple-300 break-all">{selectedIoC?.value}</span></div>
                                <div><span className="font-bold">Source:</span> {selectedIoC?.source}</div>
                             </div>
                         </div>
                     )}
                </DetailPanel>
            )}
        </Card>
    );
};

// --- Threat Actor Profiling ---
export const ThreatActorProfiling: React.FC = () => {
    const { threatActors } = useThreatIntelligence();
    const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(null);

    const actorColumns = useMemo(() => [
        { header: "Name", accessor: "name" as keyof ThreatActor },
        { header: "Origin", accessor: "origin" as keyof ThreatActor },
        { header: "Severity", accessor: "severity" as keyof ThreatActor, render: (actor: ThreatActor) => (
            <span className={`px-2 py-1 text-xs rounded-full ${actor.severity === 'critical' ? 'bg-red-500' : actor.severity === 'high' ? 'bg-orange-500' : 'bg-green-500'} text-white`}>{actor.severity}</span>
        )},
        { header: "Last Activity", accessor: "lastActivity" as keyof ThreatActor, render: (actor: ThreatActor) => new Date(actor.lastActivity).toLocaleDateString() },
    ], []);

    return (
        <Card title="Threat Actor Profiling" className="col-span-1 md:col-span-3">
            <FilterableTable<ThreatActor> data={threatActors} columns={actorColumns} title="Known Threat Actors" onRowClick={setSelectedActor} />
            {selectedActor && (
                <DetailPanel title={selectedActor.name} onClose={() => setSelectedActor(null)}>
                    <div className="space-y-4 text-gray-300">
                        <p>{selectedActor.description}</p>
                        <div><span className="font-bold text-white">Origin:</span> {selectedActor.origin}</div>
                        <div><span className="font-bold text-white">Motives:</span> {selectedActor.motives.join(', ')}</div>
                        <div><span className="font-bold text-white">Techniques:</span> {selectedActor.techniques.join(', ')}</div>
                        <div><span className="font-bold text-white">Campaigns:</span> {selectedActor.associatedCampaigns.join(', ')}</div>
                    </div>
                </DetailPanel>
            )}
        </Card>
    );
};

// --- AITrainingAndPerformance ---
export const AITrainingAndPerformance: React.FC = () => {
    const { aiModelConfigs } = useThreatIntelligence();
    const [selectedModel, setSelectedModel] = useState<AIModelConfig | null>(null);

    const modelColumns = useMemo(() => [
        { header: "Name", accessor: "name" as keyof AIModelConfig },
        { header: "Status", accessor: "status" as keyof AIModelConfig, render: (model: AIModelConfig) => <span className={`px-2 py-1 text-xs rounded-full ${model.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>{model.status}</span> },
        { header: "Accuracy", accessor: "performanceMetrics" as keyof AIModelConfig, render: (model: AIModelConfig) => `${(model.performanceMetrics.accuracy * 100).toFixed(1)}%` },
    ], []);

    return (
        <Card title="AI Model Performance" className="col-span-1 md:col-span-3">
             <FilterableTable<AIModelConfig> data={aiModelConfigs} columns={modelColumns} title="Models" onRowClick={setSelectedModel} />
             {selectedModel && (
                 <DetailPanel title={selectedModel.name} onClose={() => setSelectedModel(null)}>
                     <div className="space-y-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart outerRadius={90} data={[
                                { subject: 'Accuracy', A: selectedModel.performanceMetrics.accuracy * 100, fullMark: 100 },
                                { subject: 'Precision', A: selectedModel.performanceMetrics.precision * 100, fullMark: 100 },
                                { subject: 'Recall', A: selectedModel.performanceMetrics.recall * 100, fullMark: 100 },
                                { subject: 'F1 Score', A: selectedModel.performanceMetrics.f1Score * 100, fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="#4b5563" />
                                <PolarAngleAxis dataKey="subject" stroke="#e5e7eb" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" />
                                <Radar name={selectedModel.name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} itemStyle={{ color: '#e5e7eb' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-end space-x-2">
                            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><Play className="h-4 w-4 mr-2" /> Retrain</button>
                        </div>
                     </div>
                 </DetailPanel>
             )}
        </Card>
    );
};