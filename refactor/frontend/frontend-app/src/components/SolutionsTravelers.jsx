import React from 'react';
import { Plane, ShoppingBag, Utensils, Train, Map, ArrowRight, Camera, Book, RefreshCcw } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const SolutionsTravelers = ({ setActiveTab }) => {
  return (
    <InformationalPageLayout
      title="CurrencyAI for Travelers"
      subtitle="Navigate foreign countries with confidence. Never get confused by unfamiliar banknotes again."
      icon={Plane}
      breadcrumbCurrent="Solutions for Travelers"
      setActiveTab={setActiveTab}
      customHero={
        <div className="split-hero">
          <div className="split-hero-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--primary-light)' }}>
              <Plane size={24} /> <span style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '14px' }}>Travel Solutions</span>
            </div>
            <h1 style={{ fontSize: '42px' }}>CurrencyAI for Travelers</h1>
            <p>Navigate foreign countries with confidence. Point your camera at any unfamiliar banknote to instantly understand its value in your home currency.</p>
          </div>
          <div className="split-hero-visual">
            <div className="device-mockup">
              <div className="mockup-screen">
                <div className="mockup-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>
                <div className="mockup-body" style={{ background: 'url("data:image/svg+xml;utf8,<svg opacity=\'0.05\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'50\' cy=\'50\' r=\'40\' stroke=\'white\' stroke-width=\'2\' fill=\'none\'/></svg>")', backgroundSize: 'cover' }}>
                   <div style={{ height: '50%', border: '2px dashed var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     [ Camera View ]
                   </div>
                   <div className="mockup-card" style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--green)' }}>
                     <strong style={{ color: 'var(--green)', fontSize: '20px', display: 'block' }}>¥1,000 JPY</strong>
                     <span style={{ color: 'var(--muted)', fontSize: '12px' }}>≈ $6.70 USD</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="info-section">
        <h2>The Traveler's Workflow</h2>
        <div className="flow-diagram">
          <div className="flow-node">
            <Camera size={32} className="workflow-step-icon" />
            <strong>SCAN</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>Point at cash</span>
          </div>
          <ArrowRight className="flow-arrow" />
          <div className="flow-node">
            <div style={{ fontSize: '32px' }}>🤖</div>
            <strong>RECOGNIZE</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>AI identifies note</span>
          </div>
          <ArrowRight className="flow-arrow" />
          <div className="flow-node">
            <Book size={32} className="workflow-step-icon" />
            <strong>UNDERSTAND</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>See denomination</span>
          </div>
          <ArrowRight className="flow-arrow" />
          <div className="flow-node" style={{ borderColor: 'var(--green)' }}>
            <RefreshCcw size={32} style={{ color: 'var(--green)' }} />
            <strong style={{ color: 'var(--green)' }}>CONVERT</strong>
            <span style={{fontSize: '13px', color: 'var(--muted)'}}>Live exchange rate</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Common Use Cases</h2>
        <div className="info-grid">
          
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Plane size={24} /></div>
              <h3>At the Airport</h3>
            </div>
            <p>Recognize unfamiliar currency right after exchanging money at the terminal kiosk before taking a taxi.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><ShoppingBag size={24} /></div>
              <h3>Shopping Abroad</h3>
            </div>
            <p>Ensure you are handing the cashier the correct denomination, and verify the change you receive back is accurate.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Utensils size={24} /></div>
              <h3>Restaurants & Tipping</h3>
            </div>
            <p>Confidently calculate and leave the appropriate tip in cash without struggling to read foreign numerical formats.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Train size={24} /></div>
              <h3>Local Transportation</h3>
            </div>
            <p>Quickly identify the correct coins and small notes needed for bus fares, subway tickets, and street vendors.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Map size={24} /></div>
              <h3>Travel Planning</h3>
            </div>
            <p>Familiarize yourself with the visual appearance of destination currencies before you even leave home.</p>
          </div>

        </div>
      </div>
    </InformationalPageLayout>
  );
};

export default SolutionsTravelers;
