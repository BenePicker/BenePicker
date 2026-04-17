import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyInfo } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await getMyInfo();
      setUser(res.data);
    } catch (e) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('accessToken');
      setToken(stored);
      if (stored) {
        await fetchUser();
      }
      setIsLoading(false);
    })();
  }, [fetchUser]);

  const signIn = async (accessToken, refreshToken) => {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
    ]);
    setToken(accessToken);
    await fetchUser();
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setToken(null);
    setUser(null);
  };

  const refreshUser = fetchUser;

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
