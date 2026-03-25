package com.benepicker.benefit.dto.response;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BenefitDetailResponse {

    private Long benefitId;
    private String benefitType;
    private String benefitContent;
    private Integer benefitDiscount;
    private String benefitCondition;
    private LocalDate startDate;
    private LocalDate endDate;

    private Long storeId;
    private String storeName;
    private String storeAddress;
    private Double storeLat;
    private Double storeLng;
    private String storeImageUrl;
    private String storeLogoUrl;
    private String storeAppLink;

    private Long brandId;
    private String brandName;
    private String brandImageUrl;

    private Boolean isStoreWished;
    private Boolean isBrandWished;
}