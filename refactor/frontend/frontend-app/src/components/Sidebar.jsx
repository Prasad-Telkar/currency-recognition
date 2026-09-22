import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { 
  Home, 
  Sparkles, 
  ArrowLeftRight, 
  Globe as GlobeIcon, 
  History as HistoryIcon, 
  Newspaper, 
  Info,
  Coins, 
  Languages,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react";
import UserMenu from "./UserMenu";

export default function Sidebar({ activeTab, setActiveTab, darkMode, setDarkMode, user, onLogout, isMobileOpen, setIsMobileOpen }) {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "hi" ? "en" : "hi";
    i18n.changeLanguage(nextLang);
  };

  const menuSections = [
    {
      title: "Main",
      items: [
        { id: "home", icon: Home, label: t("nav.home", "Currency Recognition") },
        { id: "ai", icon: Sparkles, label: t("nav.ai", "What AI Can Do") }
      ]
    },
    {
      title: "Tools",
      items: [
        { id: "converter", icon: ArrowLeftRight, label: t("nav.converter", "Currency Converter") },
        { id: "news", icon: Newspaper, label: t("nav.news", "Finance News") },
        { id: "currencies", icon: GlobeIcon, label: t("nav.currencies", "Supported Currencies") }
      ]
    },
    {
      title: "Settings & Info",
      items: [
        { id: "history", icon: HistoryIcon, label: t("nav.history", "History") },
        { id: "about", icon: Info, label: t("nav.about", "About Us") }
      ]
    }
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside 
        className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${isMobileOpen ? "mobile-open" : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="sidebar-header" onClick={() => handleTabClick("home")}>
        <div className="brand-icon">
          <Coins size={28} />
        </div>
        <div className="brand-text">
          <strong>CurrencyAI</strong>
          <span>Vision System</span>
        </div>
        
        {/* Mobile close button */}
        <button 
          className="sidebar-close-btn" 
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileOpen(false);
          }}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuSections.map((section, idx) => (
          <div key={section.title} className="sidebar-section">
            <div className="sidebar-section-title">{section.title}</div>
            <div className="sidebar-section-items">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    <div className="nav-icon">
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">{item.label}</span>
                    {/* Tooltip for collapsed mode */}
                    {!isExpanded && <div className="nav-tooltip">{item.label}</div>}
                  </button>
                );
              })}
            </div>
            {idx < menuSections.length - 1 && <div className="sidebar-divider" />}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-item lang-toggle-btn"
          onClick={toggleLanguage}
        >
          <div className="nav-icon">
            <Languages size={18} strokeWidth={2.5} />
          </div>
          <span className="nav-label">{i18n.language === "hi" ? "हिन्दी" : "English"}</span>
          {!isExpanded && <div className="nav-tooltip">Language</div>}
        </button>

        <div className="sidebar-user-menu">
          <UserMenu
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setActiveTab={setActiveTab}
            onLogout={onLogout}
            isSidebarExpanded={isExpanded}
          />
        </div>
      </div>
    </aside>
    </>
  );
}
