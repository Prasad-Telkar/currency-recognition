import { useTranslation } from "react-i18next";
import {
  Volume2,
  VolumeX,
  Newspaper,
  Info,
  Globe as GlobeIcon,
  AlertTriangle,
  ShoppingBag,
  History,
  TrendingDown,
  Landmark
} from "lucide-react";
import ConfidenceGuidance from "./ConfidenceGuidance";
import ConverterCard from "./ConverterCard";

export default function ResultCard({ result, voice, lang, conversion, onOpenFullConverter, onOpenNews }) {
  const { t } = useTranslation();

  if (!result) return null;

  const {
    country,
    currencyCode,
    currencyName,
    currencySymbol,
    denomination,
    confidence,
    confidenceLevel,
    imageAnalysis,
    counterfeitAnalysis,
    purchasingPower,
    history,
  } = result;

  // ============================================================
  // AUTHENTICITY ASSESSMENT LOGIC
  // Genuine: verdict is GENUINE, low risk, and authenticity score >= 80
  // Fake: SUSPICIOUS, LIKELY_COUNTERFEIT, COUNTERFEIT, or low authenticity
  // ============================================================
  const counterfeit = counterfeitAnalysis;
  const rawVerdict = (counterfeit?.verdict || "GENUINE").toUpperCase();
  const rawRisk = (counterfeit?.counterfeit_risk || "LOW").toUpperCase();
  const authScore = typeof counterfeit?.authenticity_score === "number" ? Math.round(counterfeit.authenticity_score) : 100;

  const isExplicitFake =
    counterfeit?.is_counterfeit === true ||
    counterfeit?.is_genuine === false ||
    rawVerdict === "SUSPICIOUS" ||
    rawVerdict === "LIKELY_COUNTERFEIT" ||
    rawVerdict === "COUNTERFEIT" ||
    rawRisk === "HIGH" ||
    rawRisk === "MEDIUM" ||
    authScore < 75;

  const isGenuine = !counterfeit || (
    !isExplicitFake &&
    rawVerdict === "GENUINE" &&
    rawRisk === "LOW" &&
    authScore >= 80
  );

  // ============================================================
  // TEXT-TO-SPEECH (SPEECH SYNTHESIS)
  // Genuine notes: speaks country, denomination, and currency name (no confidence score)
  // Fake notes: speaks "This is a fake note."
  // ============================================================
  const genuineSpeech = `This is a ${denomination} ${currencyName || 'currency'} note from ${country}.`;
  const fakeSpeech = "This is a fake note.";

  // Format note value safely
  const displayValue = denomination
    ? (currencySymbol && !String(denomination).includes(currencySymbol) ? `${currencySymbol}${denomination}` : denomination)
    : (currencySymbol || "Unknown");

  // ============================================================
  // FAKE NOTE VIEW: SHOW ONLY FAKE, VALUE OF NOTE, AND SPEAK RESULTS
  // ============================================================
  if (!isGenuine) {
    return (
      <section
        className="result-section glass-panel has-counterfeit-alert"
        style={{
          padding: "36px 24px",
          marginTop: "20px",
          textAlign: "center"
        }}
      >
        {/* 1. FAKE indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#ef4444",
            color: "#ffffff",
            padding: "8px 24px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "20px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)"
          }}
        >
          <AlertTriangle size={22} />
          FAKE
        </div>

        {/* 2. Value of the note */}
        <div style={{ marginTop: "24px", marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "var(--muted)",
              fontWeight: "600",
              marginBottom: "8px"
            }}
          >
            Value of Note
          </div>
          <div
            style={{
              fontSize: "52px",
              fontWeight: "800",
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.1
            }}
          >
            {displayValue}
          </div>
        </div>

        {/* 3. Speak Results button with dark border */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => (voice.speaking ? voice.stop() : voice.speak(fakeSpeech, lang))}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 28px",
              border: "2px solid #000000",
              borderRadius: "9px",
              background: "rgba(0, 0, 0, 0.05)",
              color: "var(--text)",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.25)",
              transition: "all 0.2s ease"
            }}
          >
            {voice.speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            {voice.speaking ? t("result.stopSpeaking") : t("result.speak")}
          </button>
        </div>
      </section>
    );
  }

  // ============================================================
  // GENUINE NOTE VIEW: RICH ANALYSIS, CONVERTER, PURCHASING POWER, HISTORY
  // ============================================================
  return (
    <section className="result-section glass-panel" style={{ padding: "24px", marginTop: "20px" }}>
      <div className="result-header">
        <div>
          <span className="result-label">
            {t("result.aiResult")}
          </span>
          <h2>
            {t("result.identified")}
          </h2>
        </div>

        <div className="confidence-badge">
          {confidence}%
          <span>{t("result.confidence")}</span>
        </div>
      </div>

      <div className="result-grid">
        <div className="main-result-card">
          <div className="big-currency-symbol">
            {currencySymbol || "?"}
          </div>

          <div>
            <span>{t("result.detected")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "2px" }}>
              <h3 style={{ margin: 0 }}>{currencySymbol}{denomination}</h3>
            </div>
            <p>{currencyName || country}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
              <div className="country-tag">
                <GlobeIcon size={12} /> {country}
              </div>
            </div>
          </div>
        </div>

        <div className="confidence-card">
          <span>{t("result.modelConfidence")}</span>
          <div className="confidence-number">
            {confidence}%
          </div>
          <div className="progress-bar">
            <div
              className="progress-value"
              style={{ width: `${Math.min(confidence, 100)}%` }}
            />
          </div>
          <div className="confidence-level-tag">
            {confidenceLevel}
          </div>
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

      {/* Top Actions Bar: Speak Results, Finance News, Currency Info with dark borders */}
      <div className="feature-actions" style={{ marginTop: "20px", marginBottom: "16px" }}>
        <button
          onClick={() => (voice.speaking ? voice.stop() : voice.speak(genuineSpeech, lang))}
          style={{ border: "2px solid #000000" }}
        >
          {voice.speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {voice.speaking ? t("result.stopSpeaking") : t("result.speak")}
        </button>

        <button onClick={onOpenNews} style={{ border: "2px solid #000000" }}>
          <Newspaper size={16} />
          {t("result.news")}
        </button>

        <button
          onClick={() =>
            alert(`${currencyName}\n\nCurrency code: ${currencyCode}\nCountry: ${country}\nDenomination: ${denomination}`)
          }
          style={{ border: "2px solid #000000" }}
        >
          <Info size={16} />
          {t("result.info")}
        </button>
      </div>

      {/* Purchasing Power Comparison */}
      {purchasingPower && (
        <div className="purchasing-power-card glass-panel" id="purchasing-power-section">
          <div className="pp-header">
            <div className="pp-icon-badge">
              <ShoppingBag size={20} />
            </div>
            <div>
              <div className="pp-badge-row">
                <span className="pp-badge">Purchasing Power</span>
                {purchasingPower.item_name && (
                  <span className="pp-item-tag">Everyday Item: {purchasingPower.item_name}</span>
                )}
              </div>
              <h3 className="pp-title">20 Years Ago vs Today</h3>
            </div>
          </div>

          <div className="pp-comparison-grid">
            <div className="pp-col pp-past">
              <div className="pp-era-tag">
                <History size={13} /> ~20 Years Ago
              </div>
              <p className="pp-era-desc">{purchasingPower.past_comparison || "Could purchase significantly more everyday goods."}</p>
            </div>

            <div className="pp-vs-divider">
              <span>vs</span>
            </div>

            <div className="pp-col pp-present">
              <div className="pp-era-tag">
                <TrendingDown size={13} /> Today
              </div>
              <p className="pp-era-desc">{purchasingPower.present_comparison || "Buys fewer items due to cumulative inflation."}</p>
            </div>
          </div>

          {purchasingPower.summary && (
            <div className="pp-summary-box">
              <p>{purchasingPower.summary}</p>
            </div>
          )}
        </div>
      )}

      {/* Short Currency History & Background */}
      {history && (
        <div className="currency-history-card glass-panel" id="currency-history-section">
          <div className="ch-header">
            <div className="ch-icon-badge">
              <Landmark size={20} />
            </div>
            <div>
              <span className="ch-badge">Banknote Background</span>
              <h3 className="ch-title">Currency & Denomination History</h3>
            </div>
          </div>
          <p className="ch-text">{history}</p>
        </div>
      )}
    </section>
  );
}
