// Kakao Maps HTML 템플릿 생성기. WebView의 source.html로 주입됨.
// 마커 배열을 인라인 JSON으로 포함시켜 최초 로드 시 렌더.

export function buildKakaoMapHtml({ appKey, centerLat, centerLng, markers = [] }) {
  const markersJson = JSON.stringify(markers);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>map</title>
<style>
  html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background: #F3F4F6; }
  .cur-dot { width: 18px; height: 18px; background: #EF4444; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
  .marker-pin {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: #FFFFFF;
    border: 2.5px solid #E5E7EB;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #111827;
    font-size: 10px;
    font-weight: 800;
    text-align: center;
    padding: 2px;
    box-sizing: border-box;
    line-height: 1.1;
    cursor: pointer;
  }
  .marker-pin.selected {
    width: 56px;
    height: 56px;
    border-radius: 28px;
    border-width: 4px;
    border-color: #7C3AED;
  }
  .marker-label {
    display: inline-block;
    padding: 2px 6px;
    background: transparent;
    color: #111827;
    font-size: 11px;
    font-weight: 700;
    transform: translate(-50%, 26px);
    white-space: nowrap;
    text-shadow: 0 0 3px #FFFFFF, 0 0 3px #FFFFFF, 0 0 3px #FFFFFF;
  }
</style>
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false"></script>
</head>
<body>
<div id="map"></div>
<script>
  var RN = window.ReactNativeWebView;
  function send(payload) {
    var data = JSON.stringify(payload);
    if (RN && RN.postMessage) {
      RN.postMessage(data);
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(data, '*');
    }
  }

  // 웹(iframe) 환경: 부모로부터 명령 수신
  window.addEventListener('message', function(e) {
    try {
      var msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (!msg || !msg.cmd) return;
      if (msg.cmd === 'updateSelected') window.updateSelected && window.updateSelected(msg.storeId);
      else if (msg.cmd === 'showRoute') window.showRoute && window.showRoute(msg.storeId);
      else if (msg.cmd === 'hideRoute') window.hideRoute && window.hideRoute();
    } catch (err) {}
  });

  var MARKERS = ${markersJson};
  var CENTER = { lat: ${centerLat}, lng: ${centerLng} };
  var map;
  var markerObjs = {};     // storeId -> { marker, label }
  var currentOverlay;
  var selectedStoreId = null;
  var routePolyline = null;

  window.onerror = function(msg, src, line, col, err) {
    send({ type: 'error', where: 'window.onerror', msg: String(msg), src: String(src), line: line });
    return false;
  };

  function init() {
    if (typeof kakao === 'undefined' || !kakao.maps) {
      send({ type: 'error', where: 'init', msg: 'kakao SDK not loaded (check key + localhost domain in Kakao console)' });
      return;
    }
    kakao.maps.load(function() {
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(CENTER.lat, CENTER.lng),
        level: 3,
      };
      map = new kakao.maps.Map(container, options);

      // 현재 위치 점
      var curEl = document.createElement('div');
      curEl.className = 'cur-dot';
      currentOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(CENTER.lat, CENTER.lng),
        content: curEl,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 2,
      });
      currentOverlay.setMap(map);

      // 마커 추가 (커스텀 pin + 라벨)
      MARKERS.forEach(function(m) {
        if (m.storeLat == null || m.storeLng == null) return;
        var pos = new kakao.maps.LatLng(m.storeLat, m.storeLng);

        var pinEl = document.createElement('div');
        pinEl.className = 'marker-pin';
        if (m.color) {
          pinEl.style.background = m.color;
          pinEl.style.color = '#FFFFFF';
          pinEl.style.borderColor = m.color;
        }
        var shortName = (m.brandName || m.storeName || '').slice(0, 4);
        pinEl.textContent = shortName;
        pinEl.addEventListener('click', function() {
          send({ type: 'markerTap', storeId: m.storeId });
        });

        var pinOverlay = new kakao.maps.CustomOverlay({
          position: pos,
          content: pinEl,
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 3,
        });
        pinOverlay.setMap(map);

        var labelEl = document.createElement('div');
        labelEl.className = 'marker-label';
        labelEl.textContent = m.storeName || m.brandName || '';
        var label = new kakao.maps.CustomOverlay({
          position: pos,
          content: labelEl,
          yAnchor: 0,
          zIndex: 4,
        });
        label.setMap(map);

        markerObjs[m.storeId] = {
          pinEl: pinEl,
          pinOverlay: pinOverlay,
          label: label,
          labelEl: labelEl,
          pos: pos,
        };
      });

      send({ type: 'mapReady' });
    });
  }

  // RN → WebView 명령 API
  window.updateSelected = function(storeId) {
    if (selectedStoreId != null && markerObjs[selectedStoreId]) {
      markerObjs[selectedStoreId].pinEl.classList.remove('selected');
    }
    selectedStoreId = storeId;
    if (storeId != null && markerObjs[storeId]) {
      markerObjs[storeId].pinEl.classList.add('selected');
      map.panTo(markerObjs[storeId].pos);
    }
  };

  window.showRoute = function(storeId) {
    if (routePolyline) { routePolyline.setMap(null); routePolyline = null; }
    if (!markerObjs[storeId]) return;
    var target = markerObjs[storeId].pos;
    var path = [
      new kakao.maps.LatLng(CENTER.lat, CENTER.lng),
      target,
    ];
    routePolyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 6,
      strokeColor: '#7C3AED',
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
    });
    routePolyline.setMap(map);
  };

  window.hideRoute = function() {
    if (routePolyline) { routePolyline.setMap(null); routePolyline = null; }
  };

  init();
</script>
</body>
</html>`;
}
