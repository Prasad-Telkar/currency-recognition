import { useTranslation } from "react-i18next";
import { Volume2, VolumeX, Newspaper, Info, Globe as GlobeIcon } from "lucide-react";
import ConfidenceGuidance from "./ConfidenceGuidance";
import ConverterCard from "./ConverterCard";

export default function ResultCard({ result, voice, lang, conversion, onOpenFullConverter, onOpenNews }) {
  const { t } = useTranslation();
  if (!result) return null;

  const { country, currencyCode, currencyName, currencySymbol, denomination, confidence, confidenceLevel, imageAnalysis } = result;

  const speakText = `This is a ${denomination} ${currencyName || country} note. Recognition confidence is ${confidence} percent.`;

  return (
    <section className="result-section glass-panel" style={{ padding: "24px", marginTop: "20px" }}>
      <div className="result-header">
        <div>
          <span className="result-label">{t("result.aiResult")}</span>
          <h2>{t("result.identified")}</h2>
        </div>

        <div className="confidence-badge">
          {confidence}%
          <span>{t("result.confidence")}</span>
        </div>
      </div>

      <div className="result-grid">
        <div className="main-result-card">
          <div className="big-currency-symbol">{currencySymbol || "?"}</div>

          <div>
            <span>{t("result.detected")}</span>
            <h3>{currencySymbol}{denomination}</h3>
            <p>{currencyName || country}</p>
            <div className="country-tag">
              <GlobeIcon size={12} /> {country}
            </div>
          </div>
        </div>

        <div className="confidence-card">
          <span>{t("result.modelConfidence")}</span>
          <div className="confidence-number">{confidence}%</div>
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${Math.min(confidence, 100)}%` }} />
          </div>
          {confidenceLevel && <div className="confidence-level-tag">{confidenceLevel}</div>}
          <p>{t("result.confidenceNote")}</p>
        </div>
      </div>

      {imageAnalysis && (
        <div className="quality-strip">
          <div>
            <span>Quality score</span>
            <strong>{imageAnalysis.quality_score}/100</strong>
          </div>
          <div>
            <span>Blur</span>
            <strong>{imageAnalysis.blur_detected ? "Detected" : "None"}</strong>
          </div>
          <div>
            <span>Lighting</span>
            <strong>{imageAnalysis.lighting_quality}</strong>
          </div>
        </div>
      )}

      <ConfidenceGuidance level={confidenceLevel} />

      <ConverterCard
        result={result}
        conversion={conversion}
        onOpenFullConverter={onOpenFullConverter}
      />

      <div className="feature-actions">
        <button onClick={() => (voice.speaking ? voice.stop() : voice.speak(speakText, lang))}>
          {voice.speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {voice.speaking ? t("result.stopSpeaking") : t("result.speak")}
        </button>

        <button onClick={onOpenNews}>
          <Newspaper size={16} />
          {t("result.news")}
        </button>

        <button
          onClick={() =>
            alert(`${currencyName}\n\nCurrency code: ${currencyCode}\nCountry: ${country}\nDenomination: ${denomination}`)
          }
        >
          <Info size={16} />
          {t("result.info")}
        </button>
      </div>
    </section>
  );
}
