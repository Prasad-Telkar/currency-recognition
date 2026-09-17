import React from 'react';
import { useTranslation } from "react-i18next";
import { Users, Target, Shield, Heart } from "lucide-react";

export default function AboutUs() {
  const { t } = useTranslation();

  const values = [
    { icon: Target, title: "Our Mission", desc: "To build a robust, AI-powered computer vision system capable of instantly and accurately identifying global currencies." },
    { icon: Shield, title: "Our Commitment", desc: "We prioritize data privacy, model accuracy, and real-time processing speeds to deliver a premium user experience." },
    { icon: Users, title: "The Team", desc: "Developed as part of the Persistent Systems Mentorship program, bridging cutting-edge ML models with modern web interfaces." },
    { icon: Heart, title: "Accessibility", desc: "Designed with inclusivity in mind, ensuring anyone, anywhere can identify physical banknotes effortlessly." }
  ];

  return (
    <div className="about-us-section fade-in">
      <div className="about-hero">
        <h2>About CurrencyAI</h2>
        <p>Bridging machine learning and finance through advanced computer vision.</p>
      </div>

      <div className="about-content">
        <div className="about-grid">
          {values.map((val, i) => (
            <div className="about-card glass-panel" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="about-icon-wrapper">
                <val.icon size={28} className="about-icon" />
              </div>
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="about-story glass-panel">
          <h3>The Story Behind CurrencyAI</h3>
          <p>
            CurrencyAI was built to solve a common challenge: quickly identifying and converting foreign banknotes without requiring specialized hardware. 
            By leveraging state-of-the-art image classification models and integrating them into a seamless React frontend, we have created an intuitive, 
            responsive, and powerful tool for travelers, finance professionals, and technology enthusiasts alike.
          </p>
        </div>
      </div>
    </div>
  );
}
