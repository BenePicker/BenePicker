package com.benepicker.wish.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benepicker.wish.mapper.WishMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WishServiceImpl implements WishService {

    private final WishMapper wishMapper;

    @Override
    public void addStoreWish(Long memberNo, Long storeId) {
        validateMemberNo(memberNo);

        int exists = wishMapper.existsStoreWish(memberNo, storeId);
        if (exists > 0) {
            return;
        }

        wishMapper.insertStoreWish(memberNo, storeId);
    }

    @Override
    public void deleteStoreWish(Long memberNo, Long storeId) {
        validateMemberNo(memberNo);
        wishMapper.deleteStoreWish(memberNo, storeId);
    }

    @Override
    public void addBrandWish(Long memberNo, Long brandId) {
        validateMemberNo(memberNo);

        int exists = wishMapper.existsBrandWish(memberNo, brandId);
        if (exists > 0) {
            return;
        }

        wishMapper.insertBrandWish(memberNo, brandId);
    }

    @Override
    public void deleteBrandWish(Long memberNo, Long brandId) {
        validateMemberNo(memberNo);
        wishMapper.deleteBrandWish(memberNo, brandId);
    }

    private void validateMemberNo(Long memberNo) {
        if (memberNo == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
    }
}