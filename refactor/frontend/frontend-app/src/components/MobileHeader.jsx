import React from 'react';
import { Menu, Coins } from 'lucide-react';
import UserMenu from './UserMenu';
import './MobileHeader.css';

export default function MobileHeader({ 
  toggleSidebar, 
  user, 
  darkMode, 
  setDarkMode, 
  setActiveTab, 
  onLogout 
}) {
  return (
    <header className="mobile-header">
      <div className="mobile-header-left">
        <button 
          className="hamburger-btn" 
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        
        <div className="mobile-brand" onClick={() => setActiveTab('home')}>
          <div className="brand-icon-mobile">
            <Coins size={22} />
          </div>
          <strong className="brand-text-mobile">CurrencyAI</strong>
        </div>
      </div>
      
      <div className="mobile-header-right">
        <UserMenu
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          isSidebarExpanded={false}
        />
      </div>
    </header>
  );
}
