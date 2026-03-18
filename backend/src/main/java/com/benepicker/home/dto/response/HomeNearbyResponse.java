package com.benepicker.home.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HomeNearbyResponse {

    private Double currentLatitude;
    private Double currentLongitude;
    private Integer count;
    private List<NearbyBenefitResponse> benefits;
}