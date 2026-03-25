package com.benepicker.wish.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.benepicker.wish.service.WishService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wishes")
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;

    @PostMapping("/stores/{storeId}")
    public ResponseEntity<Void> addStoreWish(
            @PathVariable("storeId") Long storeId,
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.addStoreWish(memberNo, storeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/stores/{storeId}")
    public ResponseEntity<Void> deleteStoreWish(
            @PathVariable("storeId") Long storeId,
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.deleteStoreWish(memberNo, storeId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/brands/{brandId}")
    public ResponseEntity<Void> addBrandWish(
            @PathVariable("brandId") Long brandId,
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.addBrandWish(memberNo, brandId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/brands/{brandId}")
    public ResponseEntity<Void> deleteBrandWish(
            @PathVariable("brandId") Long brandId,
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.deleteBrandWish(memberNo, brandId);
        return ResponseEntity.ok().build();
    }
}