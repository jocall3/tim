import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { IoC, ThreatActor, Vulnerability, AttackSimulationResult, ThreatReport, AIModelConfig, SecurityPolicy, Asset, UserBehaviorAnomaly, IncidentResponsePlaybook, DataPrivacyRegulation, EventLog, ThreatFeedSource, GlobalThreatSummary } from '../types';
import { generateDummyIoC, generateDummyThreatActor, generateDummyVulnerability, generateDummySimulationResult, generateDummyThreatReport, generateDummyAIModelConfig, generateDummySecurityPolicy, generateDummyAsset, generateDummyUserBehaviorAnomaly, generateDummyIncidentResponsePlaybook, generateDummyDataPrivacyRegulation, generateDummyEventLog, generateDummyThreatFeedSource, generateRandomId } from '../utils/mockData';

interface ThreatIntelligenceContextType {
    ioCs: IoC[];
    threatActors: ThreatActor[];
    vulnerabilities: Vulnerability[];
    attackSimulations: AttackSimulationResult[];
    threatReports: ThreatReport[];
    aiModelConfigs: AIModelConfig[];
    securityPolicies: SecurityPolicy[];
    assets: Asset[];
    userAnomalies: UserBehaviorAnomaly[];
    incidentPlaybooks: IncidentResponsePlaybook[];
    privacyRegulations: DataPrivacyRegulation[];
    eventLogs: EventLog[];
    threatFeedSources: ThreatFeedSource[];
    globalSummary: GlobalThreatSummary;
    refreshData: () => void;
    addIoC: (ioc: IoC) => void;
    updateIoC: (ioc: IoC) => void;
    deleteIoC: (id: string) => void;
}

const ThreatIntelligenceContext = createContext<ThreatIntelligenceContextType | undefined>(undefined);

