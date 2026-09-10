import { useTranslation } from "react-i18next";
import { Coins, Sparkles, Globe as GlobeIcon, ChevronDown } from "lucide-react";
import { XIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "./icons/SocialIcons";

// NOTE: Solutions/Legal/Company links and the three app-store badges are
// placeholders (href="#") — there's no privacy policy or mobile app yet.
// Point them at real pages once they exist.
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
          <h4>Product</h4>
          <ul>
            <li><button onClick={() => setActiveTab("home")}>Home</button></li>
            <li><button onClick={() => setActiveTab("converter")}>Converter</button></li>
            <li><button onClick={() => setActiveTab("currencies")}>Currencies</button></li>
            <li><button onClick={() => setActiveTab("history")}>History</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><button onClick={() => setActiveTab("currencies")}>Currency Guide</button></li>
            <li><a href="https://news.google.com/search?q=currency%20markets" target="_blank" rel="noreferrer">Finance News</a></li>
            <li><a href="#">API Docs</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Solutions</h4>
          <ul>
            <li><a href="#">For Travelers</a></li>
            <li><a href="#">For Businesses</a></li>
            <li><a href="#">For Educators</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms &amp; Conditions</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div className="footer-badges">
          <a href="#" className="store-badge">
            <Sparkles size={20} />
            <span><small>Get it on</small><strong>Google Play</strong></span>
          </a>
          <a href="#" className="store-badge">
            <Sparkles size={20} />
            <span><small>Download on the</small><strong>App Store</strong></span>
          </a>
          <a href="#" className="store-badge">
            <Sparkles size={20} />
            <span><small>Get the</small><strong>Desktop App</strong></span>
          </a>
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
