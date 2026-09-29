import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  ArrowLeftRight,
  Globe as GlobeIcon,
  History as HistoryIcon,
  Moon,
  Sun,
  Settings,
  LogOut,
  Download,
  KeyRound,
  ShieldCheck,
  HelpCircle,
  MessageCircle
} from "lucide-react";

export default function UserMenu({ user, darkMode, setDarkMode, setActiveTab, onLogout, isSidebarExpanded }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const go = (tab) => {
    setActiveTab(tab);
    setOpen(false);
  };

  const userName = user?.displayName || user?.name || "Guest";
  const userInitial = userName.slice(0, 1).toUpperCase();
  const userEmail = user?.email || "guest@currencyai.com";

  return (
    <div className="user-menu" ref={menuRef}>
      <button className={`user-menu-trigger ${isSidebarExpanded ? 'expanded' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Account menu">
        <div className="user-avatar">{userInitial}</div>
        {isSidebarExpanded && (
          <div className="user-info">
            <strong>{userName}</strong>
            <span>{userEmail}</span>
          </div>
        )}
        {isSidebarExpanded && <ChevronRight size={16} className={`chevron-open ${open ? 'rotated' : ''}`} />}
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <div className="user-avatar large">{userInitial}</div>
            <div>
              <strong>{userName}</strong>
              <span>{userEmail}</span>
            </div>
          </div>

          <div className="user-dropdown-divider" />

          <button
            className="user-dropdown-item"
            onClick={() => go("account-settings")}
          >
            <Settings size={17} />
            {t("nav.accountSettings", "Settings")}
          </button>

          <button className="user-dropdown-item" onClick={() => go("help")}>
            <HelpCircle size={17} />
            Help & Support
          </button>

          <button className="user-dropdown-item" onClick={() => go("feedback")}>
            <MessageCircle size={17} />
            Give Feedback
          </button>

          <div className="user-dropdown-divider" />

          <div className="theme-toggle-segmented">
            <button className={!darkMode ? "active" : ""} onClick={() => setDarkMode(false)}>
              <Sun size={15} /> Light
            </button>
            <button className={darkMode ? "active" : ""} onClick={() => setDarkMode(true)}>
              <Moon size={15} /> Dark
            </button>
          </div>

          <div className="user-dropdown-divider" />

          <button
            className="user-dropdown-item danger"
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
          >
            <LogOut size={17} />
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}

