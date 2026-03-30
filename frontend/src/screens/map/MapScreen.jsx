import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.emoji}>🗺️</Text>
        <Text style={styles.title}>지도</Text>
        <Text style={styles.sub}>준비 중입니다</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emoji:     { fontSize: 48 },
  title:     { fontSize: 20, fontWeight: '700', color: '#111827' },
  sub:       { fontSize: 14, color: '#9CA3AF' },
});
