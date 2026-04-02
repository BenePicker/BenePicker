package com.benepicker.map.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MapResponse {
    private Double currentLat;
    private Double currentLng;
    private List<MapMarkerResponse> markers;
    private MapSelectedCardResponse selectedCard;
}