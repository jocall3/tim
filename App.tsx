import React from 'react';
import ThreatIntelligenceView from './components/ThreatIntelligenceView';
import { ThreatIntelligenceProvider } from './context/ThreatContext';

const App: React.FC = () => {
  return (
    <ThreatIntelligenceProvider>
      <ThreatIntelligenceView />
    </ThreatIntelligenceProvider>
  );
};

export default App;