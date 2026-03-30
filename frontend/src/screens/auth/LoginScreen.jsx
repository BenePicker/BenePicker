import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPw, setMemberPw] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!memberEmail || !memberPw) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await login({ memberEmail, memberPw });
      await signIn(res.data.accessToken, res.data.refreshToken);
    } catch (e) {
      Alert.alert('로그인 실패', e.response?.data?.message ?? '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BenePicker</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={memberEmail}
        onChangeText={setMemberEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={memberPw}
        onChangeText={setMemberPw}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>로그인</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, color: '#3B82F6' },
  input: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8,
    padding: 12, marginBottom: 12, fontSize: 16,
  },
  button: {
    backgroundColor: '#3B82F6', padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 16, color: '#3B82F6', fontSize: 14 },
});
