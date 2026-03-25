package com.benepicker.benefit.dto.response;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "혜택 상세 조회 응답 DTO")
public class BenefitDetailResponse {

    @Schema(description = "혜택 ID", example = "1")
    private Long benefitId;

    @Schema(description = "혜택 유형 (예: DISCOUNT, POINT)", example = "DISCOUNT")
    private String benefitType;

    @Schema(description = "혜택 내용", example = "아메리카노 20% 할인")
    private String benefitContent;

    @Schema(description = "할인율 또는 할인 금액", example = "20")
    private Integer benefitDiscount;

    @Schema(description = "혜택 조건", example = "월 1회, 최소 결제금액 5,000원 이상")
    private String benefitCondition;

    @Schema(description = "혜택 시작일", example = "2026-03-01")
    private LocalDate startDate;

    @Schema(description = "혜택 종료일", example = "2026-03-31")
    private LocalDate endDate;

    @Schema(description = "매장 ID", example = "10")
    private Long storeId;

    @Schema(description = "매장 이름", example = "스타벅스 강남점")
    private String storeName;

    @Schema(description = "매장 주소", example = "서울 강남구 테헤란로 123")
    private String storeAddress;

    @Schema(description = "매장 위도", example = "37.123456")
    private Double storeLat;

    @Schema(description = "매장 경도", example = "127.123456")
    private Double storeLng;

    @Schema(description = "매장 이미지 URL", example = "https://example.com/store.jpg")
    private String storeImageUrl;

    @Schema(description = "매장 로고 URL", example = "https://example.com/logo.png")
    private String storeLogoUrl;

    @Schema(description = "매장 앱 링크 (딥링크 또는 외부 URL)", example = "https://app.example.com/store/10")
    private String storeAppLink;

    @Schema(description = "브랜드 ID", example = "3")
    private Long brandId;

    @Schema(description = "브랜드 이름", example = "스타벅스")
    private String brandName;

    @Schema(description = "브랜드 이미지 URL", example = "https://example.com/brand.jpg")
    private String brandImageUrl;

    @Schema(description = "해당 매장 찜 여부", example = "true")
    private Boolean isStoreWished;

    @Schema(description = "해당 브랜드 찜 여부", example = "false")
    private Boolean isBrandWished;
}