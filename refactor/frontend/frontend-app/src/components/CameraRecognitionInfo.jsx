import React from 'react';
import { Camera, Smartphone, Zap } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

export default function CameraRecognitionInfo({ setActiveTab }) {
  return (
    <InformationalPageLayout
      title="Camera Recognition"
      subtitle="Scan banknotes in real-time using your device's camera."
      icon={Camera}
      breadcrumbCurrent="Camera Recognition"
      setActiveTab={setActiveTab}
    >
      <div className="info-card">
        <h3>Capture & Analyze Instantly</h3>
        <p>You don't need to save photos to your gallery. CurrencyAI allows you to activate your device's camera directly from the web browser to capture and analyze notes in real-time.</p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-icon"><Smartphone size={24} /></div>
          <h4>Mobile Optimized</h4>
          <p>On mobile devices, CurrencyAI automatically selects the rear-facing environment camera for the best focus and clarity.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon"><Zap size={24} /></div>
          <h4>Fast Processing</h4>
          <p>Captured images are compressed and optimized locally before being securely sent to our AI engine, ensuring lightning-fast results even on cellular data.</p>
        </div>
      </div>
    </InformationalPageLayout>
  );
}
