import { IoC, ThreatActor, Vulnerability, AttackSimulationResult, ThreatReport, AIModelConfig, SecurityPolicy, Asset, UserBehaviorAnomaly, IncidentResponsePlaybook, DataPrivacyRegulation, EventLog, ThreatFeedSource } from '../types';

export const generateRandomId = () => Math.random().toString(36).substring(2, 15);
const getRandomDate = () => new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString();
const getRandomSeverity = (): 'low' | 'medium' | 'high' | 'critical' => ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any;
const getRandomStatus = (): 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' => ['pending', 'running', 'completed', 'failed', 'cancelled'][Math.floor(Math.random() * 5)] as any;

export const generateDummyIoC = (count: number = 10): IoC[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    type: ['IP', 'Domain', 'Hash', 'URL', 'Email', 'FilePath'][Math.floor(Math.random() * 6)] as any,
    value: Math.random() < 0.5 ? `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : `malicious-domain-${generateRandomId()}.com`,
    severity: getRandomSeverity(),
    source: `Feed-${Math.floor(Math.random() * 5) + 1}`,
    timestamp: getRandomDate(),
    firstSeen: getRandomDate(),
    lastSeen: getRandomDate(),
    tags: ['malware', 'phishing', 'ransomware', 'apt', 'exploit'].filter(() => Math.random() > 0.5),
    confidence: Math.floor(Math.random() * 100),
    description: `IoC description for ${generateRandomId()}`,
}));

export const generateDummyThreatActor = (count: number = 5): ThreatActor[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: `APT Group ${Math.floor(Math.random() * 100)}`,
    description: `Sophisticated threat actor group with a focus on ${Math.random() < 0.5 ? 'financial espionage' : 'critical infrastructure disruption'}.`,
    origin: ['Russia', 'China', 'North Korea', 'Iran', 'Eastern Europe'][Math.floor(Math.random() * 5)],
    motives: ['espionage', 'financial gain', 'sabotage', 'activism'].filter(() => Math.random() > 0.3),
    techniques: ['spear phishing', 'supply chain attacks', 'zero-day exploits', 'ransomware'].filter(() => Math.random() > 0.4),
    severity: getRandomSeverity(),
    lastActivity: getRandomDate(),
    tags: ['nation-state', 'criminal', 'insider'].filter(() => Math.random() > 0.5),
    associatedCampaigns: [`Campaign-${generateRandomId()}`, `Campaign-${generateRandomId()}`].filter(() => Math.random() > 0.5),
    mitigationStrategies: ['Enhanced MFA', 'Network Segmentation', 'Endpoint Detection'].filter(() => Math.random() > 0.5),
    confidence: Math.floor(Math.random() * 100),
    indicatorsOfCompromise: generateDummyIoC(Math.floor(Math.random() * 5)),
}));

export const generateDummyVulnerability = (count: number = 15): Vulnerability[] => Array.from({ length: count }).map(() => ({
    cveId: `CVE-2023-${Math.floor(Math.random() * 10000)}`,
    name: `Vulnerability ${generateRandomId().substring(0, 8)}`,
    description: `A critical vulnerability found in ${Math.random() < 0.5 ? 'web servers' : 'operating systems'}.`,
    severity: getRandomSeverity(),
    cvssScore: parseFloat((Math.random() * (10 - 4) + 4).toFixed(1)),
    publishedDate: getRandomDate(),
    updatedDate: getRandomDate(),
    exploitAvailable: Math.random() > 0.3,
    patchAvailable: Math.random() > 0.6,
    affectedProducts: ['Apache HTTP Server', 'OpenSSL', 'Windows Server', 'Linux Kernel'].filter(() => Math.random() > 0.5),
    references: [`https://nvd.nist.gov/vuln/detail/${generateRandomId()}`],
    tags: ['web', 'server', 'os', 'cloud'].filter(() => Math.random() > 0.5),
    remediationSteps: ['Apply patch', 'Upgrade software', 'Implement WAF rules'].filter(() => Math.random() > 0.5),
}));

