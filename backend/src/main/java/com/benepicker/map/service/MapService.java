package com.benepicker.map.service;

import com.benepicker.map.dto.response.MapResponse;

public interface MapService {
    MapResponse getMapData(Long memberNo, double lat, double lng, double radiusKm, Long selectedStoreId);
}