import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const M = {
  ba:   require('../../../assets/logo/ba.png'),
  kp:   require('../../../assets/logo/kp.png'),
  kt:   require('../../../assets/logo/kt.png'),
  sb:   require('../../../assets/logo/sb.png'),
  baem: require('../../../assets/logo/배민.jpg'),
  yogi: require('../../../assets/logo/요기요.png'),
  kakao: require('../../../assets/logo/카카오페이 로고.jpg'),
  naver: require('../../../assets/logo/네이버페이로고.png'),
  toss:  require('../../../assets/logo/토스.png'),
};

const MOCK_HISTORY = [
  {
    id: 1,
    store: '스타벅스 판교역점',
    category: '카페',
    date: '3일전',
    desc: '샌드위치/베이커리 제조 음료 주문 시 음료 30% 할인',
    logo: require('../../../assets/logo/starlogo.png'),
    memberships: [M.ba, M.sb],
  },
  {
    id: 2,
    store: '오븐에빠진닭 서초점',
    category: '음식점',
    date: '2025.12.01',
    desc: '매주 수요일/금요일 3천원 할인',
    logo: require('../../../assets/logo/오븐에 빠진 닭.jpg'),
    memberships: [M.baem, M.yogi],
  },
  {
    id: 3,
    store: '배스킨라빈스 효창공원점',
    category: '카페',
    date: '2025.11.19',
    desc: 'T멤버십 고객이라면, 누구나 레디백 1+1',
    logo: require('../../../assets/logo/베스킨라빈스.png'),
    memberships: [M.baem, M.yogi, M.ba],
  },
  {
    id: 4,
    store: '공차 인하대 후문점',
    category: '카페',
    date: '2025.11.18',
    desc: '공차 인기메뉴 6종 50% 할인',
    logo: require('../../../assets/gongcha.png'),
    memberships: [M.kt],
  },
  {
    id: 5,
    store: 'GS25 서초역점',
    category: '편의점',
    date: '2025.11.07',
    desc: '9월 간편 결제 혜택, 최대 50% 적립',
    logo: require('../../../assets/logo/GS.png'),
    memberships: [M.kakao, M.naver, M.toss],
  },
];

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [sortDesc, setSortDesc] = useState(true);

  const data = useMemo(
    () => (sortDesc ? MOCK_HISTORY : [...MOCK_HISTORY].reverse()),
    [sortDesc]
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.thumb}>
        {item.logo ? (
          <Image source={item.logo} style={styles.thumbImg} resizeMode="cover" />
        ) : (
          <Text style={styles.thumbFallback}>{item.store.slice(0, 2)}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.storeName} numberOfLines={1}>
            {item.store}
          </Text>
          <Text style={styles.category}>  {item.category}</Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>
          {item.desc}
        </Text>
        <View style={styles.badgeRow}>
          {item.memberships.map((src, idx) => (
            <Image key={idx} source={src} style={styles.badgeImg} resizeMode="cover" />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() && navigation.goBack()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={26} color="#7C3AED" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>사용내역</Text>
        <TouchableOpacity
          onPress={() => setSortDesc((v) => !v)}
          style={styles.sortBtn}
          hitSlop={10}
        >
          <Text style={styles.sortText}>{sortDesc ? '최신순' : '오래된순'}</Text>
          <Ionicons name="chevron-down" size={14} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  sortBtn: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  sortText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },

  listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbFallback: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },

  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  date: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 11,
    color: '#9CA3AF',
  },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', paddingRight: 60 },
  storeName: { fontSize: 15, fontWeight: '700', color: '#111827', flexShrink: 1 },
  category: { fontSize: 12, color: '#9CA3AF' },
  desc: { fontSize: 12, color: '#6B7280', marginTop: 4, lineHeight: 17 },

  badgeRow: { flexDirection: 'row', marginTop: 8, gap: 4, alignItems: 'center' },
  badgeImg: { width: 20, height: 20, borderRadius: 4 },
});
