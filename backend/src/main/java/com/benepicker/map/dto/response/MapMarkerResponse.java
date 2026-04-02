package com.benepicker.map.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MapMarkerResponse {
    private Long storeId;
    private String storeName;
    private String brandName;
    private Double storeLat;
    private Double storeLng;
    private String storeLogoUrl;
    private String benefitType;
    private String benefitSummary;
    private Double distanceKm;
    private Boolean wished;
}