import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const PRIMARY = '#7C3AED';
const BORDER = '#E5E7EB';
const TEXT = '#111827';
const SUB = '#6B7280';
const HINT = '#9CA3AF';
const ERROR = '#EF4444';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPw, setMemberPw] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!memberEmail.trim() || !memberPw) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await login({ memberEmail: memberEmail.trim(), memberPw });
      await signIn(res.data.accessToken, res.data.refreshToken);
    } catch (e) {
      const msg = e.response?.data?.message;
      if (e.response) {
        setError(msg ?? '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.brand}>
            <Text style={styles.brandTitle}>BenePicker</Text>
            <Text style={styles.brandSub}>나에게 맞는 복지 혜택을 한 번에</Text>
          </View>

          <View style={[styles.field, focus === 'email' && styles.fieldFocused]}>
            <Ionicons name="mail-outline" size={18} color={SUB} />
            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor={HINT}
              value={memberEmail}
              onChangeText={(v) => {
                setMemberEmail(v);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocus('email')}
              onBlur={() => setFocus(null)}
            />
          </View>

          <View style={[styles.field, focus === 'pw' && styles.fieldFocused]}>
            <Ionicons name="lock-closed-outline" size={18} color={SUB} />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor={HINT}
              value={memberPw}
              onChangeText={(v) => {
                setMemberPw(v);
                if (error) setError('');
              }}
              secureTextEntry={!pwVisible}
              onFocus={() => setFocus('pw')}
              onBlur={() => setFocus(null)}
            />
            <TouchableOpacity onPress={() => setPwVisible((v) => !v)} hitSlop={8}>
              <Ionicons
                name={pwVisible ? 'eye-outline' : 'eye-off-outline'}
                size={18}
                color={SUB}
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>로그인</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>아직 회원이 아니신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF9FF' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: 40 },
  brandTitle: { fontSize: 34, fontWeight: '900', color: PRIMARY, letterSpacing: -0.5 },
  brandSub: { marginTop: 8, fontSize: 13, color: SUB },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
    gap: 10,
  },
  fieldFocused: {
    borderColor: PRIMARY,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT,
    paddingVertical: 0,
  },

  errorText: {
    color: ERROR,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
    marginLeft: 4,
  },

  button: {
    marginTop: 12,
    height: 52,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  signupPrompt: { fontSize: 13, color: SUB },
  signupLink: { fontSize: 13, fontWeight: '700', color: PRIMARY },
});
