import React, { useState } from 'react';
import { GraduationCap, MapPin, Target, Lightbulb, LineChart, Brain } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const SolutionsEducation = ({ setActiveTab }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <InformationalPageLayout
      title="CurrencyAI for Education"
      subtitle="Engage students with interactive tools to learn about global economics, geography, and computer vision."
      icon={GraduationCap}
      breadcrumbCurrent="Solutions for Education"
      setActiveTab={setActiveTab}
      customHero={
        <div className="split-hero">
          <div className="split-hero-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--primary-light)' }}>
              <GraduationCap size={24} /> <span style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '14px' }}>Education Solutions</span>
            </div>
            <h1 style={{ fontSize: '42px' }}>CurrencyAI for Education</h1>
            <p>Transform how students learn about world geography, financial literacy, and modern artificial intelligence through interactive, hands-on currency identification.</p>
          </div>
          <div className="split-hero-visual">
             <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', position: 'relative' }}>
               <div style={{ width: '280px', height: '160px', background: 'radial-gradient(circle, #333 0%, #111 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                 <div style={{ width: '120px', height: '60px', background: '#3b82f6', borderRadius: '4px', opacity: 0.8 }}></div>
               </div>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>🤖</div>
                 <div>
                   <div style={{ fontWeight: 600, fontSize: '14px' }}>AI Match Found</div>
                   <div style={{ color: 'var(--muted)', fontSize: '12px' }}>Euro (EUR) - €20</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      }
    >
      
      <div className="info-section">
        <h2>Interactive Learning</h2>
        <p>Try this example of an interactive classroom exercise.</p>
        
        <div className="quiz-container">
          <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Can you identify this currency?</h3>
          <div style={{ width: '200px', height: '100px', background: 'linear-gradient(45deg, #10b981, #059669)', margin: '0 auto', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '48px', fontWeight: 'bold' }}>
            $
          </div>
          
          <div className={`quiz-card ${revealed ? 'revealed' : ''}`}>
            <div className="quiz-prompt">
              <div className="quiz-options">
                <button className={`quiz-btn ${revealed ? 'incorrect' : ''}`} onClick={() => setRevealed(true)}>US Dollar (USD)</button>
                <button className={`quiz-btn ${revealed ? 'correct' : ''}`} onClick={() => setRevealed(true)}>Australian Dollar (AUD)</button>
                <button className={`quiz-btn ${revealed ? 'incorrect' : ''}`} onClick={() => setRevealed(true)}>Canadian Dollar (CAD)</button>
              </div>
            </div>
            
            <div className="quiz-answer">
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅ Correct! (It's Australian)</div>
              <p style={{ color: 'var(--text)', fontWeight: 'normal', margin: 0 }}>Polymer banknotes and specific serial number fonts are unique features the AI uses to distinguish between countries that share the $ symbol.</p>
              <button onClick={() => setRevealed(false)} style={{ marginTop: '16px', padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px' }}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Classroom Applications</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><MapPin size={24} /></div>
              <h3>World Geography</h3>
            </div>
            <p>Connect physical currency designs to their countries of origin, exploring historical figures and landmarks featured on international banknotes.</p>
          </div>
          
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><LineChart size={24} /></div>
              <h3>Financial Literacy</h3>
            </div>
            <p>Teach students about foreign exchange rates, purchasing power parity, and how global markets interact through live currency conversion.</p>
          </div>
          
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Brain size={24} /></div>
              <h3>AI & Computer Vision</h3>
            </div>
            <p>Use CurrencyAI as a practical demonstration of how machine learning models process visual data, extract features, and determine confidence scores.</p>
          </div>
        </div>
      </div>
    </InformationalPageLayout>
  );
};

export default SolutionsEducation;
