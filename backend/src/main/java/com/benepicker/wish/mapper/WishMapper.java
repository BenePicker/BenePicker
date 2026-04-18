package com.benepicker.wish.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface WishMapper {

    int existsStoreWish(
            @Param("memberNo") Long memberNo,
            @Param("storeId") Long storeId
    );

    int insertStoreWish(
            @Param("memberNo") Long memberNo,
            @Param("storeId") Long storeId
    );

    int deleteStoreWish(
            @Param("memberNo") Long memberNo,
            @Param("storeId") Long storeId
    );

    int existsBrandWish(
            @Param("memberNo") Long memberNo,
            @Param("brandId") Long brandId
    );

    int insertBrandWish(
            @Param("memberNo") Long memberNo,
            @Param("brandId") Long brandId
    );

    int deleteBrandWish(
            @Param("memberNo") Long memberNo,
            @Param("brandId") Long brandId
    );
}