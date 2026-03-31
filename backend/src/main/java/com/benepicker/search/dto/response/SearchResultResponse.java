package com.benepicker.search.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "검색 결과 응답 DTO")
public class SearchResultResponse {

    @Schema(description = "매장 ID", example = "101")
    private Long storeId;

    @Schema(description = "매장명", example = "스타벅스 성수점")
    private String storeName;

    @Schema(description = "매장 주소", example = "서울특별시 성동구 성수동 1가")
    private String storeAddress;

    @Schema(description = "매장 위도", example = "37.5445")
    private Double storeLat;

    @Schema(description = "매장 경도", example = "127.0557")
    private Double storeLng;

    @Schema(description = "매장 이미지 URL", example = "https://example.com/store.jpg")
    private String storeImageUrl;

    @Schema(description = "브랜드 ID", example = "12")
    private Long brandId;

    @Schema(description = "브랜드명", example = "스타벅스")
    private String brandName;

    @Schema(description = "브랜드 이미지 URL", example = "https://example.com/brand.jpg")
    private String brandImageUrl;

    @Schema(description = "혜택 ID", example = "1001")
    private Long benefitId;

    @Schema(description = "혜택 유형", example = "DISCOUNT")
    private String benefitType;

    @Schema(description = "혜택 내용", example = "아메리카노 20% 할인")
    private String benefitContent;

    @Schema(description = "할인율 또는 할인값", example = "20")
    private Integer benefitDiscount;

    @Schema(description = "혜택 조건", example = "멤버십 회원 한정")
    private String benefitCondition;
}