package com.benepicker.map.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.benepicker.map.dto.response.MapBenefitResponse;
import com.benepicker.map.dto.response.MapMarkerResponse;
import com.benepicker.map.dto.response.MapSelectedCardResponse;

@Mapper
public interface MapMapper {

    List<MapMarkerResponse> findNearbyStores(
            @Param("memberNo") Long memberNo,
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm
    );

    MapSelectedCardResponse findSelectedStoreCard(
            @Param("memberNo") Long memberNo,
            @Param("storeId") Long storeId,
            @Param("lat") double lat,
            @Param("lng") double lng
    );

    List<MapBenefitResponse> findStoreBenefits(@Param("storeId") Long storeId);

    void increaseViewCount(@Param("storeId") Long storeId);
}