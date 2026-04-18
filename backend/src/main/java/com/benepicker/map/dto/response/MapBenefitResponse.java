package com.benepicker.map.dto.response;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "매장 혜택 정보")
public class MapBenefitResponse {

    @Schema(description = "혜택 ID", example = "10")
    private Long benefitId;

    @Schema(description = "혜택 유형", example = "CARD")
    private String benefitType;

    @Schema(description = "혜택 내용", example = "아메리카노 10% 할인")
    private String benefitContent;

    @Schema(description = "할인율 또는 할인 금액", example = "10")
    private Integer benefitDiscount;

    @Schema(description = "혜택 조건", example = "OO카드 결제 시")
    private String benefitCondition;

    @Schema(description = "혜택 시작일", example = "2026-04-01")
    private LocalDate startDate;

    @Schema(description = "혜택 종료일", example = "2026-04-30")
    private LocalDate endDate;
}