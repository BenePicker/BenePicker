import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BANKS = [
  { id: 'won',    label: 'WON',   color: '#2B6EEB', bg: '#FFFFFF' },
  { id: 'hana',   label: '하나',  color: '#FFFFFF', bg: '#009490' },
  { id: 'shinhan', label: '신한', color: '#FFFFFF', bg: '#0046FF' },
  { id: 'kb',     label: 'KB',    color: '#111111', bg: '#FFD500' },
];

const MENU = ['나의 리뷰 관리', '고객센터', '1:1 문의'];

export default function MyPageScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('won');

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
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>김인하 </Text>
              <Text style={styles.nameSub}>님</Text>
              <Text style={styles.tBadge}>T</Text>
            </View>
            <Text style={styles.email}>iminhastudent@gmail.com</Text>
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
              <Text style={[styles.cardChipText, { color: b.color }]}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Card preview */}
        <View style={styles.cardPreview}>
          <Text style={styles.wooriLabel}>WOORI CARD</Text>
          <View style={styles.cardChipIcon}>
            <View style={styles.chipBar} />
            <View style={styles.chipBar} />
          </View>
          <Text style={styles.cardTitle}>카드의정석</Text>
          <Text style={styles.cardSub}>CHECK</Text>
          <View style={styles.masterMark}>
            <View style={[styles.circle, { backgroundColor: '#EB001B', marginRight: -10 }]} />
            <View style={[styles.circle, { backgroundColor: '#F79E1B', opacity: 0.9 }]} />
          </View>
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

  cardPreview: {
    marginTop: 4,
    marginHorizontal: 20,
    backgroundColor: '#BEE3F8',
    borderRadius: 12,
    height: 170,
    padding: 16,
    overflow: 'hidden',
  },
  wooriLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 1,
  },
  cardChipIcon: {
    width: 36,
    height: 26,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 18,
    padding: 4,
    justifyContent: 'space-between',
  },
  chipBar: { height: 3, backgroundColor: '#9CA3AF', borderRadius: 1 },
  cardTitle: {
    position: 'absolute',
    right: 16,
    top: 70,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSub: {
    position: 'absolute',
    right: 16,
    top: 94,
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
    letterSpacing: 1,
  },
  masterMark: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
  },
  circle: { width: 22, height: 22, borderRadius: 11 },

  menuBox: {
    marginTop: 22,
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
