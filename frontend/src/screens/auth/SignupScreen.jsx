import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { signup } from '../../api/auth';

export default function SignupScreen({ navigation }) {
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPw, setMemberPw] = useState('');
  const [memberNickname, setMemberNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!memberEmail || !memberPw || !memberNickname) {
      Alert.alert('알림', '모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await signup({ memberEmail, memberPw, memberNickname });
      Alert.alert('가입 완료', '로그인해주세요.', [
        { text: '확인', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) {
      Alert.alert('가입 실패', e.response?.data?.message ?? '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={memberNickname}
        onChangeText={setMemberNickname}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>가입하기</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, color: '#3B82F6' },
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
