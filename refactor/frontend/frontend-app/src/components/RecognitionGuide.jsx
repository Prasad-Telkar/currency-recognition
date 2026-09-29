import React from 'react';
import { Camera, Sun, Focus, Layers, Maximize } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const RecognitionGuide = ({ setActiveTab }) => {
  return (
    <InformationalPageLayout
      title="How to Get the Best Results"
      subtitle="Follow these simple photography guidelines to ensure CurrencyAI recognizes your banknotes instantly and accurately."
      icon={Camera}
      breadcrumbCurrent="Recognition Guide"
      setActiveTab={setActiveTab}
    >
      <div className="info-section">
        <h2>Camera & Environment Tips</h2>
        <div className="info-grid">
          
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Sun size={24} /></div>
              <h3>Proper Lighting</h3>
            </div>
            <p>Ensure the banknote is well-lit. Natural daylight is best. Avoid harsh shadows across the face of the note, and turn off your flash if it causes heavy glare on polymer (plastic) notes.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Focus size={24} /></div>
              <h3>Tap to Focus</h3>
            </div>
            <p>Blurry images dramatically reduce AI accuracy. Always tap your screen to focus the camera on the center of the banknote before capturing the image.</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Maximize size={24} /></div>
              <h3>Full Frame Visibility</h3>
            </div>
            <p>The entire banknote should be visible inside the frame. Do not crop out the edges, as the AI uses corner serial numbers and border patterns to identify the specific currency.</p>
          </div>
          
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><Layers size={24} /></div>
              <h3>One Note at a Time</h3>
            </div>
            <p>CurrencyAI is currently optimized to identify a single banknote per scan. Do not spread multiple different notes across the table in a single photo.</p>
          </div>

        </div>
      </div>

      <div className="info-section">
        <h2>Visual Examples</h2>
        <p>A side-by-side comparison of good and poor capture techniques.</p>
        
        <div className="comparison-layout">
          <div className="comp-card comp-good">
            <div className="comp-header">✅ Optimal Capture</div>
            <div className="comp-visual good-visual">
              <div className="comp-note" style={{ background: '#cbd5e1' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: '#333' }}>100</div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: '#333' }}>100</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#94a3b8', margin: '20px auto 0' }}></div>
              </div>
            </div>
            <div className="comp-desc">
              Flat surface, even lighting, sharp focus, and the entire boundary of the note is clearly visible to the camera.
            </div>
          </div>
          
          <div className="comp-card comp-poor">
            <div className="comp-header">❌ Poor Capture</div>
            <div className="comp-visual poor-visual" style={{ overflow: 'hidden' }}>
              {/* Simulate a badly cropped, folded note with glare */}
              <div className="comp-note" style={{ background: '#cbd5e1', transform: 'scale(1.8) rotate(15deg) translateY(20px)', filter: 'blur(3px)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'rgba(255,255,255,0.6)' }}></div>
              </div>
            </div>
            <div className="comp-desc">
              Heavy glare washing out details, motion blur, and the edges of the note are cropped outside the frame.
            </div>
          </div>
        </div>
      </div>
    </InformationalPageLayout>
  );
};

export default RecognitionGuide;