export const ThreatIntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ioCs, setIoCs] = useState<IoC[]>([]);
    const [threatActors, setThreatActors] = useState<ThreatActor[]>([]);
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [attackSimulations, setAttackSimulations] = useState<AttackSimulationResult[]>([]);
    const [threatReports, setThreatReports] = useState<ThreatReport[]>([]);
    const [aiModelConfigs, setAiModelConfigs] = useState<AIModelConfig[]>([]);
    const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [userAnomalies, setUserAnomalies] = useState<UserBehaviorAnomaly[]>([]);
    const [incidentPlaybooks, setIncidentPlaybooks] = useState<IncidentResponsePlaybook[]>([]);
    const [privacyRegulations, setPrivacyRegulations] = useState<DataPrivacyRegulation[]>([]);
    const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
    const [threatFeedSources, setThreatFeedSources] = useState<ThreatFeedSource[]>([]);
    const [globalSummary, setGlobalSummary] = useState<GlobalThreatSummary>({
        totalActiveThreatActors: 0,
        criticalVulnerabilities: 0,
        newIoCsLast24h: 0,
        ongoingCampaigns: 0,
        sectorSpecificThreats: {},
        topAttacksToday: [],
        globalRiskScore: 0,
    });

    const refreshData = useCallback(() => {
        setIoCs(generateDummyIoC(50));
        setThreatActors(generateDummyThreatActor(10));
        setVulnerabilities(generateDummyVulnerability(30));
        setAttackSimulations(generateDummySimulationResult(15));
        setThreatReports(generateDummyThreatReport(20));
        setAiModelConfigs(generateDummyAIModelConfig(8));
        setSecurityPolicies(generateDummySecurityPolicy(20));
        setAssets(generateDummyAsset(50));
        setUserAnomalies(generateDummyUserBehaviorAnomaly(25));
        setIncidentPlaybooks(generateDummyIncidentResponsePlaybook(10));
        setPrivacyRegulations(generateDummyDataPrivacyRegulation(7));
        setEventLogs(generateDummyEventLog(200));
        setThreatFeedSources(generateDummyThreatFeedSource(10));
    }, []);

    // Update global summary based on fresh data
    useEffect(() => {
        const newIoCs24h = ioCs.filter(ioc => (new Date().getTime() - new Date(ioc.timestamp).getTime()) < 24 * 60 * 60 * 1000).length;
        const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical').length;
        const activeActors = threatActors.filter(ta => (new Date().getTime() - new Date(ta.lastActivity).getTime()) < 30 * 24 * 60 * 60 * 1000).length;
        const uniqueCampaigns = new Set(threatActors.flatMap(ta => ta.associatedCampaigns)).size;

        const sectorThreats: { [key: string]: number } = {};
        threatActors.forEach(ta => ta.tags.forEach(tag => {
            if (tag.includes('industry')) {
                sectorThreats[tag] = (sectorThreats[tag] || 0) + 1;
            }
        }));

        const topAttacks: { [key: string]: number } = {};
        ioCs.forEach(ioc => {
            const attackType = ioc.tags.includes('phishing') ? 'Phishing' : ioc.tags.includes('ransomware') ? 'Ransomware' : 'Malware';
            topAttacks[attackType] = (topAttacks[attackType] || 0) + 1;
        });
        const sortedTopAttacks = Object.entries(topAttacks)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 3)
            .map(([type, count]) => ({ type, count }));

        const calculateGlobalRiskScore = (): number => {
            const iocImpact = ioCs.filter(ioc => ioc.severity === 'critical').length * 2 + ioCs.filter(ioc => ioc.severity === 'high').length;
            const actorImpact = threatActors.filter(ta => ta.severity === 'critical').length * 3 + threatActors.filter(ta => ta.severity === 'high').length * 1.5;
            const vulnImpact = vulnerabilities.filter(v => v.severity === 'critical' && v.exploitAvailable).length * 4 + vulnerabilities.filter(v => v.severity === 'high' && v.exploitAvailable).length * 2;
            const anomalyImpact = userAnomalies.filter(ua => ua.severity === 'critical' && ua.status !== 'false_positive').length * 2;
            const simulationRisk = attackSimulations.reduce((acc, sim) => acc + (100 - sim.preventionRate) * (sim.vulnerabilitiesExploited.length > 0 ? 1 : 0.5), 0) / (attackSimulations.length || 1);

            let totalScore = iocImpact + actorImpact + vulnImpact + anomalyImpact + simulationRisk;
            totalScore = Math.min(100, Math.max(0, totalScore / 10)); // Scale to 0-100
            return parseFloat(totalScore.toFixed(1));
        };

        setGlobalSummary({
            totalActiveThreatActors: activeActors,
            criticalVulnerabilities: criticalVulns,
            newIoCsLast24h: newIoCs24h,
            ongoingCampaigns: uniqueCampaigns,
            sectorSpecificThreats: sectorThreats,
            topAttacksToday: sortedTopAttacks,
            globalRiskScore: calculateGlobalRiskScore(),
        });
    }, [ioCs, vulnerabilities, threatActors, userAnomalies, attackSimulations]);

    useEffect(() => {
        refreshData();
        const intervalId = setInterval(refreshData, 5 * 60 * 1000); // Refresh every 5 minutes
        return () => clearInterval(intervalId);
    }, [refreshData]);

    const addIoC = useCallback((ioc: IoC) => setIoCs(prev => [...prev, ioc]), []);
    const updateIoC = useCallback((updatedIoc: IoC) => setIoCs(prev => prev.map(ioc => ioc.id === updatedIoc.id ? updatedIoc : ioc)), []);
    const deleteIoC = useCallback((id: string) => setIoCs(prev => prev.filter(ioc => ioc.id !== id)), []);

    const contextValue = useMemo(() => ({
        ioCs, threatActors, vulnerabilities, attackSimulations, threatReports, aiModelConfigs,
        securityPolicies, assets, userAnomalies, incidentPlaybooks, privacyRegulations, eventLogs,
        threatFeedSources, globalSummary, refreshData, addIoC, updateIoC, deleteIoC
    }), [ioCs, threatActors, vulnerabilities, attackSimulations, threatReports, aiModelConfigs,
        securityPolicies, assets, userAnomalies, incidentPlaybooks, privacyRegulations, eventLogs,
        threatFeedSources, globalSummary, refreshData, addIoC, updateIoC, deleteIoC]);

    return (
        <ThreatIntelligenceContext.Provider value={contextValue}>
            {children}
        </ThreatIntelligenceContext.Provider>
    );
};

export const useThreatIntelligence = () => {
    const context = useContext(ThreatIntelligenceContext);
    if (context === undefined) {
        throw new Error('useThreatIntelligence must be used within a ThreatIntelligenceProvider');
    }
    return context;
};
