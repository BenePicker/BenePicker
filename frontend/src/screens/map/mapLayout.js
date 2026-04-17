// 지도 배경 이미지(assets/map/map-bg.png, 크롭된 559x896)상의 매장 위치
// 원본 1236 기준 좌표를 new_y = (old_y*1236 - 200) / 896 로 환산

export const STORE_LAYOUT = {
  '에그드랍':         { x: 0.475, y: 0.404, logo: null },
  '아리베이글':       { x: 0.755, y: 0.280, logo: null, label: '아리베이글' },
  '밥냉면':           { x: 0.130, y: 0.562, logo: null },
  'GS25':             { x: 0.220, y: 0.611, logo: require('../../../assets/logo/GS.png') },
  'coco':             { x: 0.370, y: 0.577, logo: null },
  'EMPA':             { x: 0.295, y: 0.653, logo: null },
  '스타벅스 인하대점': { x: 0.475, y: 0.639, logo: require('../../../assets/starbucks.png') },
  'CU':               { x: 0.680, y: 0.666, logo: require('../../../assets/logo/culogo.png') },
  '스타벅스':         { x: 0.920, y: 0.625, logo: require('../../../assets/starbucks.png') },
  '공차':             { x: 0.915, y: 0.777, logo: require('../../../assets/gongcha.png'), label: '공차' },
  '삼청당':           { x: 0.660, y: 0.756, logo: null, label: '삼청당' },
  '허수아비':         { x: 0.765, y: 0.756, logo: null, label: '허수아비' },
};

export function findStoreLayout(storeName = '', brandName = '') {
  if (STORE_LAYOUT[storeName]) return STORE_LAYOUT[storeName];
  if (STORE_LAYOUT[brandName]) return STORE_LAYOUT[brandName];
  for (const key of Object.keys(STORE_LAYOUT)) {
    if (storeName.includes(key) || brandName.includes(key)) return STORE_LAYOUT[key];
  }
  return null;
}

export const CURRENT_LOCATION = { x: 0.495, y: 0.929 };
