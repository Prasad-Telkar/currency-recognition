import { useTranslation } from "react-i18next";
import { Volume2, VolumeX, Newspaper, Info, Globe as GlobeIcon, ShoppingBag, Landmark, AlertTriangle } from "lucide-react";
import ConfidenceGuidance from "./ConfidenceGuidance";
import ConverterCard from "./ConverterCard";

export default function ResultCard({ result, voice, lang, conversion, onOpenFullConverter, onOpenNews }) {
  const { t } = useTranslation();
  if (!result) return null;

  const { country, currencyCode, currencyName, currencySymbol, denomination, confidence, confidenceLevel, imageAnalysis, purchasingPower, history, isCurrency, explanation, isFake, fakeReason, isLegalTender, legalTenderInfo } = result;

  if (isCurrency === false) {
    return (
      <section className="result-section glass-panel" style={{ padding: "24px", marginTop: "20px", border: "1px solid #ff4757" }}>
        <div className="result-header" style={{ marginBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 71, 87, 0.1)', padding: '10px', borderRadius: '50%', color: '#ff4757', display: 'flex' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <span className="result-label" style={{ color: "#ff4757", fontWeight: "bold" }}>Detection Alert</span>
              <h2 style={{ color: "#ff4757" }}>Not Genuine Currency</h2>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', background: 'rgba(255, 71, 87, 0.05)', border: '1px solid rgba(255, 71, 87, 0.2)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '600', color: '#ff4757' }}>Explanation</h3>
          <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-color)' }}>
            {explanation || "The uploaded image does not appear to be a genuine, recognized currency."}
          </p>
        </div>
      </section>
    );
  }

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
            {isFake && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e74c3c', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', marginRight: '8px' }}>
                <AlertTriangle size={14} /> FAKE
              </div>
            )}
            {isLegalTender === false && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f39c12', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                <AlertTriangle size={14} /> DEMONETIZED / BANNED
              </div>
            )}
            <br/>
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

      {isFake && fakeReason && (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', background: 'rgba(231, 76, 60, 0.05)', border: '1px solid rgba(231, 76, 60, 0.2)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '600', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Counterfeit / Novelty Reason
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-color)' }}>
            {fakeReason}
          </p>
        </div>
      )}

      {isLegalTender === false && legalTenderInfo && (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', background: 'rgba(243, 156, 18, 0.05)', border: '1px solid rgba(243, 156, 18, 0.2)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '600', color: '#f39c12', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Demonetized / Not Legal Tender
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-color)' }}>
            {legalTenderInfo}
          </p>
        </div>
      )}

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

      {purchasingPower && isLegalTender !== false && (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{ background: 'rgba(190, 46, 214, 0.2)', padding: '6px', borderRadius: '8px', color: '#e056fd' }}>
              <ShoppingBag size={16} />
            </div>
            <span style={{ background: '#5f27cd', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', letterSpacing: '1px', fontWeight: 'bold' }}>PURCHASING POWER</span>
            <span style={{ color: 'var(--primary-color)', fontSize: '12px', background: 'rgba(10, 132, 255, 0.15)', padding: '2px 8px', borderRadius: '10px' }}>{purchasingPower.item_name || "Everyday Items"}</span>
          </div>
          <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>20 Years Ago vs Today</h3>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--primary-color)', borderRadius: '50%' }}></div>
                &lt; 20 YEARS AGO
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--muted)' }}>{purchasingPower.past_comparison}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--muted)' }}>VS</div>
            </div>
            
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid #ff4757' }}>
              <div style={{ fontSize: '12px', color: '#ff4757', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', background: '#ff4757', borderRadius: '50%' }}></div>
                TODAY
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--muted)' }}>{purchasingPower.present_comparison}</p>
            </div>
          </div>
          
          <p style={{ marginTop: '15px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>
            {purchasingPower.summary}
          </p>
        </div>
      )}

      {history && (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{ background: 'rgba(10, 132, 255, 0.2)', padding: '6px', borderRadius: '8px', color: 'var(--primary-color)' }}>
              <Landmark size={16} />
            </div>
            <span style={{ background: '#0984e3', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', letterSpacing: '1px', fontWeight: 'bold' }}>BANKNOTE BACKGROUND</span>
          </div>
          <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Currency &amp; Denomination History</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--muted)' }}>
            {history}
          </p>
        </div>
      )}
    </section>
  );
}
