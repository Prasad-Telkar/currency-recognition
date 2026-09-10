import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Coins } from "lucide-react";

// Client-side only (persists via localStorage through useAuth). No backend
// call here — swap the onAuth caller for a real /login or /signup request
// when one exists; this component doesn't need to change.
export default function AuthScreen({ onAuth }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onAuth({ name: name || email.split("@")[0] || "Guest", email });
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <Coins size={20} />
          CurrencyAI
        </div>

        <h1 className="auth-title">
          {mode === "login" ? t("auth.loginTitle") : t("auth.signupTitle")}
        </h1>
        <p className="auth-sub">
          {mode === "login" ? t("auth.loginSubtitle") : t("auth.signupSubtitle")}
        </p>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <div className="field">
              <label htmlFor="name">{t("auth.name")}</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">{t("auth.email")}</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label htmlFor="password">{t("auth.password")}</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={4} />
          </div>
          <button type="submit" className="auth-submit">
            {mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === "login" ? t("auth.newHere") : t("auth.haveAccount")}
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? t("auth.signUp") : t("auth.signIn")}
          </button>
        </div>

        <button type="button" className="auth-guest" onClick={() => onAuth({ name: "Guest", email: "" })}>
          {t("auth.guest")}
        </button>
      </div>
    </div>
  );
}
