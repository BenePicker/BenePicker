package com.benepicker.benefit.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.benepicker.benefit.dto.response.BenefitDetailResponse;

@Mapper
public interface BenefitMapper {

    BenefitDetailResponse selectBenefitDetail(@Param("benefitId") Long benefitId);

    int existsStoreWish(
            @Param("memberNo") Long memberNo,
            @Param("storeId") Long storeId
    );

    int existsBrandWish(
            @Param("memberNo") Long memberNo,
            @Param("brandId") Long brandId
    );
}