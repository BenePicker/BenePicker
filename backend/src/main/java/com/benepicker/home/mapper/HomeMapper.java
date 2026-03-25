package com.benepicker.home.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.benepicker.home.dto.response.NearbyBenefitResponse;

@Mapper
public interface HomeMapper {

    List<NearbyBenefitResponse> findNearbyBenefits(
            @Param("memberNo") Long memberNo,
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") int radius
    );
}