import React, { useState } from 'react';
import { Search, Book, Camera, Globe, RefreshCcw, AlertTriangle, Shield, Mail, CheckCircle } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const HelpCenter = ({ setActiveTab }) => {
  return (
    <InformationalPageLayout
      title="How can we help?"
      subtitle="Find answers, troubleshooting guides, and support for CurrencyAI."
      icon={null}
      breadcrumbCurrent="Help Center"
      setActiveTab={setActiveTab}
      customHero={
        <div className="info-hero" style={{ padding: '80px 20px' }}>
          <h1 style={{ fontSize: '56px', marginBottom: '32px' }}>How can we help?</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or troubleshooting..." 
              style={{
                width: '100%',
                padding: '20px 20px 20px 56px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>
      }
    >
      <div className="info-section">
        <h2>Help Categories</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Book size={24} /></div>
              <h3>Getting Started</h3>
            </div>
            <p>Learn the basics of uploading and scanning your first banknote with CurrencyAI.</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Camera size={24} /></div>
              <h3>Camera & Image</h3>
            </div>
            <p>Tips for taking the best photos to ensure high-confidence recognition results.</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Globe size={24} /></div>
              <h3>Supported Currencies</h3>
            </div>
            <p>View the full list of currently supported global currencies and upcoming additions.</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><RefreshCcw size={24} /></div>
              <h3>Conversion</h3>
            </div>
            <p>Understand how live exchange rates are fetched and applied to your recognized notes.</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><AlertTriangle size={24} /></div>
              <h3>Troubleshooting</h3>
            </div>
            <p>Resolve common issues like "Currency not found" or "Low confidence" errors.</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Shield size={24} /></div>
              <h3>Data & Privacy</h3>
            </div>
            <p>Learn how we handle your uploaded images and protect your privacy securely.</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Troubleshooting Examples</h2>
        <div className="comparison-layout">
          <div className="comp-card" style={{ background: 'var(--surface-2)', border: 'none' }}>
            <div className="comp-visual" style={{ background: '#000', color: 'var(--danger)' }}>
              <div className="comp-note" style={{ transform: 'rotate(10deg) scale(1.5)', filter: 'blur(5px) brightness(0.4)' }}></div>
              <span style={{ position: 'absolute', fontWeight: 'bold', fontSize: '24px' }}>Low Confidence Error</span>
            </div>
            <div className="comp-desc" style={{ padding: '24px' }}>
              <h4 style={{ color: 'var(--text)', fontSize: '18px', marginBottom: '8px' }}>Why isn't my currency recognized?</h4>
              <p style={{ margin: 0 }}><strong>Problem:</strong> The image is too blurry, dark, or taken from too far away.</p>
              <p style={{ margin: '8px 0 0', color: 'var(--green)' }}><strong>Solution:</strong> Ensure the room is well-lit, tap to focus your camera, and make sure the entire note is visible inside the frame.</p>
            </div>
          </div>
          
          <div className="comp-card" style={{ background: 'var(--surface-2)', border: 'none' }}>
            <div className="comp-visual" style={{ background: '#111', color: '#f59e0b' }}>
              <div className="comp-note" style={{ background: '#9ca3af' }}></div>
              <span style={{ position: 'absolute', fontWeight: 'bold', fontSize: '24px', color: '#f59e0b' }}>Unsupported Currency</span>
            </div>
            <div className="comp-desc" style={{ padding: '24px' }}>
              <h4 style={{ color: 'var(--text)', fontSize: '18px', marginBottom: '8px' }}>Currency not detected</h4>
              <p style={{ margin: 0 }}><strong>Problem:</strong> You uploaded a clear image, but the AI returned an error.</p>
              <p style={{ margin: '8px 0 0', color: 'var(--green)' }}><strong>Solution:</strong> The currency may not be in our current training dataset. Check the Supported Currencies list. You can also report it to help us train future models.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'stretch' }}>
          
          {/* Contact Support */}
          <div className="info-card" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 24px' }}>
            <Mail size={48} style={{ color: 'var(--primary-light)', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>Still need help?</h3>
            <p style={{ marginBottom: '24px' }}>Our support team is ready to assist you with any technical issues or account questions.</p>
            <a href="mailto:support@currencyai.com" style={{ display: 'inline-block', padding: '12px 24px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid var(--primary)' }}>
              support@currencyai.com
            </a>
          </div>

        </div>
      </div>

    </InformationalPageLayout>
  );
};

export default HelpCenter;
