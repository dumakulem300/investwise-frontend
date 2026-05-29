import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import api from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('firebaseToken', token);
        setUser(firebaseUser);
        // Fetch subscription status
        try {
          const res = await api.get('/subscription/my-subscription');
          setSubscription(res.data);
        } catch (err) {
          console.error('Failed to fetch subscription', err);
          setSubscription({ active: false });
        }
      } else {
        setUser(null);
        setSubscription(null);
        localStorage.removeItem('firebaseToken');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshSubscription = async () => {
    try {
      const res = await api.get('/subscription/my-subscription');
      setSubscription(res.data);
    } catch (err) {
      console.error('Failed to refresh subscription', err);
    }
  };

  const value = {
    user,
    loading,
    subscription,
    login,
    signup,
    logout,
    refreshSubscription
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}