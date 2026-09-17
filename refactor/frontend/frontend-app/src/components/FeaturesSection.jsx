import { useTranslation } from "react-i18next";
import { Zap, Sparkles, ArrowLeftRight, Volume2, History as HistoryIcon, Camera, Globe as GlobeIcon } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "AI Recognition", text: "Identify the country and denomination using the trained deep-learning model." },
  { icon: ArrowLeftRight, title: "Live Conversion", text: "Convert detected currency into different currencies using live exchange rates." },
  { icon: Volume2, title: "Voice Assistance", text: "Hear the detected currency and confidence result using browser speech synthesis." },
  { icon: HistoryIcon, title: "Recognition History", text: "Keep track of recently recognized banknotes during the current session." },
  { icon: Camera, title: "Camera Recognition", text: "Capture a banknote directly from a mobile device camera." },
  { icon: GlobeIcon, title: "Multi-Currency", text: "Designed to recognize multiple currencies from different countries." },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="features-section">
      <div className="section-heading center">
        <span><Zap size={20} /></span>
        <div>
          <h2>{t("features.title")}</h2>
          <p>{t("features.subtitle")}</p>
        </div>
      </div>

      <div className="features-grid">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div className="feature-card" key={title}>
            <div><Icon size={19} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