export const generateDummySimulationResult = (count: number = 7): AttackSimulationResult[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: `Red-Team Sim ${generateRandomId().substring(0, 8)}`,
    startTime: getRandomDate(),
    endTime: getRandomDate(),
    status: getRandomStatus(),
    targetSystem: ['Production API', 'Internal Database', 'Employee Workstations'][Math.floor(Math.random() * 3)],
    attackVector: ['Phishing Campaign', 'Web Application Exploit', 'Supply Chain Attack'][Math.floor(Math.random() * 3)],
    adversaryEmulation: ['APT29', 'FIN7', 'DarkSide'][Math.floor(Math.random() * 3)],
    detectionRate: Math.floor(Math.random() * 100),
    preventionRate: Math.floor(Math.random() * 100),
    vulnerabilitiesExploited: generateDummyVulnerability(Math.floor(Math.random() * 3)).map(v => v.cveId),
    mitigationRecommendations: ['Update WAF rules', 'Patch specific CVEs', 'Enhance EDR'].filter(() => Math.random() > 0.5),
    reportUrl: `/reports/sim-${generateRandomId()}.pdf`,
    logs: [`Log entry ${generateRandomId()}`, `Log entry ${generateRandomId()}`],
    riskScoreChange: Math.random() < 0.5 ? Math.floor(Math.random() * -10) : Math.floor(Math.random() * 10),
    tags: ['automated', 'critical', 'monthly'].filter(() => Math.random() > 0.5),
}));

export const generateDummyThreatReport = (count: number = 8): ThreatReport[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    title: `Threat Report: ${generateRandomId().substring(0, 12)} - ${['New Malware Variant', 'Phishing Campaign Analysis', 'APT Activity Update'][Math.floor(Math.random() * 3)]}`,
    author: `Analyst ${generateRandomId().substring(0, 4)}`,
    publishDate: getRandomDate(),
    summary: `This report details the discovery of a new threat, its characteristics, and potential impact.`,
    fullReportContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    tags: ['malware', 'phishing', 'APT', 'exploit', 'industry-specific'].filter(() => Math.random() > 0.4),
    relatedIoCs: generateDummyIoC(Math.floor(Math.random() * 3)),
    relatedActors: generateDummyThreatActor(Math.floor(Math.random() * 2)),
    relatedVulnerabilities: generateDummyVulnerability(Math.floor(Math.random() * 2)),
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
    confidence: Math.floor(Math.random() * 100),
}));

export const generateDummyAIModelConfig = (count: number = 5): AIModelConfig[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: `AI Model ${generateRandomId().substring(0, 8)}`,
    description: `An AI model for ${['threat prediction', 'vulnerability detection', 'anomaly detection', 'attack simulation'][Math.floor(Math.random() * 4)]}.`,
    modelType: ['prediction', 'detection', 'simulation', 'generative'][Math.floor(Math.random() * 4)] as any,
    status: ['active', 'inactive', 'training', 'error'][Math.floor(Math.random() * 4)] as any,
    lastTrained: getRandomDate(),
    performanceMetrics: {
        accuracy: parseFloat((Math.random() * (0.99 - 0.7) + 0.7).toFixed(2)),
        precision: parseFloat((Math.random() * (0.99 - 0.7) + 0.7).toFixed(2)),
        recall: parseFloat((Math.random() * (0.99 - 0.7) + 0.7).toFixed(2)),
        f1Score: parseFloat((Math.random() * (0.99 - 0.7) + 0.7).toFixed(2)),
    },
    inputFeatures: ['network_logs', 'endpoint_telemetry', 'threat_feed_data', 'user_activity'].filter(() => Math.random() > 0.5),
    outputSchema: `{ "threat_level": "number", "target_asset": "string" }`,
    version: `v1.${Math.floor(Math.random() * 10)}`,
    tags: ['deep learning', 'machine learning', 'nlp', 'graph analysis'].filter(() => Math.random() > 0.5),
}));

