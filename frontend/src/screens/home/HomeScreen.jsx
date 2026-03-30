import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';


const { width: SW } = Dimensions.get('window');
const CARD_W = SW * 0.50;
const PURPLE = '#7C3AED';
const CARD_BG = '#6200EA'; // 밝은 보라
const SAVINGS = 13700;
const GOAL = 25000;

// ── Mock Data ──────────────────────────────────────────────
const NEARBY_STORES = [
  {
    id: 1,
    name: '공차 인하대후문점',
    category: '카페',
    bgColor: '#2A1F3D',
    walkTime: 5,
    rating: 4.7,
    benefit: '인기메뉴 6종 50% 할인',
        badges: [
      { image: require('../../../assets/logo/kt.png') },
    ],
    liked: false,
    logo: require('../../../assets//gongcha.png'),
  },
  {
    id: 2,
    name: '스타벅스 인하대점',
    category: '카페',
    bgColor: '#1E3932',
    walkTime: 3,
    rating: 4.6,
    benefit: '1,800원에 아메리카노 1+1',
    badges: [
      { image: require('../../../assets/logo/sb.png') },
      { image: require('../../../assets/logo/ba.png') },
      { image: require('../../../assets/logo/kt.png') },
    ],
    liked: true,
    logo: require('../../../assets/starbucks.png'),
  },
  {
    id: 3,
    name: '한솔도시락',
    category: '도시락',
    bgColor: '#1A3A5C',
    walkTime: 4,
    rating: 4.3,
    benefit: '국민e혜택 10% 할인',
    badges: [
      { image: require('../../../assets/logo/kp.png') },
      { image: require('../../../assets/logo/ba.png') },
    ],
    liked: false,
    logo: require('../../../assets/hansot.png'),
  },
  {
    id: 4,
    name: '메가MGC커피',
    category: '카페',
    bgColor: '#1B1B2F',
    walkTime: 2,
    rating: 4.5,
    benefit: '아이스 아메리카노 2+1',
    badges: [
      { image: require('../../../assets/logo/kt.png') },
    ],
    liked: false,
    logo: require('../../../assets/megacoffee.png'),
  },
];

const TDAY_STORES = [
  {
    id: 1,
    name: '배스킨라빈스',
    tag: 'T 데이',
    category: '카페',
    benefit: 'T 멤버십 고객님이라면, 누구나 레디팩 1+1',
    rating: 4.8,
  },
];

