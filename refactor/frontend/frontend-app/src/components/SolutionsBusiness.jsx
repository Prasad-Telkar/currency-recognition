import React from 'react';
import { Briefcase, Building, Store, Landmark, Monitor, Cpu } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const SolutionsBusiness = ({ setActiveTab }) => {
  return (
    <InformationalPageLayout
      title="CurrencyAI for Businesses"
      subtitle="Streamline cash handling, eliminate foreign currency errors, and empower your global workforce."
      icon={Briefcase}
      breadcrumbCurrent="Solutions for Businesses"
      setActiveTab={setActiveTab}
      customHero={
        <div className="split-hero">
          <div className="split-hero-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--primary-light)' }}>
              <Briefcase size={24} /> <span style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '14px' }}>Business Solutions</span>
            </div>
            <h1 style={{ fontSize: '42px' }}>CurrencyAI for Businesses</h1>
            <p>Empower your front-line workers in hospitality, retail, and tourism with instant, AI-driven currency identification to prevent costly manual errors.</p>
          </div>
          <div className="split-hero-visual">
             <div className="arch-diagram" style={{ padding: 0 }}>
                <div className="arch-box" style={{ padding: '12px 24px', fontSize: '14px', borderColor: 'var(--muted)' }}>
                  Customer Banknote
                </div>
                <div className="arch-arrow"></div>
                <div className="arch-box highlight" style={{ padding: '16px 24px' }}>
                  CurrencyAI Point-of-Sale App
                </div>
                <div className="arch-arrow"></div>
                <div className="arch-box" style={{ padding: '12px 24px', fontSize: '14px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--primary)', color: 'var(--primary-light)' }}>
                  Automated Recognition
                </div>
                <div className="arch-arrow"></div>
                <div className="arch-box" style={{ padding: '12px 24px', fontSize: '14px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--green)', color: 'var(--green)' }}>
                  Business Logic & Accounting
                </div>
             </div>
          </div>
        </div>
      }
    >
      <div className="info-section">
        <h2>Enterprise Use Cases</h2>
        <div className="info-grid">
          
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Store size={24} /></div>
              <h3>Retail & Point of Sale</h3>
            </div>
            <p>Allow cashiers in tourist-heavy locations to accept and identify foreign currency without needing to manually memorize exchange rates or note designs.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Building size={24} /></div>
              <h3>Hospitality</h3>
            </div>
            <p>Hotels and resorts can process tips and payments seamlessly. Prevent accidental acceptance of out-of-circulation or incorrect denomination notes.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Landmark size={24} /></div>
              <h3>Tourism & Exchange</h3>
            </div>
            <p>Accelerate currency exchange booths by providing tellers with a secondary, AI-backed validation tool to speed up manual counting flows.</p>
          </div>
          
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Monitor size={24} /></div>
              <h3>Cash Handling Desks</h3>
            </div>
            <p>Provide a software-based audit trail. When cash is recognized, log the recognition timestamp and value directly into your tracking software.</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-mockup">
          <Cpu size={48} style={{ color: 'var(--primary-light)' }} />
          <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Developer API Integration</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--muted)', fontSize: '16px' }}>
            We are building a robust REST API allowing enterprise customers to directly embed our recognition engine into existing proprietary Point-of-Sale or mobile workforce applications.
          </p>
          <div style={{ marginTop: '12px' }}>
            <span className="badge-soon" style={{ marginLeft: 0, padding: '8px 16px', fontSize: '13px' }}>Enterprise API Coming Soon</span>
          </div>
        </div>
      </div>
    </InformationalPageLayout>
  );
};

export default SolutionsBusiness;
