package com.benepicker.wish.service;

public interface WishService {

    void addStoreWish(Long memberNo, Long storeId);

    void deleteStoreWish(Long memberNo, Long storeId);

    void addBrandWish(Long memberNo, Long brandId);

    void deleteBrandWish(Long memberNo, Long brandId);
}