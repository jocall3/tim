import React from 'react';
import { useThreatIntelligence } from '../context/ThreatContext';
import { SectionHeader, Card } from './Shared';
import { 
    GlobalThreatSummaryWidget, 
    IoCThreatFeedWidget, 
    ThreatActorProfiling, 
    AITrainingAndPerformance 
} from './Widgets';
import GeminiAssistant from './GeminiAssistant';
import { Shield, Cloud, Target, Zap, Activity, Search, Terminal, Sliders, Settings } from 'lucide-react';

const ThreatIntelligenceView: React.FC = () => {
    const { refreshData } = useThreatIntelligence();

    return (
        <div className="space-y-6 p-6 bg-gray-900 min-h-screen pb-24">
            <SectionHeader
                title="Threat Intelligence Matrix"
                description="A proactive security command center that aggregates global threat intelligence and uses proprietary AI to predict and mitigate potential attacks."
                icon={Shield}
                onRefresh={refreshData}
            />

            <GlobalThreatSummaryWidget />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Card title="Global Threat Forecasting" className="col-span-1">
                    <div className="flex items-center text-gray-400">
                        <Cloud className="h-6 w-6 mr-2 text-blue-400" />
                        <p>Our AI models predict emerging global cyber threats and their potential impact on the financial sector, allowing you to prepare defenses in advance.</p>
                    </div>
                </Card>
                <Card title="Automated Attack Surface Scans" className="col-span-1">
                    <div className="flex items-center text-gray-400">
                        <Target className="h-6 w-6 mr-2 text-red-400" />
                        <p>Continuously scan the platform for new vulnerabilities and misconfigurations using AI that thinks like an attacker.</p>
                    </div>
                </Card>
                <Card title="Generative Red-Team Simulations" className="col-span-1">
                    <div className="flex items-center text-gray-400">
                        <Zap className="h-6 w-6 mr-2 text-yellow-400" />
                        <p>Use AI to generate and execute sophisticated, novel adversary attack simulations to continuously test and validate your defenses.</p>
                    </div>
                </Card>
                <Card title="Automated Incident Response" className="col-span-1">
                    <div className="flex items-center text-gray-400">
                        <Activity className="h-6 w-6 mr-2 text-green-400" />
                        <p>Automated playbooks triggered by high-severity threats for rapid, pre-approved incident containment and remediation.</p>
                    </div>
                </Card>
            </div>

            <IoCThreatFeedWidget />
            <ThreatActorProfiling />
            <AITrainingAndPerformance />

            <SectionHeader
                title="Advanced Threat Hunting"
                description="Leverage AI-driven queries and behavioral analytics to proactively search for stealthy threats."
                icon={Search}
                showRefresh={false}
            />
            <Card title="Threat Hunting Workbench">
                <p className="text-gray-400">Integrate with SIEM/EDR, build complex queries, visualize threat paths, and automate hunting playbooks.</p>
                <div className="flex justify-end mt-4">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                        <Terminal className="h-5 w-5 mr-2" /> Launch Workbench
                    </button>
                </div>
            </Card>

            <SectionHeader
                title="Security Posture Management"
                description="Gain continuous visibility into your security posture and identify areas for improvement."
                icon={Sliders}
                showRefresh={false}
            />
            <Card title="Security Scorecard & Recommendations">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Overall Posture Score</h4>
                        <div className="text-5xl font-bold text-green-400">85%</div>
                        <p className="text-gray-400">Based on vulnerabilities, misconfigurations, and compliance adherence.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Top 3 Recommendations</h4>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Prioritize patching of 5 critical CVEs affecting production servers.</li>
                            <li>Review and enforce MFA policies for all administrative accounts.</li>
                            <li>Segment critical database networks from general access.</li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300">
                        <Settings className="h-5 w-5 mr-2" /> View Full Report
                    </button>
                </div>
            </Card>
            
            <GeminiAssistant />
        </div>
    );
};

export default ThreatIntelligenceView;