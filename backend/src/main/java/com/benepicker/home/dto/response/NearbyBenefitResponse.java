package com.benepicker.home.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NearbyBenefitResponse {

    private Long storeId;
    private String storeName;
    private String brandName;
    private String storeAddress;
    private Double storeLat;
    private Double storeLng;
    private String storeImageUrl;

    private Long benefitId;
    private String benefitType;
    private String benefitContent;
    private Integer benefitDiscount;
    private String benefitCondition;

    private Integer distanceMeter;
    private Boolean isLiked;
}