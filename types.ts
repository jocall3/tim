export interface ThreatActor {
    id: string;
    name: string;
    description: string;
    origin: string;
    motives: string[];
    techniques: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    lastActivity: string; // ISO date string
    tags: string[];
    associatedCampaigns: string[];
    mitigationStrategies: string[];
    confidence: number; // 0-100
    indicatorsOfCompromise: IoC[];
}

export interface IoC {
    id: string;
    type: 'IP' | 'Domain' | 'Hash' | 'URL' | 'Email' | 'FilePath' | 'Mutex' | 'RegistryKey';
    value: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    timestamp: string; // ISO date string
    firstSeen: string;
    lastSeen: string;
    tags: string[];
    confidence: number;
    description?: string;
}

export interface Vulnerability {
    cveId: string;
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    cvssScore: number;
    publishedDate: string; // ISO date string
    updatedDate: string; // ISO date string
    exploitAvailable: boolean;
    patchAvailable: boolean;
    affectedProducts: string[];
    references: string[];
    tags: string[];
    remediationSteps: string[];
}

export interface AttackSimulationResult {
    id: string;
    name: string;
    startTime: string; // ISO date string
    endTime: string; // ISO date string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    targetSystem: string;
    attackVector: string;
    adversaryEmulation: string; // e.g., "APT29"
    detectionRate: number; // 0-100%
    preventionRate: number; // 0-100%
    vulnerabilitiesExploited: string[]; // CVE IDs
    mitigationRecommendations: string[];
    reportUrl: string;
    logs: string[];
    riskScoreChange: number; // e.g., -5 (improvement) or +10 (degradation)
    tags: string[];
}

export interface ThreatReport {
    id: string;
    title: string;
    author: string;
    publishDate: string; // ISO date string
    summary: string;
    fullReportContent: string;
    tags: string[];
    relatedIoCs: IoC[];
    relatedActors: ThreatActor[];
    relatedVulnerabilities: Vulnerability[];
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
}

export interface GlobalThreatSummary {
    totalActiveThreatActors: number;
    criticalVulnerabilities: number;
    newIoCsLast24h: number;
    ongoingCampaigns: number;
    sectorSpecificThreats: { [key: string]: number };
    topAttacksToday: { type: string; count: number }[];
    globalRiskScore: number; // 0-100
}

export interface AIModelConfig {
    id: string;
    name: string;
    description: string;
    modelType: 'prediction' | 'detection' | 'simulation' | 'generative';
    status: 'active' | 'inactive' | 'training' | 'error';
    lastTrained: string;
    performanceMetrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
    };
    inputFeatures: string[];
    outputSchema: string;
    version: string;
    tags: string[];
}

export interface SecurityPolicy {
    id: string;
    name: string;
    description: string;
    type: 'network' | 'endpoint' | 'access' | 'data' | 'application';
    status: 'active' | 'inactive' | 'draft';
    lastUpdatedBy: string;
    lastUpdatedDate: string;
    rules: string[]; // Simplified for example
    enforcementPoints: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    complianceStandards: string[];
}

export interface Asset {
    id: string;
    name: string;
    type: 'server' | 'database' | 'application' | 'network_device' | 'cloud_instance';
    ipAddress: string;
    criticality: 'low' | 'medium' | 'high' | 'critical';
    owner: string;
    lastScanned: string;
    vulnerabilities: string[]; // CVE IDs
    associatedPolicies: string[]; // Policy IDs
    tags: string[];
    status: 'online' | 'offline' | 'compromised';
    geolocation: string;
    firmwareVersion?: string;
    osVersion?: string;
    installedSoftware?: string[];
}

export interface UserBehaviorAnomaly {
    id: string;
    userId: string;
    username: string;
    anomalyType: 'login' | 'data_access' | 'resource_usage' | 'privilege_escalation';
    timestamp: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    status: 'new' | 'investigating' | 'resolved' | 'false_positive';
    associatedIoCs: IoC[];
    suggestedAction: string;
}

export interface IncidentResponsePlaybook {
    id: string;
    name: string;
    description: string;
    triggerCondition: string; // e.g., "Critical Alert from SIEM"
    severityLevel: 'low' | 'medium' | 'high' | 'critical';
    steps: { order: number; action: string; assignee: string; status: 'todo' | 'in_progress' | 'completed' }[];
    lastUpdated: string;
    ownerTeam: string;
    tags: string[];
}

export interface DataPrivacyRegulation {
    id: string;
    name: string;
    jurisdiction: string;
    description: string;
    keyRequirements: string[];
    complianceStatus: 'compliant' | 'non-compliant' | 'partial';
    lastAuditDate: string;
    riskOfNonCompliance: 'low' | 'medium' | 'high';
}

export interface EventLog {
    id: string;
    timestamp: string;
    source: string;
    eventType: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    tags: string[];
    associatedIoC?: IoC;
    userId?: string;
    assetId?: string;
    details?: Record<string, any>;
}

export interface ThreatFeedSource {
    id: string;
    name: string;
    url: string;
    format: string;
    lastIngested: string;
    status: 'active' | 'inactive' | 'error';
    refreshInterval: number; // in minutes
    category: 'OSINT' | 'commercial' | 'internal' | 'darkweb';
    confidenceScore: number; // 0-100, reliability of the source
}
