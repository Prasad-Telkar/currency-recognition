import { useTranslation } from "react-i18next";
import { Home, ArrowLeftRight, Globe as GlobeIcon, History as HistoryIcon, Newspaper, Coins, Languages } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, user, onLogout }) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "hi" ? "en" : "hi";
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="navbar">
      <div className="brand" onClick={() => setActiveTab("home")}>
        <div className="brand-icon">
          <Coins size={24} />
        </div>
        <div>
          <strong>{t("app.name")}</strong>
          <span>{t("app.tagline")}</span>
        </div>
      </div>

      <nav>
        <button className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>
          <Home size={17} />
          {t("nav.home")}
        </button>
        <button className={activeTab === "converter" ? "active" : ""} onClick={() => setActiveTab("converter")}>
          <ArrowLeftRight size={17} />
          {t("nav.converter")}
        </button>
        <button className={activeTab === "currencies" ? "active" : ""} onClick={() => setActiveTab("currencies")}>
          <GlobeIcon size={17} />
          {t("nav.currencies")}
        </button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
          <HistoryIcon size={17} />
          {t("nav.history")}
        </button>
        <button className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("news")}>
          <Newspaper size={17} />
          {t("nav.news", "News")}
        </button>
      </nav>

      <div className="nav-right">
        <button
          className="lang-toggle-btn"
          onClick={toggleLanguage}
          title="Switch Language / भाषा बदलें"
          aria-label="Toggle language"
        >
          <Languages size={15} />
          <span>{i18n.language === "hi" ? "हिन्दी" : "EN"}</span>
        </button>

        <div className="ai-status">
          <span></span>
          {t("nav.aiOnline")}
        </div>

        <UserMenu
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
