import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signupWithEmail(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
      // Force a refresh of the user object to get the new display name
      setUser({ ...userCredential.user });
    }
    return userCredential;
  }

  function logout() {
    return signOut(auth);
  }

  // Fallback guest login function to keep the original API
  function setGuestUser(u) {
    setUser(u);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    setGuestUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
