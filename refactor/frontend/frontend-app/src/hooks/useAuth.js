import { useState } from "react";

const STORAGE_KEY = "currencyai_user";

// NOTE: this is a UI gate, not real authentication — there is no password
// check against a server. Swap login()/handleAuth's caller for a real
// POST /auth/login or /auth/signup request once the backend supports it;
// everything that reads `user` from this hook stays the same.
export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const saved = window.localStorage?.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (u) => {
    setUser(u);
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    window.localStorage?.removeItem(STORAGE_KEY);
  };

  return { user, login, logout };
}
