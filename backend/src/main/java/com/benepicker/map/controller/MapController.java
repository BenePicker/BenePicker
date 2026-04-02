package com.benepicker.map.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.benepicker.common.auth.dto.CustomUserDetails;
import com.benepicker.map.dto.response.MapResponse;
import com.benepicker.map.service.MapService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
@Tag(name = "Map", description = "지도 관련 API")
public class MapController {

    private final MapService mapService;

    @GetMapping
    @Operation(summary = "지도 데이터 조회", description = "현재 위치 기준 주변 매장 마커와 선택 카드 정보를 조회합니다.")
    public ResponseEntity<MapResponse> getMapData(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "3") double radiusKm,
            @RequestParam(required = false) Long selectedStoreId
    ) {
        Long memberNo = userDetails.getMemberNo();

        MapResponse response = mapService.getMapData(memberNo, lat, lng, radiusKm, selectedStoreId);
        return ResponseEntity.ok(response);
    }
}