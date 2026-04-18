import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getMapData } from '../../api/map';
import { KAKAO_JS_KEY } from '../../constants/kakao';
import { buildKakaoMapHtml } from './kakaoMapHtml';

const PRIMARY = '#7C3AED';
const INHA_LAT = 37.4513;
const INHA_LNG = 126.6559;

const MOCK_MARKERS = [
  { storeId: 101, storeName: '에그드랍',       brandName: '에그드랍',  storeLat: 37.4516, storeLng: 126.6555, distanceKm: 0.20, benefitSummary: '샌드위치 2,000원 할인', color: '#FFA726' },
  { storeId: 102, storeName: '아리베이글',     brandName: '아리베이글', storeLat: 37.4520, storeLng: 126.6572, distanceKm: 0.25, benefitSummary: '베이글 1+1',          color: '#6D4C41' },
  { storeId: 103, storeName: '밥냉면',         brandName: '밥냉면',    storeLat: 37.4510, storeLng: 126.6546, distanceKm: 0.30, benefitSummary: '물냉면 1,000원 할인', color: '#E53935' },
  { storeId: 104, storeName: 'GS25',           brandName: 'GS25',     storeLat: 37.4508, storeLng: 126.6551, distanceKm: 0.22, benefitSummary: '1+1 상품',           color: '#0A9BEA' },
  { storeId: 105, storeName: 'CoCoICHIBANYA',  brandName: 'CoCo',     storeLat: 37.4511, storeLng: 126.6557, distanceKm: 0.18, benefitSummary: '카레 10% 할인',      color: '#A1887F' },
  { storeId: 106, storeName: '이디야 에스프레소', brandName: '이디야',  storeLat: 37.4509, storeLng: 126.6556, distanceKm: 0.19, benefitSummary: '아메리카노 500원 할인', color: '#1A237E' },
  { storeId: 107, storeName: '스타벅스 인하대점', brandName: '스타벅스', storeLat: 37.4513, storeLng: 126.6559, distanceKm: 0.24, benefitSummary: '골드 회원 대상 매일 1,800원에 아메리카노 외 3종 1+1', color: '#006241' },
  { storeId: 108, storeName: 'CU',             brandName: 'CU',       storeLat: 37.4516, storeLng: 126.6563, distanceKm: 0.28, benefitSummary: '삼각김밥 2개 3,000원', color: '#6A1B9A' },
  { storeId: 109, storeName: '스타벅스 용현점', brandName: '스타벅스', storeLat: 37.4517, storeLng: 126.6578, distanceKm: 0.40, benefitSummary: '톨 사이즈 500원 할인', color: '#006241' },
  { storeId: 110, storeName: '공차',           brandName: '공차',     storeLat: 37.4519, storeLng: 126.6582, distanceKm: 0.45, benefitSummary: '타로밀크티 20% 할인', color: '#BF360C' },
  { storeId: 111, storeName: '삼청당',         brandName: '삼청당',    storeLat: 37.4521, storeLng: 126.6566, distanceKm: 0.38, benefitSummary: '정식 1,000원 할인',  color: '#D84315' },
  { storeId: 112, storeName: '허수아비',       brandName: '허수아비',  storeLat: 37.4522, storeLng: 126.6572, distanceKm: 0.42, benefitSummary: '비빔밥 10% 할인',    color: '#E65100' },
];

