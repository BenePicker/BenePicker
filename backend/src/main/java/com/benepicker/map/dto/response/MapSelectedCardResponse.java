package com.benepicker.map.dto.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "선택한 매장 카드 상세 정보")
public class MapSelectedCardResponse {

    @Schema(description = "매장 ID", example = "1")
    private Long storeId;

    @Schema(description = "매장명", example = "스타벅스 강남점")
    private String storeName;

    @Schema(description = "브랜드명", example = "스타벅스")
    private String brandName;

    @Schema(description = "매장 주소", example = "서울특별시 강남구 테헤란로 00")
    private String storeAddress;

    @Schema(description = "매장 대표 이미지 URL", example = "https://example.com/store.png")
    private String storeImageUrl;

    @Schema(description = "매장 로고 이미지 URL", example = "https://example.com/logo.png")
    private String storeLogoUrl;

    @Schema(description = "매장 앱/외부 링크", example = "https://example.com/app")
    private String storeAppLink;

    @Schema(description = "현재 위치로부터 거리(km)", example = "0.42")
    private Double distanceKm;

    @Schema(description = "매장 조회수", example = "123")
    private Integer viewCount;

    @Schema(description = "사용자의 찜 여부", example = "true")
    private Boolean wished;

    @Schema(description = "매장 혜택 목록")
    private List<MapBenefitResponse> benefits;
}