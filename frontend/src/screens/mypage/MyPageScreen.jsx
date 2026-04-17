import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions,
} from 'react-native';

const CARD_WIDTH = Dimensions.get('window').width * 0.7;
const CARD_HEIGHT = CARD_WIDTH * (41 / 65);
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const BANKS = [
  { id: 'won',    label: 'WON',   color: '#2B6EEB', bg: '#FFFFFF', logo: require('../../../assets/logo/won로고.png') },
  { id: 'hana',   label: '하나',  color: '#FFFFFF', bg: '#FFFFFF', logo: require('../../../assets/logo/하나카드 로고.jpg') },
  { id: 'shinhan', label: '신한', color: '#FFFFFF', bg: '#0046FF' },
  { id: 'kb',     label: 'KB',    color: '#111111', bg: '#FFD500' },
];

const MENU = ['나의 리뷰 관리', '고객센터', '1:1 문의'];

export default function MyPageScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selected, setSelected] = useState('won');

  const nickname = user?.memberNickname ?? '';
  const email = user?.memberEmail ?? '';
  const profileImg = user?.profileImageUrl;

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
          {profileImg ? (
            <Image source={{ uri: profileImg }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar} />
          )}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{nickname} </Text>
              <Text style={styles.nameSub}>님</Text>
              <Text style={styles.tBadge}>T</Text>
            </View>
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
            style={styles.cardImage}
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
  profileInfo: { marginLeft: 14, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: '#111827' },
  nameSub: { fontSize: 14, color: '#111827' },
  tBadge: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '800',
    color: '#3B82F6',
  },
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
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
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
});
