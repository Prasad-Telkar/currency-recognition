import { useTranslation } from "react-i18next";
import { Upload, Camera } from "lucide-react";
import Globe from "./Globe";

export default function Hero({ fileInputRef, cameraInputRef }) {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="status-pill">
          <span className="status-dot"></span>
          {t("hero.badge")}
        </div>

        <h1>
          {t("hero.titleLine1")}
          <br />
          <span>{t("hero.titleLine2")}</span>
        </h1>

        <p>{t("hero.subtitle")}</p>

        <div className="hero-stats">
          <div><strong>10+</strong><span>{t("hero.statCurrencies")}</span></div>
          <div><strong>AI</strong><span>{t("hero.statAI")}</span></div>
          <div><strong>Live</strong><span>{t("hero.statLive")}</span></div>
        </div>
      </div>

      <div className="globe-section">
        <Globe />
      </div>
    </section>
  );
}
