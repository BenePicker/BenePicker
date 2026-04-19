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
      const localUri = await AsyncStorage.getItem('profileImageLocalUri');
      const merged = localUri ? { ...res.data, profileImageUrl: localUri } : res.data;
      setUser(merged);
      return true;
    } catch (e) {
      if (e?.response?.status === 401) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'profileImageLocalUri']);
        setToken(null);
      }
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const resetDone = await AsyncStorage.getItem('authResetV1');
      if (!resetDone) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'profileImageLocalUri']);
        await AsyncStorage.setItem('authResetV1', '1');
      }
      const stored = await AsyncStorage.getItem('accessToken');
      if (stored) {
        setToken(stored);
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
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'profileImageLocalUri',
    ]);
    setToken(null);
    setUser(null);
  };

  const updateLocalProfileImage = async (uri) => {
    if (uri) {
      await AsyncStorage.setItem('profileImageLocalUri', uri);
    } else {
      await AsyncStorage.removeItem('profileImageLocalUri');
    }
    setUser((prev) => (prev ? { ...prev, profileImageUrl: uri ?? undefined } : prev));
  };

  const refreshUser = fetchUser;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        signIn,
        signOut,
        refreshUser,
        updateLocalProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
