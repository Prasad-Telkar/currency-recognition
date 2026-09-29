import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const ApiDocs = ({ setActiveTab }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <InformationalPageLayout
      title="Build with CurrencyAI"
      subtitle="Integrate world-class currency recognition into your own applications with our powerful developer API."
      icon={Terminal}
      breadcrumbCurrent="API Documentation"
      setActiveTab={setActiveTab}
      customHero={
        <div className="split-hero">
          <div className="split-hero-text">
            <h1>Build with CurrencyAI</h1>
            <p>Integrate our computer vision engine directly into your retail, hospitality, or fintech apps.</p>
          </div>
          <div className="split-hero-visual">
            <div className="info-code-block" style={{ width: '100%', maxWidth: '380px' }}>
              <div className="code-header">
                <span>POST /api/v1/recognize</span>
                <span className="badge-soon">Coming Soon</span>
              </div>
              <pre style={{ margin: 0, color: 'var(--primary-light)' }}>
{`{
  "status": "success",
  "data": {
    "currency": "USD",
    "denomination": 100,
    "confidence": 0.98
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      }
    >
      <div className="info-section">
        <h2>Architecture overview</h2>
        <div className="arch-diagram">
          <div className="arch-box">Your Application</div>
          <div className="arch-arrow"></div>
          <div className="arch-box highlight">CurrencyAI REST API <span className="badge-soon">Coming Soon</span></div>
          <div className="arch-arrow"></div>
          <div className="arch-box" style={{ borderColor: 'var(--violet)' }}>AI Recognition Engine</div>
          <div className="arch-arrow"></div>
          <div className="arch-box" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>JSON Response (Currency + Denomination)</div>
          <div className="arch-arrow"></div>
          <div className="arch-box">Your Application</div>
        </div>
      </div>

      <div className="info-section">
        <h2>Endpoint Reference <span className="badge-soon">Coming Soon</span></h2>
        <p>When public API access becomes available, you will be able to submit base64-encoded images to our recognition endpoint.</p>
        
        <div className="info-code-block">
          <div className="code-header">
            <span>Example Request (cURL)</span>
            <button 
              onClick={handleCopy}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{ margin: 0 }}>
{`curl -X POST https://api.currencyai.com/v1/recognize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "base64_encoded_string_here..."
  }'`}
          </pre>
        </div>
      </div>
      
      <div className="info-section">
        <h2>Error Handling</h2>
        <p>The API will use standard HTTP status codes to indicate success or failure.</p>
        <div className="info-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="info-card" style={{ padding: '16px' }}>
            <h4 style={{ color: 'var(--green)', marginBottom: '8px' }}>200 OK</h4>
            <p style={{ fontSize: '13px' }}>Recognition successful.</p>
          </div>
          <div className="info-card" style={{ padding: '16px' }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>400 Bad Request</h4>
            <p style={{ fontSize: '13px' }}>Invalid image format or payload.</p>
          </div>
          <div className="info-card" style={{ padding: '16px' }}>
            <h4 style={{ color: 'var(--danger)', marginBottom: '8px' }}>401 Unauthorized</h4>
            <p style={{ fontSize: '13px' }}>Missing or invalid API key.</p>
          </div>
          <div className="info-card" style={{ padding: '16px' }}>
            <h4 style={{ color: 'var(--danger)', marginBottom: '8px' }}>422 Unprocessable</h4>
            <p style={{ fontSize: '13px' }}>No currency detected in image.</p>
          </div>
        </div>
      </div>
    </InformationalPageLayout>
  );
};

export default ApiDocs;
