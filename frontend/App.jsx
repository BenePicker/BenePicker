import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

const isWeb = Platform.OS === 'web';

function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9FF' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return token ? <AppNavigator /> : <AuthNavigator />;
}

function AppShell() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default function App() {
  if (!isWeb) return <AppShell />;

  return (
    <View style={styles.webOuter}>
      <View style={styles.phoneFrame}>
        <AppShell />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    minHeight: '100dvh',
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 430,
    height: 'calc(100dvh - 32px)',
    maxHeight: 932,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    paddingTop: 12,
  },
});
