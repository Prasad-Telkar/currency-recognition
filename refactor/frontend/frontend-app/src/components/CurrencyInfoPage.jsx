import React from 'react';
import { ArrowLeft, Globe, FileText, Info, History, ShoppingBag, AlertTriangle } from 'lucide-react';

export default function CurrencyInfoPage({ data, onBack }) {
  if (!data || !data.result) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginTop: '20px' }}>
        <h2>No currency data available</h2>
        <button onClick={onBack} className="primary-btn" style={{ marginTop: '20px' }}>Go Back</button>
      </div>
    );
  }

  const { result, imageUrl } = data;

  return (
    <div className="currency-info-page" style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '1000px', margin: '0 auto', padding: '20px 0' }}>
      <button 
        onClick={onBack} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', padding: '0', fontSize: '16px', fontWeight: 'bold' }}
      >
        <ArrowLeft size={20} /> Back to Results
      </button>
      
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
        {/* Banner/Header */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '180px', background: 'linear-gradient(135deg, var(--primary-color) 0%, #5f27cd 100%)', opacity: 0.15, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '180px', background: 'linear-gradient(to bottom, transparent, var(--bg-color))', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px', marginTop: '10px' }}>
          <h1 style={{ fontSize: '42px', marginBottom: '15px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <span style={{ color: 'var(--primary-color)', marginRight: '10px' }}>{result.currencySymbol}{result.denomination}</span>
            {result.currencyName}
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '15px', fontWeight: '500' }}>
            <Globe size={18} /> {result.country} &nbsp;|&nbsp; <strong>{result.currencyCode}</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', position: 'relative', zIndex: 1 }}>
          {/* Left Column: Image & Basic Info */}
          <div>
            {imageUrl && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <img src={imageUrl} alt="Banknote" style={{ width: '100%', borderRadius: '10px', objectFit: 'contain', maxHeight: '350px' }} />
              </div>
            )}

            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--primary-color)', fontSize: '18px' }}>
                <Info size={20} /> Essential Facts
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--muted)' }}>Currency Name</span>
                  <strong style={{ fontSize: '15px', textAlign: 'right' }}>{result.currencyName}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--muted)' }}>Country</span>
                  <strong style={{ fontSize: '15px', textAlign: 'right' }}>{result.country}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--muted)' }}>ISO Code</span>
                  <strong style={{ fontSize: '15px' }}>{result.currencyCode}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--muted)' }}>Denomination</span>
                  <strong style={{ fontSize: '15px' }}>{result.denomination}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Legal Tender</span>
                  <strong style={{ color: result.isLegalTender === false ? '#e74c3c' : '#2ecc71', fontSize: '15px', background: result.isLegalTender === false ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    {result.isLegalTender === false ? "Demonetized" : "Active"}
                  </strong>
                </li>
              </ul>
            </div>
            
            {result.isFake && (
               <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', background: 'rgba(231, 76, 60, 0.05)', border: '1px solid rgba(231, 76, 60, 0.2)', borderRadius: '12px' }}>
                 <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '600', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <AlertTriangle size={18} /> Counterfeit / Novelty Note
                 </h3>
                 <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-color)' }}>
                   {result.fakeReason}
                 </p>
               </div>
            )}
          </div>

          {/* Right Column: Detailed Explanations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '28px', background: 'rgba(255, 159, 67, 0.05)', border: '1px solid rgba(255, 159, 67, 0.1)', borderRadius: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#ff9f43', fontSize: '18px' }}>
                <History size={20} /> Detailed Historical Context
              </h3>
              <div style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text-color)', whiteSpace: 'pre-line' }}>
                {result.history || "No historical details provided for this specific denomination."}
              </div>
              {result.isLegalTender === false && result.legalTenderInfo && (
                 <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(231, 76, 60, 0.08)', borderRadius: '10px', borderLeft: '4px solid #e74c3c' }}>
                   <strong style={{ color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '15px' }}>
                     Demonetization Notice
                   </strong>
                   <span style={{ fontSize: '14px', color: 'var(--text-color)', lineHeight: '1.6' }}>{result.legalTenderInfo}</span>
                 </div>
              )}
            </div>
            
            <div className="glass-panel" style={{ padding: '28px', background: 'rgba(10, 132, 255, 0.05)', border: '1px solid rgba(10, 132, 255, 0.1)', borderRadius: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#0984e3', fontSize: '18px' }}>
                <FileText size={20} /> Visual Analysis & Evidence
              </h3>
              <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text-color)' }}>
                {result.explanation}
              </p>
            </div>

            {result.purchasingPower && (
              <div className="glass-panel" style={{ padding: '28px', background: 'rgba(190, 46, 214, 0.05)', border: '1px solid rgba(190, 46, 214, 0.1)', borderRadius: '16px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#e056fd', fontSize: '18px' }}>
                  <ShoppingBag size={20} /> Purchasing Power Shift
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '15px', color: 'var(--muted)' }}>
                  A comparison of what <strong>{result.currencySymbol}{result.denomination}</strong> could buy approximately 20 years ago versus today, using <strong>{result.purchasingPower.item_name}</strong> as a benchmark.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', borderTop: '3px solid var(--primary-color)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>~2004</div>
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{result.purchasingPower.past_comparison}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', borderTop: '3px solid #ff4757' }}>
                    <div style={{ fontSize: '12px', color: '#ff4757', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>TODAY</div>
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{result.purchasingPower.present_comparison}</div>
                  </div>
                </div>
                <div style={{ marginTop: '20px', fontSize: '14px', fontStyle: 'italic', color: 'var(--text-color)', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                  "{result.purchasingPower.summary}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