export const generateDummySecurityPolicy = (count: number = 10): SecurityPolicy[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: `Policy ${generateRandomId().substring(0, 8)}`,
    description: `Security policy for ${['network access', 'data encryption', 'endpoint protection', 'application security'][Math.floor(Math.random() * 4)]}.`,
    type: ['network', 'endpoint', 'access', 'data', 'application'][Math.floor(Math.random() * 5)] as any,
    status: ['active', 'inactive', 'draft'][Math.floor(Math.random() * 3)] as any,
    lastUpdatedBy: `User-${Math.floor(Math.random() * 5) + 1}`,
    lastUpdatedDate: getRandomDate(),
    rules: [`Rule-${generateRandomId()}`, `Rule-${generateRandomId()}`],
    enforcementPoints: ['Firewall', 'EDR', 'IAM', 'WAF'].filter(() => Math.random() > 0.5),
    riskLevel: getRandomSeverity(),
    complianceStandards: ['GDPR', 'HIPAA', 'ISO27001', 'PCI-DSS'].filter(() => Math.random() > 0.5),
}));

export const generateDummyAsset = (count: number = 20): Asset[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: `Asset-${generateRandomId().substring(0, 8)}`,
    type: ['server', 'database', 'application', 'network_device', 'cloud_instance'][Math.floor(Math.random() * 5)] as any,
    ipAddress: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    criticality: getRandomSeverity(),
    owner: `Team-${Math.floor(Math.random() * 3) + 1}`,
    lastScanned: getRandomDate(),
    vulnerabilities: generateDummyVulnerability(Math.floor(Math.random() * 3)).map(v => v.cveId),
    associatedPolicies: generateDummySecurityPolicy(Math.floor(Math.random() * 2)).map(p => p.id),
    tags: ['prod', 'dev', 'internal', 'external', 'hr'].filter(() => Math.random() > 0.5),
    status: ['online', 'offline', 'compromised'][Math.floor(Math.random() * 3)] as any,
    geolocation: ['US-East', 'EU-West', 'APAC-South'][Math.floor(Math.random() * 3)],
    firmwareVersion: Math.random() < 0.5 ? `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}` : undefined,
    osVersion: Math.random() < 0.5 ? `Linux Ubuntu 22.04` : `Windows Server 2022`,
    installedSoftware: ['Apache', 'Nginx', 'MongoDB', 'PostgreSQL', 'Node.js', 'Python'].filter(() => Math.random() > 0.6),
}));

export const generateDummyUserBehaviorAnomaly = (count: number = 10): UserBehaviorAnomaly[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    userId: `user-${Math.floor(Math.random() * 1000)}`,
    username: `jsmith${Math.floor(Math.random() * 10)}`,
    anomalyType: ['login', 'data_access', 'resource_usage', 'privilege_escalation'][Math.floor(Math.random() * 4)] as any,
    timestamp: getRandomDate(),
    description: `Unusual activity detected: ${['failed login attempts', 'large data transfer', 'access to sensitive files', 'unauthorized privilege change'][Math.floor(Math.random() * 4)]}`,
    severity: getRandomSeverity(),
    confidence: Math.floor(Math.random() * 100),
    status: ['new', 'investigating', 'resolved', 'false_positive'][Math.floor(Math.random() * 4)] as any,
    associatedIoCs: generateDummyIoC(Math.floor(Math.random() * 2)),
    suggestedAction: ['Block user', 'Reset password', 'Forensic investigation'].filter(() => Math.random() > 0.5).join(', '),
}));

