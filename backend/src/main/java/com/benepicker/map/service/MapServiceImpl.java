package com.benepicker.map.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benepicker.map.dto.response.MapBenefitResponse;
import com.benepicker.map.dto.response.MapMarkerResponse;
import com.benepicker.map.dto.response.MapResponse;
import com.benepicker.map.dto.response.MapSelectedCardResponse;
import com.benepicker.map.mapper.MapMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MapServiceImpl implements MapService {

    private final MapMapper mapMapper;

    @Override
    @Transactional
    public MapResponse getMapData(Long memberNo, double lat, double lng, double radiusKm, Long selectedStoreId) {
        List<MapMarkerResponse> markers = mapMapper.findNearbyStores(memberNo, lat, lng, radiusKm);

        MapSelectedCardResponse selectedCard = null;

        if (selectedStoreId != null) {
            mapMapper.increaseViewCount(selectedStoreId);

            selectedCard = mapMapper.findSelectedStoreCard(memberNo, selectedStoreId, lat, lng);

            if (selectedCard != null) {
                List<MapBenefitResponse> benefits = mapMapper.findStoreBenefits(selectedStoreId);
                selectedCard.setBenefits(benefits);
            }
        }

        return MapResponse.builder()
                .currentLat(lat)
                .currentLng(lng)
                .markers(markers)
                .selectedCard(selectedCard)
                .build();
    }
}