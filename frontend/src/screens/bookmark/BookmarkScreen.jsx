import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const INITIAL = [
  {
    id: 1,
    store: '스타벅스 판교역점',
    category: '카페',
    photo: require('../../../assets/starbucks.png'),
    benefits: [
      '샌드위치/케이크와 제조 음료 주문 시 음료 30%',
      '선착순 5,000명 매일 아침 8시 아메리카노 2천원',
    ],
  },
  {
    id: 2,
    store: '배스킨라빈스 효창공원점',
    category: '카페',
    photo: require('../../../assets/logo/baskinrobbins.png'),
    benefits: [
      'T멤버십 고객님이라면, 누구나 레디팩 1+1',
      'KT 멤버십 달달 혜택, 파인트 30% OFF',
    ],
  },
];

export default function BookmarkScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState(INITIAL);

  const toggleWish = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.photo} style={styles.photo} resizeMode="cover" />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.storeName} numberOfLines={1}>
            {item.store}
            <Text style={styles.category}>  {item.category}</Text>
          </Text>
          <TouchableOpacity onPress={() => toggleWish(item.id)} hitSlop={10}>
            <Ionicons name="heart" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
        <Text style={styles.recentLabel}>이 가게의 최근 혜택</Text>
        {item.benefits.map((b, idx) => (
          <View key={idx} style={styles.benefitRow}>
            <Text style={styles.benefitText} numberOfLines={1}>{b}</Text>
            <Ionicons name="chevron-forward" size={16} color="#7C3AED" />
          </View>
        ))}
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
        <Text style={styles.headerTitle}>찜</Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={items}
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

  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  info: { flex: 1, marginLeft: 12, justifyContent: 'flex-start' },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  storeName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  category: { fontSize: 12, fontWeight: '500', color: '#9CA3AF' },

  recentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
    marginBottom: 6,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginRight: 6,
  },
});
