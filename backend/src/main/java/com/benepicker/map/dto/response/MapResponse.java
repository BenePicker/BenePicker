package com.benepicker.map.dto.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "지도 화면 전체 응답")
public class MapResponse {

    @Schema(description = "현재 사용자 위도", example = "37.5665")
    private Double currentLat;

    @Schema(description = "현재 사용자 경도", example = "126.9780")
    private Double currentLng;

    @Schema(description = "주변 매장 마커 목록")
    private List<MapMarkerResponse> markers;

    @Schema(description = "선택한 매장 카드 정보, 선택한 매장이 없으면 null")
    private MapSelectedCardResponse selectedCard;
}