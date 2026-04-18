import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signup, login, checkEmail, checkNickname } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const PRIMARY = '#7C3AED';
const PRIMARY_LIGHT = '#C4B5FD';
const BORDER = '#E5E7EB';
const TEXT = '#111827';
const SUB = '#6B7280';
const HINT = '#9CA3AF';
const ERROR = '#EF4444';
const SUCCESS = '#10B981';

const EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;
const PW_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const TEL_RE = /^01\d{8,9}$/;

const isAvailable = (res) => {
  const d = res?.data;
  if (d == null) return true;
  if (typeof d === 'boolean') return d;
  if (typeof d.available === 'boolean') return d.available;
  if (typeof d.isDuplicate === 'boolean') return !d.isDuplicate;
  if (typeof d.duplicate === 'boolean') return !d.duplicate;
  return true;
};

export default function SignupScreen({ navigation }) {
  const { signIn } = useAuth();
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPw, setMemberPw] = useState('');
  const [memberPw2, setMemberPw2] = useState('');
  const [memberNickname, setMemberNickname] = useState('');
  const [memberTel, setMemberTel] = useState('');

  const [pwVisible, setPwVisible] = useState(false);
  const [pw2Visible, setPw2Visible] = useState(false);
  const [focus, setFocus] = useState(null);

  const [emailStatus, setEmailStatus] = useState({ state: 'idle', msg: '' });
  const [nickStatus, setNickStatus] = useState({ state: 'idle', msg: '' });
  const [checkedEmail, setCheckedEmail] = useState('');
  const [checkedNickname, setCheckedNickname] = useState('');

  const [loading, setLoading] = useState(false);

  const pwValid = PW_RE.test(memberPw);
  const pwMatch = memberPw.length > 0 && memberPw === memberPw2;
  const telValid = memberTel === '' || TEL_RE.test(memberTel);
  const nickLenValid = memberNickname.length >= 2 && memberNickname.length <= 10;

  const canSubmit = useMemo(() => {
    return (
      EMAIL_RE.test(memberEmail) &&
      pwValid &&
      pwMatch &&
      nickLenValid &&
      telValid &&
      checkedEmail === memberEmail.trim() &&
      checkedNickname === memberNickname.trim() &&
      !loading
    );
  }, [memberEmail, pwValid, pwMatch, nickLenValid, telValid, checkedEmail, checkedNickname, memberNickname, loading]);

  const handleCheckEmail = async () => {
    const email = memberEmail.trim();
    if (!EMAIL_RE.test(email)) {
      setEmailStatus({ state: 'error', msg: '이메일 형식이 올바르지 않습니다.' });
      return;
    }
    setEmailStatus({ state: 'checking', msg: '' });
    try {
      const res = await checkEmail(email);
      if (isAvailable(res)) {
        setEmailStatus({ state: 'ok', msg: '사용 가능한 이메일이에요' });
        setCheckedEmail(email);
      } else {
        setEmailStatus({ state: 'error', msg: '이미 사용 중인 이메일이에요' });
        setCheckedEmail('');
      }
    } catch (e) {
      const msg = e.response?.data?.message;
      if (e.response?.status === 409) {
        setEmailStatus({ state: 'error', msg: msg ?? '이미 사용 중인 이메일이에요' });
      } else if (e.response) {
        setEmailStatus({ state: 'error', msg: msg ?? '확인에 실패했어요' });
      } else {
        setEmailStatus({ state: 'error', msg: '네트워크 오류' });
      }
      setCheckedEmail('');
    }
  };

  const handleCheckNickname = async () => {
    const name = memberNickname.trim();
    if (!nickLenValid) {
      setNickStatus({ state: 'error', msg: '닉네임은 2~10자로 입력해주세요.' });
      return;
    }
    setNickStatus({ state: 'checking', msg: '' });
    try {
      const res = await checkNickname(name);
      if (isAvailable(res)) {
        setNickStatus({ state: 'ok', msg: '사용 가능한 닉네임이에요' });
        setCheckedNickname(name);
      } else {
        setNickStatus({ state: 'error', msg: '이미 사용 중인 닉네임이에요' });
        setCheckedNickname('');
      }
    } catch (e) {
      const msg = e.response?.data?.message;
      if (e.response?.status === 409) {
        setNickStatus({ state: 'error', msg: msg ?? '이미 사용 중인 닉네임이에요' });
      } else if (e.response) {
        setNickStatus({ state: 'error', msg: msg ?? '확인에 실패했어요' });
      } else {
        setNickStatus({ state: 'error', msg: '네트워크 오류' });
      }
      setCheckedNickname('');
    }
  };

  const handleSignup = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const payload = {
        memberEmail: memberEmail.trim(),
        memberPw,
        memberNickname: memberNickname.trim(),
      };
      if (memberTel.trim()) payload.memberTel = memberTel.trim();
      await signup(payload);
      try {
        const res = await login({ memberEmail: payload.memberEmail, memberPw });
        await signIn(res.data.accessToken, res.data.refreshToken);
      } catch {
        Alert.alert('가입 완료', '로그인 화면에서 다시 로그인해주세요.', [
          { text: '확인', onPress: () => navigation.replace('Login') },
        ]);
      }
    } catch (e) {
      Alert.alert('가입 실패', e.response?.data?.message ?? '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const statusText = (status) => {
    if (status.state === 'checking') return { color: SUB, text: '확인 중...', icon: null };
    if (status.state === 'ok') return { color: SUCCESS, text: status.msg, icon: 'checkmark-circle' };
    if (status.state === 'error') return { color: ERROR, text: status.msg, icon: 'close-circle' };
    return null;
  };

  const emailStatusView = statusText(emailStatus);
  const nickStatusView = statusText(nickStatus);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() && navigation.goBack()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={26} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>이메일</Text>
          <View style={styles.rowWithButton}>
            <View
              style={[
                styles.field,
                { flex: 1 },
                focus === 'email' && styles.fieldFocused,
              ]}
            >
              <Ionicons name="mail-outline" size={18} color={SUB} />
              <TextInput
                style={styles.input}
                placeholder="example@mail.com"
                placeholderTextColor={HINT}
                value={memberEmail}
                onChangeText={(v) => {
                  setMemberEmail(v);
                  if (emailStatus.state !== 'idle') setEmailStatus({ state: 'idle', msg: '' });
                  if (checkedEmail) setCheckedEmail('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocus('email')}
                onBlur={() => setFocus(null)}
              />
            </View>
            <TouchableOpacity
              onPress={handleCheckEmail}
              style={[styles.checkBtn, emailStatus.state === 'checking' && styles.buttonDisabled]}
              disabled={emailStatus.state === 'checking'}
              activeOpacity={0.8}
            >
              <Text style={styles.checkBtnText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          {emailStatusView && (
            <View style={styles.statusRow}>
              {emailStatusView.icon && (
                <Ionicons name={emailStatusView.icon} size={13} color={emailStatusView.color} />
              )}
              <Text style={[styles.statusText, { color: emailStatusView.color }]}>
                {emailStatusView.text}
              </Text>
            </View>
          )}

          <Text style={[styles.label, { marginTop: 18 }]}>비밀번호</Text>
          <View style={[styles.field, focus === 'pw' && styles.fieldFocused]}>
            <Ionicons name="lock-closed-outline" size={18} color={SUB} />
            <TextInput
              style={styles.input}
              placeholder="영문 + 숫자 8자 이상"
              placeholderTextColor={HINT}
              value={memberPw}
              onChangeText={setMemberPw}
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
          {memberPw.length > 0 && !pwValid && (
            <View style={styles.statusRow}>
              <Ionicons name="close-circle" size={13} color={ERROR} />
              <Text style={[styles.statusText, { color: ERROR }]}>
                영문과 숫자를 포함하여 8자 이상 입력해주세요
              </Text>
            </View>
          )}

          <Text style={[styles.label, { marginTop: 18 }]}>비밀번호 확인</Text>
          <View style={[styles.field, focus === 'pw2' && styles.fieldFocused]}>
            <Ionicons name="lock-closed-outline" size={18} color={SUB} />
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재입력"
              placeholderTextColor={HINT}
              value={memberPw2}
              onChangeText={setMemberPw2}
              secureTextEntry={!pw2Visible}
              onFocus={() => setFocus('pw2')}
              onBlur={() => setFocus(null)}
            />
            <TouchableOpacity onPress={() => setPw2Visible((v) => !v)} hitSlop={8}>
              <Ionicons
                name={pw2Visible ? 'eye-outline' : 'eye-off-outline'}
                size={18}
                color={SUB}
              />
            </TouchableOpacity>
          </View>
          {memberPw2.length > 0 && (
            <View style={styles.statusRow}>
              <Ionicons
                name={pwMatch ? 'checkmark-circle' : 'close-circle'}
                size={13}
                color={pwMatch ? SUCCESS : ERROR}
              />
              <Text style={[styles.statusText, { color: pwMatch ? SUCCESS : ERROR }]}>
                {pwMatch ? '비밀번호가 일치해요' : '비밀번호가 일치하지 않아요'}
              </Text>
            </View>
          )}

          <Text style={[styles.label, { marginTop: 18 }]}>닉네임</Text>
          <View style={styles.rowWithButton}>
            <View
              style={[
                styles.field,
                { flex: 1 },
                focus === 'nick' && styles.fieldFocused,
              ]}
            >
              <Ionicons name="person-outline" size={18} color={SUB} />
              <TextInput
                style={styles.input}
                placeholder="2~10자"
                placeholderTextColor={HINT}
                value={memberNickname}
                onChangeText={(v) => {
                  setMemberNickname(v);
                  if (nickStatus.state !== 'idle') setNickStatus({ state: 'idle', msg: '' });
                  if (checkedNickname) setCheckedNickname('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={10}
                onFocus={() => setFocus('nick')}
                onBlur={() => setFocus(null)}
              />
            </View>
            <TouchableOpacity
              onPress={handleCheckNickname}
              style={[styles.checkBtn, nickStatus.state === 'checking' && styles.buttonDisabled]}
              disabled={nickStatus.state === 'checking'}
              activeOpacity={0.8}
            >
              <Text style={styles.checkBtnText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          {nickStatusView && (
            <View style={styles.statusRow}>
              {nickStatusView.icon && (
                <Ionicons name={nickStatusView.icon} size={13} color={nickStatusView.color} />
              )}
              <Text style={[styles.statusText, { color: nickStatusView.color }]}>
                {nickStatusView.text}
              </Text>
            </View>
          )}

          <Text style={[styles.label, { marginTop: 18 }]}>전화번호 (선택)</Text>
          <View style={[styles.field, focus === 'tel' && styles.fieldFocused]}>
            <Ionicons name="call-outline" size={18} color={SUB} />
            <TextInput
              style={styles.input}
              placeholder="- 없이 숫자만 입력"
              placeholderTextColor={HINT}
              value={memberTel}
              onChangeText={(v) => setMemberTel(v.replace(/\D/g, ''))}
              keyboardType="number-pad"
              maxLength={11}
              onFocus={() => setFocus('tel')}
              onBlur={() => setFocus(null)}
            />
          </View>
          {memberTel.length > 0 && !telValid && (
            <View style={styles.statusRow}>
              <Ionicons name="close-circle" size={13} color={ERROR} />
              <Text style={[styles.statusText, { color: ERROR }]}>
                올바른 휴대폰 번호를 입력해주세요
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, !canSubmit && styles.buttonInactive]}
            onPress={handleSignup}
            disabled={!canSubmit}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>회원가입</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF9FF' },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 8,
    marginLeft: 2,
  },

  rowWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  fieldFocused: { borderColor: PRIMARY },
  input: { flex: 1, fontSize: 15, color: TEXT, paddingVertical: 0 },

  checkBtn: {
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
    gap: 4,
  },
  statusText: { fontSize: 12, fontWeight: '500' },

  button: {
    marginTop: 28,
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
  buttonInactive: {
    backgroundColor: PRIMARY_LIGHT,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginPrompt: { fontSize: 13, color: SUB },
  loginLink: { fontSize: 13, fontWeight: '700', color: PRIMARY },
});
