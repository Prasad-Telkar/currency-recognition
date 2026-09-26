import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Coins, UserPlus, UploadCloud, BarChart3, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthScreen({ onAuth }) {
  const { t } = useTranslation();
  const { loginWithGoogle, loginWithEmail, signupWithEmail, setGuestUser } = useAuth();
  
  const [mode, setMode] = useState("login"); // login | signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (mode === "signup") {
        const fullName = `${firstName} ${lastName}`.trim();
        await signupWithEmail(email, password, fullName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists.");
      } else {
        setError(err.message || "Failed to authenticate.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = async (platform) => {
    try {
      setError(null);
      if (platform === 'Google') {
        await loginWithGoogle();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
    }
  };

  return (
    <div className="auth-split-layout">
      {/* LEFT PANEL: Branding & Steps */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <div className="auth-brand-large">
            <Coins size={28} />
            <strong>CurrencyAI</strong>
            <span>Vision System</span>
          </div>

          <div className="auth-marketing">
            <h1>Get Started with Us</h1>
            <p>Complete these easy steps to unlock AI-powered currency recognition.</p>

            <div className="auth-steps">
              <div className="auth-step">
                <div className="step-icon"><UserPlus size={18} /></div>
                <span>Create your account</span>
              </div>
              <div className="auth-step">
                <div className="step-icon"><UploadCloud size={18} /></div>
                <span>Upload currency images</span>
              </div>
              <div className="auth-step">
                <div className="step-icon"><BarChart3 size={18} /></div>
                <span>Get real-time AI insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <h2 className="auth-title">
            {mode === "login" ? "Log In Account" : "Sign Up Account"}
          </h2>
          <p className="auth-sub">
            {mode === "login"
              ? "Enter your credentials to access your account."
              : "Enter your personal data to create your account."}
          </p>

          {error && (
            <div className="auth-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-social">
            <button type="button" className="social-btn" onClick={() => handleSocialClick('Google')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="auth-divider">
            <span>Or</span>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <div className="form-row">
                <div className="field">
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="eg. John" required />
                </div>
                <div className="field">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="eg. Francisco" required />
                </div>
              </div>
            )}
            
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="eg. johnfrans@gmail.com" required />
            </div>
            
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required minLength={8} />
              {mode === "signup" && <span className="field-hint">Must be at least 8 characters.</span>}
            </div>
            
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : (mode === "login" ? "Log In" : "Sign Up")}
            </button>
          </form>

          <div className="auth-footer">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button type="button" className="auth-switch-btn" onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>

          <div className="auth-guest-section">
            <button type="button" className="guest-btn" onClick={() => setGuestUser({ displayName: "Guest", email: "guest@currencyai.com" })}>
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
