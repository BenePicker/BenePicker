package com.benepicker.home.service;

import com.benepicker.home.dto.response.HomeNearbyResponse;

public interface HomeService {

    HomeNearbyResponse getNearbyBenefits(Long memberNo, double latitude, double longitude, int radius);
}