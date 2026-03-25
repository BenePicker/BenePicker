package com.benepicker.home.dto.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "주변 혜택 조회 응답")
public class HomeNearbyResponse {

    @Schema(description = "현재 위치 위도", example = "37.3595704")
    private Double currentLatitude;

    @Schema(description = "현재 위치 경도", example = "127.105399")
    private Double currentLongitude;

    @Schema(description = "조회된 혜택 개수", example = "3")
    private Integer count;

    @Schema(description = "주변 혜택 리스트")
    private List<NearbyBenefitResponse> benefits;
}