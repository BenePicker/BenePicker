package com.benepicker.map.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MapSelectedCardResponse {
    private Long storeId;
    private String storeName;
    private String brandName;
    private String storeAddress;
    private String storeImageUrl;
    private String storeLogoUrl;
    private String storeAppLink;
    private Double distanceKm;
    private Integer viewCount;
    private Boolean wished;
    private List<MapBenefitResponse> benefits;
}