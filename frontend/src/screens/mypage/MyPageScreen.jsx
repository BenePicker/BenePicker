import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions,
  TextInput, Alert, ActivityIndicator, Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { checkNickname, updateProfile, logout } from '../../api/auth';

const BANKS = [
  { id: 'won',    label: 'WON',   color: '#2B6EEB', bg: '#FFFFFF', logo: require('../../../assets/logo/won_logo.png') },
  { id: 'hana',   label: '하나',  color: '#FFFFFF', bg: '#FFFFFF', logo: require('../../../assets/logo/hana_logo.jpg') },
  { id: 'shinhan', label: '신한', color: '#FFFFFF', bg: '#0046FF' },
  { id: 'kb',     label: 'KB',    color: '#111111', bg: '#FFD500' },
];

const MENU = ['나의 리뷰 관리', '고객센터', '1:1 문의'];

export default function MyPageScreen() {
  const navigation = useNavigation();
  const { user, refreshUser, updateLocalProfileImage, signOut } = useAuth();
  const [selected, setSelected] = useState('won');

  const { width: winWidth } = useWindowDimensions();
  const cardWidth = Math.min(winWidth, 430) * 0.7;
  const cardHeight = cardWidth * (41 / 65);

  const nickname = user?.memberNickname ?? '';
  const email = user?.memberEmail ?? '';
  const profileImg = user?.profileImageUrl;

  const [editingNick, setEditingNick] = useState(false);
  const [nickDraft, setNickDraft] = useState('');
  const [nickSaving, setNickSaving] = useState(false);

  const startEditNick = () => {
    setNickDraft(nickname);
    setEditingNick(true);
  };

  const cancelEditNick = () => {
    setEditingNick(false);
    setNickDraft('');
  };

  const saveNick = async () => {
    const next = nickDraft.trim();
    if (!next) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    if (next.length < 2 || next.length > 10) {
      Alert.alert('알림', '닉네임은 2~10자로 입력해주세요.');
      return;
    }
    if (next === nickname) {
      cancelEditNick();
      return;
    }
    setNickSaving(true);
    try {
      const chk = await checkNickname(next);
      const available =
        chk?.data?.available === undefined ? true : chk.data.available === true;
      if (!available) {
        Alert.alert('알림', '이미 사용 중인 닉네임이에요.');
        setNickSaving(false);
        return;
      }
      await updateProfile({ memberNickname: next });
      await refreshUser();
      setEditingNick(false);
    } catch (e) {
      Alert.alert('변경 실패', e.response?.data?.message ?? '다시 시도해주세요.');
    } finally {
      setNickSaving(false);
    }
  };

  const doLogout = async () => {
    try {
      await logout();
    } catch (_) {
      // 서버 응답이 실패해도 로컬 토큰은 제거한다
    } finally {
      await signOut();
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('정말 로그아웃 하시겠어요?')) {
        doLogout();
      }
      return;
    }
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: doLogout },
    ]);
  };

  const pickProfileImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('권한 필요', '사진을 선택하려면 갤러리 접근 권한이 필요해요.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled) return;
      const uri = result.assets?.[0]?.uri;
      if (uri) await updateLocalProfileImage(uri);
    } catch (e) {
      Alert.alert('오류', '사진을 불러오지 못했어요.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={26} color="#7C3AED" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Profile */}
        <View style={styles.profileRow}>
          <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.8}>
            {profileImg ? (
              <Image source={{ uri: profileImg }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar} />
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            {editingNick ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.nickInput}
                  value={nickDraft}
                  onChangeText={setNickDraft}
                  autoFocus
                  maxLength={10}
                  placeholder="2~10자"
                  placeholderTextColor="#9CA3AF"
                />
                {nickSaving ? (
                  <ActivityIndicator color="#7C3AED" style={{ marginLeft: 4 }} />
                ) : (
                  <>
                    <TouchableOpacity onPress={saveNick} hitSlop={6} style={styles.editBtn}>
                      <Ionicons name="checkmark" size={18} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEditNick} hitSlop={6} style={styles.editBtn}>
                      <Ionicons name="close" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.name}>{nickname} </Text>
                <Text style={styles.nameSub}>님</Text>
                <TouchableOpacity onPress={startEditNick} hitSlop={8} style={styles.pencilBtn}>
                  <Ionicons name="pencil" size={14} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        {/* 나의 카드 */}
        <Text style={styles.sectionLabel}>나의 카드</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRow}
        >
          <TouchableOpacity style={[styles.cardChip, styles.addChip]}>
            <Ionicons name="add" size={22} color="#7C3AED" />
          </TouchableOpacity>
          {BANKS.map((b) => (
            <TouchableOpacity
              key={b.id}
              onPress={() => setSelected(b.id)}
              style={[
                styles.cardChip,
                { backgroundColor: b.bg },
                selected === b.id && styles.cardChipActive,
              ]}
            >
              {b.logo ? (
                <Image source={b.logo} style={styles.cardChipLogo} resizeMode="contain" />
              ) : (
                <Text style={[styles.cardChipText, { color: b.color }]}>{b.label}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Card preview */}
        <View style={styles.cardPreview}>
          <Image
            source={require('../../../assets/image 46.png')}
            style={[styles.cardImage, { width: cardWidth, height: cardHeight }]}
            resizeMode="contain"
          />
        </View>

        {/* Menu */}
        <View style={styles.menuBox}>
          {MENU.map((label, idx) => (
            <TouchableOpacity key={label} style={[styles.menuRow, idx > 0 && styles.menuDivider]}>
              <Text style={styles.menuText}>{label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#7C3AED" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.menuRow, styles.menuDivider]}
            onPress={handleLogout}
          >
            <Text style={[styles.menuText, styles.logoutText]}>로그아웃</Text>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },

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
    color: '#111827',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1D5DB',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FAF9FF',
  },
  profileInfo: { marginLeft: 14, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: '#111827' },
  nameSub: { fontSize: 14, color: '#111827' },
  pencilBtn: { marginLeft: 8, padding: 2 },
  editRow: { flexDirection: 'row', alignItems: 'center' },
  nickInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 15,
    color: '#111827',
  },
  editBtn: { marginLeft: 6, padding: 4 },

  email: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  sectionLabel: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  cardRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  cardChip: {
    width: 64,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addChip: { backgroundColor: '#FFFFFF' },
  cardChipActive: {
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  cardChipText: { fontSize: 13, fontWeight: '800' },
  cardChipLogo: { width: 48, height: 36 },

  cardPreview: {
    marginTop: 40,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  cardImage: {
    borderRadius: 12,
  },

  menuBox: {
    marginTop: 110,
    marginHorizontal: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuDivider: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  menuText: { fontSize: 14, fontWeight: '600', color: '#111827' },
  logoutText: { color: '#EF4444' },
});
