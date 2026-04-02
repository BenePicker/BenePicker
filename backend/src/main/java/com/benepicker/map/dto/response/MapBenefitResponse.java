package com.benepicker.map.dto.response;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MapBenefitResponse {
    private Long benefitId;
    private String benefitType;
    private String benefitContent;
    private Integer benefitDiscount;
    private String benefitCondition;
    private LocalDate startDate;
    private LocalDate endDate;
}