import React from 'react';
import { useTranslation } from "react-i18next";
import { ScanFace, Globe as GlobeIcon, Search, ShieldCheck, Zap, LineChart } from "lucide-react";

export default function AICapabilities() {
  const { t } = useTranslation();

  const capabilities = [
    {
      icon: ScanFace,
      title: "Banknote Identification",
      description: "Instantly recognizes standard circulating banknotes from supported countries using advanced visual pattern matching."
    },
    {
      icon: GlobeIcon,
      title: "Country Recognition",
      description: "Automatically maps the detected currency to its country of origin, ensuring geopolitical accuracy."
    },
    {
      icon: Search,
      title: "Denomination Detection",
      description: "Precisely extracts the numerical value of the note, even under varying lighting conditions."
    },
    {
      icon: ShieldCheck,
      title: "Confidence Analysis",
      description: "Provides a probabilistic confidence score, giving you transparency into the AI's decision-making process."
    },
    {
      icon: Zap,
      title: "Image Quality Processing",
      description: "Detects blur and lighting issues before analysis to ensure maximum recognition accuracy."
    },
    {
      icon: LineChart,
      title: "Live Currency Conversion",
      description: "Seamlessly converts the recognized amount into your target currency using real-time exchange rates."
    }
  ];

  return (
    <div className="ai-capabilities-section fade-in">
      <div className="ai-cap-header">
        <h2>What CurrencyAI Can Do</h2>
        <p>Explore the computer vision and machine learning technologies powering our system.</p>
      </div>

      <div className="workflow-diagram">
        <div className="flow-step">
          <div className="step-circle">1</div>
          <span>Upload Image</span>
        </div>
        <div className="flow-line" />
        <div className="flow-step">
          <div className="step-circle">2</div>
          <span>Image Processing</span>
        </div>
        <div className="flow-line" />
        <div className="flow-step">
          <div className="step-circle">3</div>
          <span>AI Recognition</span>
        </div>
        <div className="flow-line" />
        <div className="flow-step">
          <div className="step-circle">4</div>
          <span>Results & OCR</span>
        </div>
      </div>

      <div className="capabilities-grid">
        {capabilities.map((cap, i) => (
          <div className="cap-card glass-panel" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="cap-icon-wrapper">
              <cap.icon size={28} className="cap-icon" />
            </div>
            <h3>{cap.title}</h3>
            <p>{cap.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
