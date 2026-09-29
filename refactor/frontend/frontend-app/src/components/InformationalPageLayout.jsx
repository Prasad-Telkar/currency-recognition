import React, { useEffect } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import '../InformationalPages.css';

const InformationalPageLayout = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  breadcrumbCurrent,
  setActiveTab,
  children,
  customHero
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="info-page-container">
      {/* Breadcrumbs & Back Button */}
      <div className="info-breadcrumb">
        <button 
          className="info-breadcrumb-link" 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={14} />
          CurrencyAI
        </button>
        <ChevronRight size={14} className="info-breadcrumb-separator" />
        <span className="info-breadcrumb-current">{breadcrumbCurrent}</span>
      </div>

      {/* Hero Section */}
      {customHero ? (
        customHero
      ) : (
        <div className="info-hero">
          {Icon && (
            <div className="info-hero-icon">
              <Icon size={32} />
            </div>
          )}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      {/* Main Content */}
      <div className="info-content">
        {children}
      </div>
    </div>
  );
};

export default InformationalPageLayout;
