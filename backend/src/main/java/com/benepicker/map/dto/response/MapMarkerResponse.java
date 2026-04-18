package com.benepicker.map.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "지도 마커 정보")
public class MapMarkerResponse {

    @Schema(description = "매장 ID", example = "1")
    private Long storeId;

    @Schema(description = "매장명", example = "스타벅스 강남점")
    private String storeName;

    @Schema(description = "브랜드명", example = "스타벅스")
    private String brandName;

    @Schema(description = "매장 위도", example = "37.4979")
    private Double storeLat;

    @Schema(description = "매장 경도", example = "127.0276")
    private Double storeLng;

    @Schema(description = "매장 로고 이미지 URL", example = "https://example.com/logo.png")
    private String storeLogoUrl;

    @Schema(description = "대표 혜택 유형", example = "CARD")
    private String benefitType;

    @Schema(description = "대표 혜택 요약", example = "아메리카노 10% 할인")
    private String benefitSummary;

    @Schema(description = "현재 위치로부터 거리(km)", example = "0.42")
    private Double distanceKm;

    @Schema(description = "사용자의 찜 여부", example = "true")
    private Boolean wished;
}