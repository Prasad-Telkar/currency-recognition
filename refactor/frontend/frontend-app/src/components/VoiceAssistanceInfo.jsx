import React from 'react';
import { Volume2, Mic, Settings } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

export default function VoiceAssistanceInfo({ setActiveTab }) {
  return (
    <InformationalPageLayout
      title="Voice Assistance"
      subtitle="Hear your currency recognition results out loud using advanced browser speech synthesis."
      icon={Volume2}
      breadcrumbCurrent="Voice Assistance"
      setActiveTab={setActiveTab}
    >
      <div className="info-card">
        <h3>How it Works</h3>
        <p>CurrencyAI leverages the Web Speech API to provide immediate audio feedback for your scanned notes. Once a currency is identified, you can click the "Speak Result" button to hear the detected denomination, currency name, and confidence score.</p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-icon"><Mic size={24} /></div>
          <h4>Multilingual Support</h4>
          <p>The voice assistant automatically adjusts its accent and pronunciation based on your selected application language.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon"><Settings size={24} /></div>
          <h4>Accessibility First</h4>
          <p>Designed for visually impaired users and quick on-the-go verification without needing to read the screen.</p>
        </div>
      </div>
    </InformationalPageLayout>
  );
}