export const generateDummyIncidentResponsePlaybook = (count: number = 5): IncidentResponsePlaybook[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: `Playbook: ${['Phishing Incident', 'Data Breach', 'DDoS Attack', 'Malware Outbreak'][Math.floor(Math.random() * 4)]}`,
    description: `Steps to follow for a ${['phishing', 'data breach', 'DDoS', 'malware'][Math.floor(Math.random() * 4)]} incident.`,
    triggerCondition: `Critical Alert: ${['Phishing Detected', 'Unauthorized Data Exfil', 'High Network Traffic', 'New Malware Signature'][Math.floor(Math.random() * 4)]}`,
    severityLevel: getRandomSeverity(),
    steps: Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, i) => ({
        order: i + 1,
        action: `Step ${i + 1}: ${['Isolate system', 'Notify legal', 'Analyze logs', 'Restore backup', 'Communicate externally'][Math.floor(Math.random() * 5)]}`,
        assignee: `Team ${Math.floor(Math.random() * 3) + 1}`,
        status: ['todo', 'in_progress', 'completed'][Math.floor(Math.random() * 3)] as any,
    })),
    lastUpdated: getRandomDate(),
    ownerTeam: `Team-${Math.floor(Math.random() * 3) + 1}`,
    tags: ['automation', 'critical', 'compliance'].filter(() => Math.random() > 0.5),
}));

export const generateDummyDataPrivacyRegulation = (count: number = 5): DataPrivacyRegulation[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: ['GDPR', 'CCPA', 'HIPAA', 'LGPD', 'NIST-CSF'][Math.floor(Math.random() * 5)],
    jurisdiction: ['EU', 'California, USA', 'USA', 'Brazil', 'Global'][Math.floor(Math.random() * 5)],
    description: `Regulation concerning data privacy and security.`,
    keyRequirements: ['Data minimization', 'Consent management', 'Right to be forgotten', 'Breach notification'].filter(() => Math.random() > 0.4),
    complianceStatus: ['compliant', 'non-compliant', 'partial'][Math.floor(Math.random() * 3)] as any,
    lastAuditDate: getRandomDate(),
    riskOfNonCompliance: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
}));

export const generateDummyEventLog = (count: number = 50): EventLog[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    timestamp: getRandomDate(),
    source: ['firewall', 'siem', 'edr', 'cloud-logs'][Math.floor(Math.random() * 4)],
    eventType: ['login_failure', 'data_exfiltration', 'malware_alert', 'policy_violation', 'system_restart'][Math.floor(Math.random() * 5)],
    message: `Event message for ${generateRandomId()}`,
    severity: ['info', 'warning', 'error', 'critical'][Math.floor(Math.random() * 4)] as any,
    tags: ['network', 'endpoint', 'security'].filter(() => Math.random() > 0.5),
    associatedIoC: Math.random() < 0.3 ? generateDummyIoC(1)[0] : undefined,
    userId: Math.random() < 0.5 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
    assetId: Math.random() < 0.5 ? `asset-${Math.floor(Math.random() * 50)}` : undefined,
    details: Math.random() < 0.4 ? { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, port: Math.floor(Math.random() * 65535) } : undefined,
}));

export const generateDummyThreatFeedSource = (count: number = 8): ThreatFeedSource[] => Array.from({ length: count }).map(() => ({
    id: generateRandomId(),
    name: `Feed-${generateRandomId().substring(0, 8)}`,
    url: `https://threatfeed.example.com/${generateRandomId()}`,
    format: ['STIX/TAXII', 'MISP', 'CSV', 'JSON'][Math.floor(Math.random() * 4)],
    lastIngested: getRandomDate(),
    status: ['active', 'inactive', 'error'][Math.floor(Math.random() * 3)] as any,
    refreshInterval: [5, 15, 30, 60, 240, 1440][Math.floor(Math.random() * 6)],
    category: ['OSINT', 'commercial', 'internal', 'darkweb'][Math.floor(Math.random() * 4)] as any,
    confidenceScore: Math.floor(Math.random() * 100),
}));
