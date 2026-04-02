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
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
@Tag(name = "Map", description = "지도 화면 관련 API")
public class MapController {

    private final MapService mapService;

    @GetMapping
    @Operation(
            summary = "지도 화면 데이터 조회",
            description = """
			현재 사용자 위치를 기준으로 주변 매장 마커 목록과,
			선택한 매장의 카드형 상세 정보를 조회합니다.
			
			- selectedStoreId가 없으면 마커 목록만 조회됩니다.
			- selectedStoreId가 있으면 해당 매장의 선택 카드 정보도 함께 조회됩니다.
			- 반경(radiusKm) 내의 매장만 조회됩니다.
			""",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @Parameters({
            @Parameter(
                    name = "lat",
                    description = "현재 사용자 위도",
                    required = true,
                    example = "37.5665"
            ),
            @Parameter(
                    name = "lng",
                    description = "현재 사용자 경도",
                    required = true,
                    example = "126.9780"
            ),
            @Parameter(
                    name = "radiusKm",
                    description = "조회 반경(km), 기본값 3",
                    required = false,
                    example = "3"
            ),
            @Parameter(
                    name = "selectedStoreId",
                    description = "선택한 매장 ID. 없으면 선택 카드 없이 마커 목록만 반환",
                    required = false,
                    example = "12"
            )
    })
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "지도 데이터 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MapResponse.class),
                            examples = @ExampleObject(
                                    name = "지도 조회 성공 예시",
                                    value = """
						{
						  "currentLat": 37.5665,
						  "currentLng": 126.978,
						  "markers": [
						    {
						      "storeId": 1,
						      "storeName": "스타벅스 강남점",
						      "brandName": "스타벅스",
						      "storeLat": 37.4979,
						      "storeLng": 127.0276,
						      "storeLogoUrl": "https://example.com/logo.png",
						      "benefitType": "CARD",
						      "benefitSummary": "아메리카노 10% 할인",
						      "distanceKm": 0.42,
						      "wished": true
						    }
						  ],
						  "selectedCard": {
						    "storeId": 1,
						    "storeName": "스타벅스 강남점",
						    "brandName": "스타벅스",
						    "storeAddress": "서울특별시 강남구 테헤란로 00",
						    "storeImageUrl": "https://example.com/store.png",
						    "storeLogoUrl": "https://example.com/logo.png",
						    "storeAppLink": "https://example.com/app",
						    "distanceKm": 0.42,
						    "viewCount": 123,
						    "wished": true,
						    "benefits": [
						      {
						        "benefitId": 10,
						        "benefitType": "CARD",
						        "benefitContent": "아메리카노 10% 할인",
						        "benefitDiscount": 10,
						        "benefitCondition": "OO카드 결제 시",
						        "startDate": "2026-04-01",
						        "endDate": "2026-04-30"
						      }
						    ]
						  }
						}
						"""
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "선택한 매장을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 내부 오류")
    })
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