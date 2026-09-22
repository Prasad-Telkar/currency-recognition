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
import AboutCurrencyAI from "./components/AboutCurrencyAI";
import CurrencyGuide from "./components/CurrencyGuide";
import ApiDocs from "./components/ApiDocs";
import HelpCenter from "./components/HelpCenter";
import SolutionsTravelers from "./components/SolutionsTravelers";
import SolutionsBusiness from "./components/SolutionsBusiness";
import SolutionsEducation from "./components/SolutionsEducation";
import RecognitionGuide from "./components/RecognitionGuide";
import Feedback from "./components/Feedback";
import MobileHeader from "./components/MobileHeader";

export default function App() {
  const { i18n } = useTranslation();
  const { user, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        <MobileHeader 
          toggleSidebar={() => setIsMobileSidebarOpen(true)}
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setActiveTab={setActiveTab}
          onLogout={logout}
        />

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onLogout={logout}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
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
            {activeTab === "about" && <AboutCurrencyAI />}
            {activeTab === "converter" && <ManualConverter conversion={conversion} />}
            {activeTab === "currencies" && <CurrencyGrid />}
            {activeTab === "history" && <HistoryList history={history} />}
            {activeTab === "news" && <NewsSection />}
            {activeTab === "currency-guide" && <CurrencyGuide setActiveTab={setActiveTab} />}
            {activeTab === "api-docs" && <ApiDocs setActiveTab={setActiveTab} />}
            {activeTab === "help" && <HelpCenter setActiveTab={setActiveTab} />}
            {activeTab === "solutions-travelers" && <SolutionsTravelers setActiveTab={setActiveTab} />}
            {activeTab === "solutions-business" && <SolutionsBusiness setActiveTab={setActiveTab} />}
            {activeTab === "solutions-education" && <SolutionsEducation setActiveTab={setActiveTab} />}
            {activeTab === "recognition-guide" && <RecognitionGuide setActiveTab={setActiveTab} />}
            {activeTab === "feedback" && <Feedback setActiveTab={setActiveTab} />}
            <AIAssistant context={recognition.result ? `The user just scanned a ${recognition.result.denomination} ${recognition.result.currencyCode} (${recognition.result.currencyName}) note.` : null} />
          </main>

          <Footer setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
