package com.benepicker.home.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.benepicker.auth.dto.CustomUserDetails;
import com.benepicker.home.dto.response.HomeNearbyResponse;
import com.benepicker.home.service.HomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/benefits/nearby")
    public ResponseEntity<HomeNearbyResponse> getNearbyBenefits(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "3000") int radius
    ) {
        Long memberNo = (user != null) ? user.getMemberNo() : null;

        HomeNearbyResponse response =
                homeService.getNearbyBenefits(memberNo, latitude, longitude, radius);

        return ResponseEntity.ok(response);
    }
}