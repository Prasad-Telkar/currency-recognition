import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ArrowLeftRight,
  Globe as GlobeIcon,
  History as HistoryIcon,
  Moon,
  Sun,
  Settings,
  LogOut,
} from "lucide-react";

export default function UserMenu({ user, darkMode, setDarkMode, setActiveTab, onLogout }) {
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

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-trigger" onClick={() => setOpen((o) => !o)} aria-label="Account menu">
        <div className="user-avatar">{(user.name || "G").slice(0, 1).toUpperCase()}</div>
        <ChevronDown size={14} className={open ? "chevron-open" : ""} />
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <div className="user-avatar large">{(user.name || "G").slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{user.name || "Guest"}</strong>
              <span>{user.email || "Guest session"}</span>
            </div>
          </div>

          <div className="user-dropdown-divider" />

          <button
            className="user-dropdown-item"
            onClick={() => {
              alert("Account settings — coming soon.");
              setOpen(false);
            }}
          >
            <Settings size={17} />
            {t("nav.accountSettings")}
          </button>

          <button className="user-dropdown-item" onClick={() => go("converter")}>
            <ArrowLeftRight size={17} />
            {t("nav.converter")}
          </button>

          <button className="user-dropdown-item" onClick={() => go("currencies")}>
            <GlobeIcon size={17} />
            {t("nav.currencies")}
          </button>

          <button className="user-dropdown-item" onClick={() => go("history")}>
            <HistoryIcon size={17} />
            {t("nav.history")}
          </button>

          <div className="user-dropdown-divider" />

          <button className="user-dropdown-item" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            {darkMode ? t("nav.lightMode") : t("nav.darkMode")}
          </button>

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