// ── StoreCard ──────────────────────────────────────────────
function StoreCard({ store, isLiked, onToggleLike }) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const handleHeart = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.5, useNativeDriver: true, speed: 60 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, speed: 40 }),
    ]).start();
    onToggleLike();
  };

  return (
    <Animated.View style={[styles.storeCard, { transform: [{ scale: pressScale }] }]}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        {/* 매장 이미지 영역 */}
        <View style={[styles.storeImgArea, { backgroundColor: store.bgColor }]}>
          {store.logo && (
            <Image
              source={store.logo}
              style={styles.storeImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.storeImgOverlay} />

          <TouchableOpacity style={styles.heartBtn} onPress={handleHeart}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#EF4444' : 'rgba(255,255,255,0.85)'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* 매장 정보 */}
        <View style={styles.storeInfo}>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>🚶 {store.walkTime}분</Text>
            <Text style={styles.metaText}>⭐ {store.rating}</Text>
          </View>
          <Text style={styles.storeName} numberOfLines={1}>
            {store.name}
          </Text>
          <Text style={styles.storeCategory}>{store.category}</Text>
          <Text style={styles.storeBenefit} numberOfLines={2}>
            {store.benefit}
          </Text>
            <View style={styles.badgeRow}>
              {store.badges.map((b, index) => (
                <Image
                  key={index}
                  source={b.image}
                  style={styles.badgeImage}
                  resizeMode="contain"
                />
              ))}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── TDayCard ───────────────────────────────────────────────
function TDayCard({ store }) {
  const pressScale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[styles.tdayCard, { transform: [{ scale: pressScale }] }]}>
      <Pressable
        style={styles.tdayInner}
        onPressIn={() =>
          Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()
        }
        onPressOut={() =>
          Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start()
        }
      >
        {/* 좌측 T데이 이미지 영역 */}
        <View style={styles.tdayImgArea}>
          <Image
            source={require('../../../assets/tday.png')}
            style={styles.tdayImage}
            resizeMode="contain"
          />
        </View>

        {/* 우측 정보 */}
        <View style={styles.tdayInfo}>
          <View style={styles.tdayNameRow}>
            <Text style={styles.tdayName}>{store.name} </Text>
            <Text style={styles.tdayTag}>[{store.tag}]</Text>
            <Text style={styles.tdayCategory}> {store.category}</Text>
          </View>
          <Text style={styles.tdayBenefit} numberOfLines={3}>
            {store.benefit}
          </Text>
          <Text style={styles.tdayRating}>⭐ {store.rating}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── HomeScreen ─────────────────────────────────────────────
export default function HomeScreen() {
  const { signOut } = useAuth();

  const mascotY     = useRef(new Animated.Value(0)).current;
  const mascotRot   = useRef(new Animated.Value(0)).current;
  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-14)).current;
  const cardFade    = useRef(new Animated.Value(0)).current;
  const cardScale   = useRef(new Animated.Value(0.93)).current;
  const progressAnim= useRef(new Animated.Value(0)).current;
  const savingsAnim = useRef(new Animated.Value(0)).current;
  const sec1Fade    = useRef(new Animated.Value(0)).current;
  const sec1Slide   = useRef(new Animated.Value(20)).current;
  const sec2Fade    = useRef(new Animated.Value(0)).current;
  const sec2Slide   = useRef(new Animated.Value(20)).current;

  const [displayAmt, setDisplayAmt] = useState(0);
  const [likedIds, setLikedIds] = useState(
    () => new Set(NEARBY_STORES.filter(s => s.liked).map(s => s.id)),
  );

  useEffect(() => {
    // 마스코트 떠다니기
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotY,  { toValue: -10, duration: 1600, useNativeDriver: true }),
        Animated.timing(mascotY,  { toValue: 0,   duration: 1600, useNativeDriver: true }),
      ]),
    ).start();

    // 마스코트 흔들기
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotRot, { toValue:  1, duration: 2200, useNativeDriver: true }),
        Animated.timing(mascotRot, { toValue: -1, duration: 2200, useNativeDriver: true }),
        Animated.timing(mascotRot, { toValue:  0, duration: 2200, useNativeDriver: true }),
      ]),
    ).start();

    // 헤더 슬라이드인
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // 절약 카드 팝인
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(cardFade,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, tension: 70, friction: 8 }),
      ]).start();
    }, 200);

    // 카운트업 + 프로그레스바
    const lid = savingsAnim.addListener(({ value }) => setDisplayAmt(Math.floor(value)));
    setTimeout(() => {
      Animated.timing(savingsAnim,   { toValue: SAVINGS, duration: 2000, useNativeDriver: false }).start();
      Animated.timing(progressAnim,  { toValue: 1,       duration: 1800, useNativeDriver: false }).start();
    }, 350);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(sec1Fade,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(sec1Slide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 550);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(sec2Fade,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(sec2Slide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 750);

    return () => savingsAnim.removeListener(lid);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', `${Math.round((SAVINGS / GOAL) * 100)}%`],
  });

  const rotateDeg = mascotRot.interpolate({
    inputRange:  [-1, 0, 1],
    outputRange: ['-4deg', '0deg', '4deg'],
  });

  const toggleLike = (id) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0EEFF" />
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── 헤더 + 검색바 (relative로 마스코트 절대 배치) ── */}
        <Animated.View
          style={[styles.topSection, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}
        >
          {/* 상단 아이콘 행 */}
          <View style={styles.topIcons}>
            <TouchableOpacity style={styles.bellWrap}>
              <Ionicons name="notifications-outline" size={26} color="#111827" />
              <View style={styles.notiBadge} />
            </TouchableOpacity>
            <View style={styles.avatar} />
          </View>

          {/* 인사말 + 위치 (오른쪽 여백으로 마스코트 공간 확보) */}
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>안녕하세요,</Text>
            <Text style={styles.userName}>김인하님</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#374151" />
              <Text style={styles.locationText} numberOfLines={1}>
                인천광역시 미추홀구 인하로 100
              </Text>
            </View>
          </View>

          {/* 검색바 (오른쪽 여백으로 마스코트 공간 확보) */}
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.85}>
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <Text style={styles.searchText}>나에게 딱맞는 혜택 정보 검색</Text>
          </TouchableOpacity>

          {/* 마스코트 - 절대 위치 고정 */}
          <Image
            source={require('../../../assets/characters/캐릭터.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ── 절약 카드 ── */}
        <Animated.View
          style={[styles.savingsCard, { opacity: cardFade, transform: [{ scale: cardScale }] }]}
        >
          <View style={styles.savingsBody}>
            {/* 돈 주머니 이미지 */}
            <Image
              source={require('../../../assets/icons/메인화면 아이콘.png')}
              style={styles.moneyBagImg}
              resizeMode="contain"
            />
            {/* 우측 텍스트 + 바 + 금액 */}
            <View style={styles.savingsRight}>
              <Text style={styles.savingsQ}>
                <Text style={styles.savingsName}>김인하</Text>
                <Text style={styles.savingsQText}> 님이 지금까지 절약한 금액은?</Text>
              </Text>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
              <Text style={styles.savingsAmt}>
                {displayAmt.toLocaleString()}원
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── 주변 혜택 ── */}
        <Animated.View style={{ opacity: sec1Fade, transform: [{ translateY: sec1Slide }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>지금 당장! 내 근처 혜택 찾기</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storeScroll}
          >
            {NEARBY_STORES.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                isLiked={likedIds.has(store.id)}
                onToggleLike={() => toggleLike(store.id)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── T데이 ── */}
        <Animated.View style={{ opacity: sec2Fade, transform: [{ translateY: sec2Slide }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>오늘은 T 데이! 당신을 위한 혜택</Text>
          </View>
          {TDAY_STORES.map(store => (
            <TDayCard key={store.id} store={store} />
          ))}
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EEFF' },

  // 헤더 + 검색바 영역 (relative → 마스코트 절대 배치용)
  topSection: {
    backgroundColor: '#F0EEFF',
    position: 'relative',
    paddingBottom: 0,
  },

  // 상단 아이콘 행 (오른쪽 정렬)
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 12,
  },
  bellWrap: { position: 'relative', padding: 2 },
  notiBadge: {
    position: 'absolute', top: 1, right: 1,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#F0EEFF',
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#9CA3AF',
  },

  //로고 뱃지
  badgeImage: {
  width: 22,
  height: 22,
  },

  // 인사말 영역 (오른쪽 여백으로 마스코트 공간)
  greetingSection: {
    paddingLeft: 24,
    paddingRight: 155,
    marginTop: 12,
  },
  greeting: { fontSize: 17, color: '#6B7280', fontWeight: '400' },
  userName: {
    fontSize: 38, fontWeight: '900', color: '#111827',
    marginTop: 2, letterSpacing: -1,
  },
  locationRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  locationText: { fontSize: 14, color: '#374151', marginLeft: 4, flex: 1 },

  // 검색바 (오른쪽 여백으로 마스코트 공간)
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginLeft: 20,
    marginRight: 148,
    marginTop: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 18, paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  searchText: { color: '#9CA3AF', fontSize: 14, marginLeft: 8 },

  // 마스코트 (절대 위치 - 우측)
  mascot: {
    position: 'absolute',
    right: 0,
    bottom: -30,
    width: 148,
    height: 188,
  },

  // 절약 카드
  savingsCard: {
    marginHorizontal: 16, marginBottom: 24,
    backgroundColor: CARD_BG,
    borderRadius: 22, padding: 20,
    overflow: 'hidden',
    shadowColor: CARD_BG,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  savingsBody:   { flexDirection: 'row', alignItems: 'center' },
  moneyBagImg:   { width: 88, height: 88, marginRight: 14 },
  savingsRight:  { flex: 1 },
  savingsQ:      { marginBottom: 12 },
  savingsName:   { color: '#fff', fontWeight: '900', fontSize: 16 },
  savingsQText:  { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '400' },
  progressTrack: {
    height: 10, backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5, overflow: 'hidden',
  },
  progressFill: { height: 10, backgroundColor: '#EF4444', borderRadius: 5 },
  savingsAmt: {
    color: '#fff', fontSize: 28, fontWeight: '800',
    textAlign: 'right', marginTop: 10, letterSpacing: -0.5,
  },

  // 섹션 헤더
  sectionHeader: { paddingHorizontal: 20, marginBottom: 12, marginTop: 4 },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: '#111827' },

  // 가게 카드
  storeScroll: { paddingLeft: 20, paddingRight: 8, gap: 10 },
  storeCard: {
    width: CARD_W, backgroundColor: '#fff', borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  storeImgArea: {
    height: 115, justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'relative',
  },
  storeImgOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 55,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  // 가게 이미지
  storeImage: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
},
  storeBrandText: { fontSize: 17, fontWeight: '800', letterSpacing: 0.3, zIndex: 1 },
  heartBtn: { position: 'absolute', top: 8, right: 8, padding: 4, zIndex: 2 },
  storeInfo:     { padding: 10 },
  metaRow:       { flexDirection: 'row', gap: 8 },
  metaText:      { fontSize: 11, color: '#6B7280' },
  storeName:     { fontSize: 13, fontWeight: '700', color: '#111827', marginTop: 5 },
  storeCategory: { fontSize: 10, color: '#9CA3AF', marginTop: 1 },
  storeBenefit:  { fontSize: 11, color: '#374151', marginTop: 4, lineHeight: 16 },
  badgeRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
  badge:         { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText:     { fontSize: 10, fontWeight: '700' },

  // T데이 카드
  tdayCard: {
    marginHorizontal: 16, marginBottom: 14,
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tdayInner:    { flexDirection: 'row', minHeight: 110 },
tdayImgArea: {
  width: 130,
  height: 110,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
},

tdayImage: {
  width: '100%',
  height: '100%',
},

  tdayLogoRow:  { flexDirection: 'row', alignItems: 'center' },
  tdayLogoText: { fontSize: 13, fontWeight: '900', color: '#3717CD' },
  tdayHeart:    { fontSize: 13, color: '#3717CD' },
  tdaySubLabel: { fontSize: 10, fontWeight: '700', color: '#3717CD', marginTop: 3, marginBottom: 8 },
  tdayEmoji:    { fontSize: 36 },
  tdayInfo:     { flex: 1, padding: 12, justifyContent: 'center' },
  tdayNameRow:  { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  tdayName:     { fontSize: 14, fontWeight: '700', color: '#111827' },
  tdayTag:      { fontSize: 13, fontWeight: '700', color: '#3717CD' },
  tdayCategory: { fontSize: 11, color: '#6B7280' },
  tdayBenefit:  { fontSize: 12, color: '#374151', lineHeight: 17, marginBottom: 6 },
  tdayRating:   { fontSize: 12, color: '#6B7280' },
});
