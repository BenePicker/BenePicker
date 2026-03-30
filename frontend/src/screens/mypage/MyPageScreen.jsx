import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function MyPageScreen() {
  const { signOut } = useAuth();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.sub}>준비 중입니다</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#FAF9FF' },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emoji:       { fontSize: 48 },
  title:       { fontSize: 20, fontWeight: '700', color: '#111827' },
  sub:         { fontSize: 14, color: '#9CA3AF' },
  logoutBtn:   {
    marginTop: 24, backgroundColor: '#EF4444',
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10,
  },
  logoutText:  { color: '#fff', fontWeight: '700', fontSize: 15 },
});
