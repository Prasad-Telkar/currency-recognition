import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import "./App.css";

import { useAuth } from "./contexts/AuthContext";
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
import VoiceAssistanceInfo from "./components/VoiceAssistanceInfo";
import CameraRecognitionInfo from "./components/CameraRecognitionInfo";
import CurrencyInfoPage from "./components/CurrencyInfoPage";
import AccountSettings from "./components/AccountSettings";

export default function App() {
  const { i18n } = useTranslation();
  const { user, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [infoPageData, setInfoPageData] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
  };

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
    handleTabChange("converter");
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
          setActiveTab={handleTabChange}
          onLogout={logout}
        />

        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
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
                  onOpenNews={() => handleTabChange("news")}
                  onOpenInfo={(result) => {
                    setInfoPageData({ result, imageUrl: recognition.preview });
                    handleTabChange("currency-info");
                  }}
                />

                <FeaturesSection setActiveTab={handleTabChange} />
              </>
            )}

            {activeTab === "ai" && <AICapabilities />}
            {activeTab === "about" && <AboutCurrencyAI />}
            {activeTab === "converter" && <ManualConverter conversion={conversion} />}
            {activeTab === "currencies" && <CurrencyGrid />}
            {activeTab === "history" && (
              <HistoryList 
                history={history} 
                onOpenInfo={(item) => {
                  setInfoPageData({ result: item, imageUrl: item.imageUrl });
                  handleTabChange("currency-info");
                }} 
              />
            )}
            {activeTab === "news" && <NewsSection />}
            {activeTab === "currency-guide" && <CurrencyGuide setActiveTab={handleTabChange} />}
            {activeTab === "api-docs" && <ApiDocs setActiveTab={handleTabChange} />}
            {activeTab === "help" && <HelpCenter setActiveTab={handleTabChange} />}
            {activeTab === "solutions-travelers" && <SolutionsTravelers setActiveTab={handleTabChange} />}
            {activeTab === "solutions-business" && <SolutionsBusiness setActiveTab={handleTabChange} />}
            {activeTab === "solutions-education" && <SolutionsEducation setActiveTab={handleTabChange} />}
            {activeTab === "recognition-guide" && <RecognitionGuide setActiveTab={handleTabChange} />}
            {activeTab === "feedback" && <Feedback setActiveTab={handleTabChange} />}
            {activeTab === "voice" && <VoiceAssistanceInfo setActiveTab={handleTabChange} />}
            {activeTab === "camera" && <CameraRecognitionInfo setActiveTab={handleTabChange} />}
            {activeTab === "account-settings" && <AccountSettings />}
            {activeTab === "currency-info" && (
              <CurrencyInfoPage 
                data={infoPageData} 
                onBack={() => handleTabChange("home")} 
              />
            )}
            <AIAssistant context={recognition.result ? `The user just scanned a ${recognition.result.denomination} ${recognition.result.currencyCode} (${recognition.result.currencyName}) note.` : null} />
          </main>

          <Footer setActiveTab={handleTabChange} />
        </div>
      </div>
    </div>
  );
}
