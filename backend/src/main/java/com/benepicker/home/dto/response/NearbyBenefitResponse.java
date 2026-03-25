package com.benepicker.home.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "주변 혜택 상세 정보")
public class NearbyBenefitResponse {

    @Schema(description = "매장 ID", example = "1")
    private Long storeId;

    @Schema(description = "매장 이름", example = "스타벅스 판교점")
    private String storeName;

    @Schema(description = "브랜드 이름", example = "스타벅스")
    private String brandName;

    @Schema(description = "매장 주소", example = "경기도 성남시 분당구")
    private String storeAddress;

    @Schema(description = "매장 위도", example = "37.3595704")
    private Double storeLat;

    @Schema(description = "매장 경도", example = "127.105399")
    private Double storeLng;

    @Schema(description = "매장 이미지 URL", example = "https://example.com/store.jpg", nullable = true)
    private String storeImageUrl;

    @Schema(description = "혜택 ID", example = "10")
    private Long benefitId;

    @Schema(description = "혜택 타입 (TELECOM, STORE, CARD)", example = "STORE")
    private String benefitType;

    @Schema(description = "혜택 내용", example = "아메리카노 10% 할인")
    private String benefitContent;

    @Schema(description = "할인율 또는 할인 금액", example = "10")
    private Integer benefitDiscount;

    @Schema(description = "혜택 조건", example = "1인 1잔")
    private String benefitCondition;

    @Schema(description = "현재 위치로부터 거리(m)", example = "120")
    private Integer distanceMeter;

    @Schema(description = "사용자의 찜 여부", example = "false")
    private Boolean isLiked;
}