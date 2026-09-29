import { useTranslation } from "react-i18next";
import { Coins, Globe as GlobeIcon, ChevronDown } from "lucide-react";
import { XIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "./icons/SocialIcons";

export default function Footer({ setActiveTab }) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "hi" ? "en" : "hi";
    i18n.changeLanguage(nextLang);
  };
  
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <Coins size={20} />
            CurrencyAI
          </div>
          <p>AI-powered currency recognition &amp; conversion.</p>
        </div>

        <div className="footer-col">
          <h4>PRODUCT</h4>
          <ul>
            <li><button onClick={() => setActiveTab("about")}>About CurrencyAI</button></li>
            <li><button onClick={() => setActiveTab("currency-guide")}>Currency Guide</button></li>
            <li><button onClick={() => setActiveTab("api-docs")}>API Documentation</button></li>
            <li><button onClick={() => setActiveTab("help")}>Help Center</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>SOLUTIONS</h4>
          <ul>
            <li><button onClick={() => setActiveTab("solutions-travelers")}>Travelers</button></li>
            <li><button onClick={() => setActiveTab("solutions-business")}>Businesses</button></li>
            <li><button onClick={() => setActiveTab("solutions-education")}>Educators</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>RESOURCES</h4>
          <ul>
            <li><button onClick={() => setActiveTab("recognition-guide")}>Recognition Guide</button></li>
            <li><button onClick={() => setActiveTab("feedback")}>Feedback</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>COMPANY</h4>
          <ul>
            <li><button onClick={() => setActiveTab("help")}>Contact</button></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <button className="footer-lang" onClick={toggleLanguage} aria-label="Toggle language">
          <GlobeIcon size={14} />
          {i18n.language === "hi" ? "हिन्दी" : "English"}
          <ChevronDown size={14} />
        </button>

        <div className="footer-socials">
          <a href="#" aria-label="X"><XIcon /></a>
          <a href="#" aria-label="Facebook"><FacebookIcon /></a>
          <a href="#" aria-label="LinkedIn"><LinkedinIcon /></a>
          <a href="#" aria-label="Instagram"><InstagramIcon /></a>
        </div>

        <div className="footer-copy">
          © CurrencyAI {new Date().getFullYear()} — AI Currency Recognition
        </div>
      </div>
    </footer>
  );
}
