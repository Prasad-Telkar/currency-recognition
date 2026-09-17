import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import "./App.css";

import { useAuth } from "./hooks/useAuth";
import { useVoice } from "./hooks/useVoice";
import { useRecognition } from "./features/recognition/useRecognition";
import { useConversion } from "./features/conversion/useConversion";
import { useHistory } from "./features/history/useHistory";
import { LANGUAGE_TO_VOICE_LOCALE } from "./i18n";

import AuthScreen from "./components/AuthScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadBox from "./components/UploadBox";
import ResultCard from "./components/ResultCard";
import ManualConverter from "./components/ManualConverter";
import FeaturesSection from "./components/FeaturesSection";
import CurrencyGrid from "./components/CurrencyGrid";
import HistoryList from "./components/HistoryList";
import NewsSection from "./components/NewsSection";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import Sidebar from "./components/Sidebar";
import AICapabilities from "./components/AICapabilities";
import AboutUs from "./components/AboutUs";

export default function App() {
  const { i18n } = useTranslation();
  const { user, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(true);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const voice = useVoice();
  const history = useHistory();
  const conversion = useConversion("INR");
  const recognition = useRecognition({ onResult: (result) => history.addEntry(result) });

  const voiceLang = LANGUAGE_TO_VOICE_LOCALE[i18n.language] || "en-US";

  const handleOpenFullConverter = (amt, from, to) => {
    if (from) conversion.setBaseCurrency(from);
    if (to) conversion.setTargetCurrency(to);
    if (amt) conversion.setAmount(amt);
    conversion.runConversion(amt, from, to);
    setActiveTab("converter");
  };

  if (!user) {
    return (
      <div className={darkMode ? "app dark" : "app light"}>
        <AuthScreen onAuth={login} />
      </div>
    );
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* Decorative Animated Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="app-layout">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onLogout={logout}
        />

        <div className="main-content-wrapper">
          <main className="main-content">
            {activeTab === "home" && (
              <>
                <Hero fileInputRef={fileInputRef} cameraInputRef={cameraInputRef} />

                <UploadBox
                  recognition={recognition}
                  onPredict={recognition.analyze}
                  fileInputRef={fileInputRef}
                  cameraInputRef={cameraInputRef}
                />

                <ResultCard
                  result={recognition.result}
                  voice={voice}
                  lang={voiceLang}
                  conversion={conversion}
                  onOpenFullConverter={handleOpenFullConverter}
                  onOpenNews={() => setActiveTab("news")}
                />

                <FeaturesSection />
              </>
            )}

            {activeTab === "ai" && <AICapabilities />}
            {activeTab === "about" && <AboutUs />}
            {activeTab === "converter" && <ManualConverter conversion={conversion} />}
            {activeTab === "currencies" && <CurrencyGrid />}
            {activeTab === "history" && <HistoryList history={history} />}
            {activeTab === "news" && <NewsSection />}
          </main>

          <AIAssistant context={recognition.result ? `The user just scanned a ${recognition.result.denomination} ${recognition.result.currencyCode} (${recognition.result.currencyName}) note.` : null} />

          <Footer setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
