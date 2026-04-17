import React, { useEffect, useRef, useState } from 'react';
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
import { STORE_LAYOUT, findStoreLayout, CURRENT_LOCATION } from './mapLayout';

const PRIMARY = '#7C3AED';
const INHA_LAT = 37.4513;
const INHA_LNG = 126.6559;

// 스타벅스 인하대점 기준 고정 지그잭 경로 (크롭 이미지 559x896 기준)
const STARBUCKS_ROUTE = [
  [0.495, 0.929],
  [0.200, 0.929],
  [0.200, 0.746],
  [0.105, 0.746],
  [0.105, 0.518],
  [0.475, 0.518],
  [0.475, 0.639],
];

function buildRoute(target) {
  if (!target) return [];
  if (Math.abs(target.x - 0.475) < 0.01 && Math.abs(target.y - 0.639) < 0.01) {
    return STARBUCKS_ROUTE;
  }
  return [
    [CURRENT_LOCATION.x, CURRENT_LOCATION.y],
    [CURRENT_LOCATION.x, target.y],
    [target.x, target.y],
  ];
}

function RouteLine({ points, width, height }) {
  if (!points || points.length < 2 || !width || !height) return null;
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const horizontal = y1 === y2;
    const left = Math.min(x1, x2) * width;
    const top = Math.min(y1, y2) * height;
    const w = horizontal ? Math.abs(x2 - x1) * width : 6;
    const h = horizontal ? 6 : Math.abs(y2 - y1) * height;
    segs.push(
      <View
        key={i}
        style={{
          position: 'absolute',
          left: horizontal ? left : left - 3,
          top: horizontal ? top - 3 : top,
          width: w,
          height: h,
          backgroundColor: PRIMARY,
          borderRadius: 3,
        }}
      />
    );
  }
  return <>{segs}</>;
}

function SelectionRing({ x, y, logo, width, height }) {
  if (!width || !height) return null;
  const size = 64;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x * width - size / 2,
        top: y * height - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 4,
        borderColor: PRIMARY,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      {logo && (
        <Image
          source={logo}
          style={{ width: size - 14, height: size - 14, borderRadius: (size - 14) / 2 }}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

function FootprintBadge({ x, y, width, height, minutes = 3 }) {
  if (!width || !height) return null;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x * width,
        top: y * height,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Ionicons name="footsteps" size={22} color="#111827" />
      <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>{minutes}분</Text>
    </View>
  );
}

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
  const [mapData, setMapData] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [routeVisible, setRouteVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });

  const translateY = useRef(new Animated.Value(260)).current;

  useEffect(() => {
    (async () => {
      try {
        const res = await getMapData({ lat: INHA_LAT, lng: INHA_LNG, radiusKm: 1 });
        setMapData(res.data);
      } catch (e) {
        setMapData({ markers: [], selectedCard: null });
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

  const handleSelectStore = async (storeId) => {
    setSelectedStoreId(storeId);
    setRouteVisible(false);
    try {
      const res = await getMapData({
        lat: INHA_LAT,
        lng: INHA_LNG,
        radiusKm: 1,
        selectedStoreId: storeId,
      });
      setMapData(res.data);
      setSelectedCard(res.data?.selectedCard ?? null);
    } catch (e) {
      const m = mapData?.markers?.find((x) => x.storeId === storeId);
      if (m) {
        setSelectedCard({
          storeId: m.storeId,
          storeName: m.storeName,
          brandName: m.brandName,
          storeLogoUrl: m.storeLogoUrl,
          storeImageUrl: null,
          distanceKm: m.distanceKm,
          wished: m.wished,
          benefits: [{ benefitContent: m.benefitSummary }],
        });
      }
    }
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

  const selectedLayout = selectedCard
    ? findStoreLayout(selectedCard.storeName ?? '', selectedCard.brandName ?? '')
    : null;

  const headerText = routeVisible && selectedCard
    ? selectedCard.storeName
    : '많이 먹고 적게 쓰자!';

  const markers = mapData?.markers ?? [];
  const routePoints = routeVisible && selectedLayout ? buildRoute(selectedLayout) : [];

  const { w: MW, h: MH } = mapSize;

  return (
    <View style={styles.container}>
      {/* 지도 영역 — 헤더 아래, 탭바 위 */}
      <View
        style={styles.mapArea}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setMapSize({ w: width, h: height });
        }}
      >
        <Image
          source={require('../../../assets/map/map-bg.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="stretch"
        />

        {/* 경로 선 */}
        {routeVisible && <RouteLine points={routePoints} width={MW} height={MH} />}

        {/* 선택 마커 하이라이트 */}
        {selectedStoreId && selectedLayout && selectedLayout.logo && (
          <SelectionRing
            x={selectedLayout.x}
            y={selectedLayout.y}
            logo={selectedLayout.logo}
            width={MW}
            height={MH}
          />
        )}

        {/* 발자국 + 분 */}
        {routeVisible && (
          <FootprintBadge x={0.78} y={0.92} width={MW} height={MH} minutes={3} />
        )}

        {/* API 마커 터치영역 */}
        {markers.map((m) => {
          const layout = findStoreLayout(m.storeName ?? '', m.brandName ?? '');
          if (!layout || !MW) return null;
          const size = 64;
          return (
            <Pressable
              key={m.storeId}
              onPress={() => handleSelectStore(m.storeId)}
              style={{
                position: 'absolute',
                left: layout.x * MW - size / 2,
                top: layout.y * MH - size / 2,
                width: size,
                height: size,
              }}
            />
          );
        })}

        {/* API 응답 없을 때 데모용 터치영역 */}
        {markers.length === 0 && !loading && MW > 0 && Object.entries(STORE_LAYOUT).map(([name, layout], idx) => {
          const size = 64;
          return (
            <Pressable
              key={name}
              onPress={() => {
                setSelectedCard({
                  storeId: idx + 1,
                  storeName: name,
                  brandName: name,
                  storeLogoUrl: null,
                  storeImageUrl: null,
                  distanceKm: 0.24,
                  wished: false,
                  benefits: [
                    {
                      benefitContent: '골드 회원 대상 매일 1,800원에 아메리카노 외 3종 1+1',
                      startDate: '2025-11-01',
                      endDate: '2025-11-30',
                    },
                  ],
                });
                setSelectedStoreId(idx + 1);
              }}
              style={{
                position: 'absolute',
                left: layout.x * MW - size / 2,
                top: layout.y * MH - size / 2,
                width: size,
                height: size,
              }}
            />
          );
        })}
      </View>

      {/* 헤더 (최상단에 떠 있음) */}
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

      {/* 로딩 */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      )}

      {/* 하단 시트 */}
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

  mapArea: {
    ...StyleSheet.absoluteFillObject,
  },

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
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
