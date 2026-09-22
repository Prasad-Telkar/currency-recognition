import React from 'react';
import { Globe, DollarSign, Camera, Check, X, Shield, ArrowRight } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const CurrencyGuide = ({ setActiveTab }) => {
  return (
    <InformationalPageLayout
      title="Understand Every Currency"
      subtitle="CurrencyAI helps you identify and understand currencies from around the world instantly."
      icon={Globe}
      breadcrumbCurrent="Currency Guide"
      setActiveTab={setActiveTab}
      customHero={
        <div className="split-hero">
          <div className="split-hero-text">
            <h1>Understand Every Currency</h1>
            <p>CurrencyAI uses advanced computer vision to help you identify, value, and understand banknotes from around the world instantly.</p>
          </div>
          <div className="split-hero-visual">
             <div className="arch-diagram" style={{ padding: 0 }}>
                <div className="arch-box" style={{ padding: '12px 24px', fontSize: '14px' }}>
                  Multiple Currencies ($, €, ¥, ₹)
                </div>
                <div className="arch-arrow"></div>
                <div className="arch-box highlight" style={{ padding: '16px 24px' }}>
                  CurrencyAI Vision Engine
                </div>
                <div className="arch-arrow"></div>
                <div className="arch-box" style={{ padding: '12px 24px', fontSize: '14px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--green)', color: 'var(--green)' }}>
                  INR ₹500 • High Confidence
                </div>
             </div>
          </div>
        </div>
      }
    >
      <div className="info-section">
        <h2>Supported Currencies</h2>
        <p>We are continuously expanding our dataset. Currently, CurrencyAI recognizes the following major global currencies with high accuracy.</p>
        
        <div className="currency-grid">
          <div className="curr-card">
            <div className="curr-flag">🇺🇸</div>
            <div className="curr-details">
              <h4>US Dollar</h4>
              <p>USD • $</p>
            </div>
          </div>
          <div className="curr-card">
            <div className="curr-flag">🇪🇺</div>
            <div className="curr-details">
              <h4>Euro</h4>
              <p>EUR • €</p>
            </div>
          </div>
          <div className="curr-card">
            <div className="curr-flag">🇬🇧</div>
            <div className="curr-details">
              <h4>British Pound</h4>
              <p>GBP • £</p>
            </div>
          </div>
          <div className="curr-card">
            <div className="curr-flag">🇮🇳</div>
            <div className="curr-details">
              <h4>Indian Rupee</h4>
              <p>INR • ₹</p>
            </div>
          </div>
          <div className="curr-card">
            <div className="curr-flag">🇯🇵</div>
            <div className="curr-details">
              <h4>Japanese Yen</h4>
              <p>JPY • ¥</p>
            </div>
          </div>
          <div className="curr-card">
            <div className="curr-flag">🇦🇺</div>
            <div className="curr-details">
              <h4>Aus Dollar</h4>
              <p>AUD • $</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>How CurrencyAI Works</h2>
        <div className="flow-diagram">
          <div className="flow-node">
            <Camera size={32} className="workflow-step-icon" />
            <strong>1. Capture</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>Upload or scan a banknote</span>
          </div>
          <ArrowRight className="flow-arrow" />
          <div className="flow-node">
            <Shield size={32} className="workflow-step-icon" />
            <strong>2. Process</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>Image normalized & cleaned</span>
          </div>
          <ArrowRight className="flow-arrow" />
          <div className="flow-node">
            <Globe size={32} className="workflow-step-icon" />
            <strong>3. Recognize</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>AI identifies unique features</span>
          </div>
          <ArrowRight className="flow-arrow" />
          <div className="flow-node" style={{ borderColor: 'var(--green)' }}>
            <DollarSign size={32} style={{ color: 'var(--green)' }} />
            <strong style={{ color: 'var(--green)' }}>4. Result</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>Currency & denomination</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Recognition Tips</h2>
        <p>For the fastest and most accurate results, ensure your image meets our quality guidelines.</p>
        
        <div className="comparison-layout">
          <div className="comp-card comp-good">
            <div className="comp-header"><Check size={20} /> GOOD IMAGE</div>
            <div className="comp-visual good-visual">
              <div className="comp-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                ₹500
              </div>
            </div>
            <div className="comp-desc">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', gap: '8px' }}><Check size={16} style={{ color: 'var(--green)', flexShrink: 0 }} /> <span>Well lit and clearly visible</span></li>
                <li style={{ display: 'flex', gap: '8px' }}><Check size={16} style={{ color: 'var(--green)', flexShrink: 0 }} /> <span>Entire banknote in frame</span></li>
                <li style={{ display: 'flex', gap: '8px' }}><Check size={16} style={{ color: 'var(--green)', flexShrink: 0 }} /> <span>Minimal blur or motion</span></li>
              </ul>
            </div>
          </div>
          <div className="comp-card comp-poor">
            <div className="comp-header"><X size={20} /> POOR IMAGE</div>
            <div className="comp-visual poor-visual">
              <div className="comp-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                ?
              </div>
            </div>
            <div className="comp-desc">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', gap: '8px' }}><X size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} /> <span>Too dark or heavy glare</span></li>
                <li style={{ display: 'flex', gap: '8px' }}><X size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} /> <span>Note is cropped or folded heavily</span></li>
                <li style={{ display: 'flex', gap: '8px' }}><X size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} /> <span>Blurry from motion</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </InformationalPageLayout>
  );
};

export default CurrencyGuide;