function BottomSheet({ card, translateY, onRouteToggle, routeVisible }) {
  if (!card) return null;
  const firstBenefit = card.benefits?.[0];
  const walkMinutes = card.distanceKm != null
    ? Math.max(1, Math.round((card.distanceKm * 1000) / 80))
    : 3;
  const period = firstBenefit?.startDate && firstBenefit?.endDate
    ? `${firstBenefit.startDate.replace(/-/g, '.')} ~ ${firstBenefit.endDate.replace(/-/g, '.')}`
    : '';

  return (
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
      {card.storeImageUrl ? (
        <Image source={{ uri: card.storeImageUrl }} style={styles.sheetImage} />
      ) : (
        <View style={[styles.sheetImage, { backgroundColor: '#E5E7EB' }]} />
      )}
      <View style={styles.sheetBody}>
        <View style={styles.sheetTopRow}>
          <Text style={styles.sheetStore}>{card.storeName}</Text>
          <View style={styles.sheetMetaRow}>
            <Ionicons name="walk" size={13} color={PRIMARY} />
            <Text style={styles.sheetMetaPurple}>{walkMinutes}분</Text>
            <Ionicons name="star" size={12} color="#F59E0B" style={{ marginLeft: 6 }} />
            <Text style={styles.sheetMetaStar}>4.6</Text>
          </View>
        </View>
        {!!firstBenefit && (
          <Text style={styles.sheetBenefit} numberOfLines={2}>
            {firstBenefit.benefitContent}
          </Text>
        )}
        {!!period && <Text style={styles.sheetPeriod}>{period}</Text>}
        <View style={styles.sheetBottomRow}>
          <View style={styles.badgeRow}>
            {card.storeLogoUrl ? (
              <Image source={{ uri: card.storeLogoUrl }} style={styles.badge} />
            ) : (
              <View style={[styles.badge, { backgroundColor: '#006241' }]} />
            )}
            <View style={[styles.badge, { backgroundColor: '#0046FF' }]} />
            <View style={[styles.badge, { backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>kt</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onRouteToggle} style={styles.routeBtn} activeOpacity={0.8}>
            <Ionicons
              name={routeVisible ? 'close' : 'paper-plane'}
              size={18}
              color={PRIMARY}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.heartAbs} hitSlop={8}>
        <Ionicons
          name={card.wished ? 'heart' : 'heart-outline'}
          size={20}
          color="#EF4444"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MapScreen() {
  const navigation = useNavigation();
  const iframeRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [routeVisible, setRouteVisible] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const translateY = useRef(new Animated.Value(260)).current;

  useEffect(() => {
    (async () => {
      try {
        const res = await getMapData({ lat: INHA_LAT, lng: INHA_LNG, radiusKm: 1 });
        const apiMarkers = res.data?.markers ?? [];
        setMarkers(apiMarkers.length > 0 ? apiMarkers : MOCK_MARKERS);
      } catch (e) {
        setMarkers(MOCK_MARKERS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: selectedStoreId ? 0 : 260,
      useNativeDriver: true,
      tension: 60,
      friction: 11,
    }).start();
  }, [selectedStoreId, translateY]);

  const postToIframe = (cmd, extra = {}) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ cmd, ...extra }), '*');
  };

  useEffect(() => {
    if (!mapReady) return;
    postToIframe('updateSelected', { storeId: selectedStoreId });
  }, [selectedStoreId, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    if (routeVisible && selectedStoreId != null) {
      postToIframe('showRoute', { storeId: selectedStoreId });
    } else {
      postToIframe('hideRoute');
    }
  }, [routeVisible, selectedStoreId, mapReady]);

  const html = useMemo(() => (
    buildKakaoMapHtml({
      appKey: KAKAO_JS_KEY,
      centerLat: INHA_LAT,
      centerLng: INHA_LNG,
      markers,
    })
  ), [markers]);

  const handleSelectStore = async (storeId) => {
    setSelectedStoreId(storeId);
    setRouteVisible(false);
    const m = markers.find((x) => x.storeId === storeId);
    if (m) {
      setSelectedCard({
        storeId: m.storeId,
        storeName: m.storeName,
        brandName: m.brandName,
        storeLogoUrl: m.storeLogoUrl,
        storeImageUrl: m.storeImageUrl ?? null,
        distanceKm: m.distanceKm,
        wished: m.wished,
        benefits: [
          {
            benefitContent: m.benefitSummary ?? '혜택 정보 없음',
            startDate: '2025-11-01',
            endDate: '2025-11-30',
          },
        ],
      });
    }
    try {
      const res = await getMapData({
        lat: INHA_LAT,
        lng: INHA_LNG,
        radiusKm: 1,
        selectedStoreId: storeId,
      });
      if (res.data?.selectedCard) setSelectedCard(res.data.selectedCard);
    } catch {}
  };

  const clearSelection = () => {
    setSelectedStoreId(null);
    setRouteVisible(false);
    setSelectedCard(null);
  };

  const handleBack = () => {
    if (selectedStoreId) {
      clearSelection();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSearchTap = () => {
    navigation.navigate('Home', { screen: 'SearchScreen' });
  };

  // iframe → 부모 메시지 수신
  useEffect(() => {
    function onMessage(event) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      try {
        const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (msg.type === 'mapReady') {
          setMapReady(true);
        } else if (msg.type === 'markerTap' && msg.storeId != null) {
          handleSelectStore(msg.storeId);
        }
      } catch {}
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [markers]);

  const headerText = routeVisible && selectedCard
    ? selectedCard.storeName
    : '많이 먹고 적게 쓰자!';

  return (
    <View style={styles.container}>
      <iframe
        ref={iframeRef}
        srcDoc={html}
        title="kakao-map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />

      <SafeAreaView edges={['top']} style={styles.headerSafe} pointerEvents="box-none">
        <View style={styles.headerRow}>
          <View style={styles.searchPill}>
            <TouchableOpacity onPress={handleBack} hitSlop={8} style={{ marginRight: 4 }}>
              <Ionicons name="chevron-back" size={22} color={PRIMARY} />
            </TouchableOpacity>
            <Pressable style={{ flex: 1 }} onPress={handleSearchTap}>
              <Text
                style={[
                  styles.searchText,
                  routeVisible && { color: '#111827', fontWeight: '700' },
                ]}
                numberOfLines={1}
              >
                {headerText}
              </Text>
            </Pressable>
            <Image
              source={require('../../../assets/characters/캐릭터.png')}
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>

      {(loading || !mapReady) && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      )}

      <BottomSheet
        card={selectedCard}
        translateY={translateY}
        onRouteToggle={() => setRouteVisible((v) => !v)}
        routeVisible={routeVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  headerSafe: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerRow: { paddingHorizontal: 16, paddingTop: 8 },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  searchText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  mascot: { width: 38, height: 38, marginLeft: 6 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  },
  sheetImage: { width: 130, height: '100%' },
  sheetBody: { flex: 1, padding: 12, justifyContent: 'space-between' },
  sheetTopRow: { flexDirection: 'column', gap: 4 },
  sheetStore: { fontSize: 13, fontWeight: '700', color: '#111827' },
  sheetMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: -2 },
  sheetMetaPurple: { fontSize: 11, color: PRIMARY, fontWeight: '700' },
  sheetMetaStar: { fontSize: 11, color: '#111827', fontWeight: '700' },
  sheetBenefit: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18,
  },
  sheetPeriod: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  sheetBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  badgeRow: { flexDirection: 'row', gap: 4 },
  badge: { width: 22, height: 22, borderRadius: 6 },
  routeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartAbs: { position: 'absolute', top: 10, left: 10 },
});
