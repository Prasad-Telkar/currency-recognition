import React from "react";
import InformationalPageLayout from "./InformationalPageLayout";
import { Users, Lightbulb, Target, Sparkles, Sprout, Heart, Gem } from "lucide-react";

export default function AboutCurrencyAI() {
  return (
    <InformationalPageLayout
      title="About CurrencyAI"
      subtitle="Breaking down financial barriers with artificial intelligence."
      icon={Users}
      gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
    >
      <section className="info-section">
        <div className="section-header">
          <Lightbulb size={24} />
          <h2>Our Story</h2>
        </div>
        <div className="info-card">
          <p>
            CurrencyAI began as a mentorship project with a simple goal: making currency recognition accessible, instant, and reliable for everyone. Traveling abroad, managing international business, or simply trying to understand unfamiliar banknotes can be challenging. We realized that with the power of modern machine learning and vision AI, we could solve this problem through any smartphone or computer camera.
          </p>
          <p style={{ marginTop: "16px" }}>
            Today, CurrencyAI stands as a testament to what happens when curiosity meets technology. We are dedicated to providing a seamless experience that empowers users to confidently identify and convert currencies in real-time, completely free of charge.
          </p>
        </div>
      </section>

      <section className="info-section">
        <div className="section-header">
          <Target size={24} />
          <h2>Our Vision</h2>
        </div>
        <div className="grid-2">
          <div className="info-card">
            <h4><Sprout size={16} /> Accessible for All</h4>
            <p>Financial tools shouldn't be locked behind paywalls. We believe in open, free access to currency information for travelers, educators, and businesses globally.</p>
          </div>
          <div className="info-card">
            <h4><Sparkles size={16} /> AI-First Precision</h4>
            <p>Our models are continuously trained to recognize a wide variety of banknotes, adapting to new designs, lighting conditions, and wear-and-tear.</p>
          </div>
          <div className="info-card">
            <h4><Heart size={16} /> User-Centric Design</h4>
            <p>Technology should feel invisible. We designed CurrencyAI to be as simple as point, snap, and know—without cluttered interfaces or confusing menus.</p>
          </div>
          <div className="info-card">
            <h4><Gem size={16} /> Privacy Conscious</h4>
            <p>Your camera feed stays on your device. We don't store your images, ensuring that your financial tools respect your right to privacy.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="section-header">
          <Users size={24} />
          <h2>The Team Behind CurrencyAI</h2>
        </div>
        
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold-bright)', marginBottom: '16px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em' }}>
            <Sparkles size={14} /> Guided by Experience
          </div>
          
          <div className="info-card" style={{ maxWidth: '380px', margin: '0 auto', padding: '40px 24px', textAlign: 'center', position: 'relative' }}>
            <div 
              style={{ 
                width: "120px", 
                height: "120px", 
                borderRadius: "50%", 
                background: "var(--surface-2)", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--gold-bright)", // Highlighted border for mentor
                color: "var(--muted)"
              }}
            >
              MENTOR PHOTO
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Dileep Ladache</h3>
            <p style={{ color: "var(--gold-bright)", fontSize: "14px", marginBottom: "20px" }}>Project Mentor</p>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.6 }}>
              Guiding the team throughout the CurrencyAI journey.
            </p>
          </div>
        </div>
        
        <p style={{ marginBottom: "32px", fontSize: "16px", color: "var(--muted)", lineHeight: 1.6 }}>
          CurrencyAI was built through the combined efforts of all four team members. From collecting and organizing datasets to machine learning, denomination processing, interface design, and development, each member contributed an essential part to bringing the project together.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          
          <div className="info-card" style={{ textAlign: "center", padding: "32px 16px" }}>
            <div 
              style={{ 
                width: "100px", 
                height: "100px", 
                borderRadius: "50%", 
                background: "var(--surface-2)", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--border)",
                color: "var(--muted)"
              }}
            >
              PHOTO
            </div>
            <h3>Prasada</h3>
            <p style={{ color: "var(--gold-bright)", fontSize: "13px", marginBottom: "12px", minHeight: "36px" }}>Interface &amp; Product Design</p>
            <p style={{ fontSize: "13.5px" }}>Designed and developed the CurrencyAI interface, focusing on the user experience, visual design, frontend implementation, and bringing the team's AI capabilities into an intuitive application.</p>
          </div>

          <div className="info-card" style={{ textAlign: "center", padding: "32px 16px" }}>
            <div 
              style={{ 
                width: "100px", 
                height: "100px", 
                borderRadius: "50%", 
                background: "var(--surface-2)", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--border)",
                color: "var(--muted)"
              }}
            >
              PHOTO
            </div>
            <h3>Kunal</h3>
            <p style={{ color: "var(--gold-bright)", fontSize: "13px", marginBottom: "12px", minHeight: "36px" }}>Data Collection &amp; Interface Support</p>
            <p style={{ fontSize: "13.5px" }}>Collected and organized the currency datasets required for the project and also contributed to the interface development and overall product refinement.</p>
          </div>

          <div className="info-card" style={{ textAlign: "center", padding: "32px 16px" }}>
            <div 
              style={{ 
                width: "100px", 
                height: "100px", 
                borderRadius: "50%", 
                background: "var(--surface-2)", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--border)",
                color: "var(--muted)"
              }}
            >
              PHOTO
            </div>
            <h3>Vinay</h3>
            <p style={{ color: "var(--gold-bright)", fontSize: "13px", marginBottom: "12px", minHeight: "36px" }}>Denomination &amp; Data Organization</p>
            <p style={{ fontSize: "13.5px" }}>Worked on denomination identification and organized the currency data denomination-wise, while also contributing to the interface and overall development.</p>
          </div>

          <div className="info-card" style={{ textAlign: "center", padding: "32px 16px" }}>
            <div 
              style={{ 
                width: "100px", 
                height: "100px", 
                borderRadius: "50%", 
                background: "var(--surface-2)", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--border)",
                color: "var(--muted)"
              }}
            >
              PHOTO
            </div>
            <h3>Anushka</h3>
            <p style={{ color: "var(--gold-bright)", fontSize: "13px", marginBottom: "12px", minHeight: "36px" }}>Machine Learning</p>
            <p style={{ fontSize: "13.5px" }}>Developed the machine learning component of CurrencyAI, including training and working on the model responsible for currency recognition.</p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', background: 'var(--surface-2)', borderRadius: '12px' }}>
          <strong>Four contributors. Different strengths. One shared vision — CurrencyAI.</strong>
        </div>

      </section>
    </InformationalPageLayout>
  );
}
