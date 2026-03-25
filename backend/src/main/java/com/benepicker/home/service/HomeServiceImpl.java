package com.benepicker.home.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benepicker.home.dto.response.HomeNearbyResponse;
import com.benepicker.home.dto.response.NearbyBenefitResponse;
import com.benepicker.home.mapper.HomeMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeServiceImpl implements HomeService {

    private final HomeMapper homeMapper;

    @Override
    public HomeNearbyResponse getNearbyBenefits(Long memberNo, double latitude, double longitude, int radius) {
        validateLocation(latitude, longitude, radius);

        List<NearbyBenefitResponse> benefits =
                homeMapper.findNearbyBenefits(memberNo, latitude, longitude, radius);

        return HomeNearbyResponse.builder()
                .currentLatitude(latitude)
                .currentLongitude(longitude)
                .count(benefits.size())
                .benefits(benefits)
                .build();
    }

    private void validateLocation(double latitude, double longitude, int radius) {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("유효하지 않은 위도입니다.");
        }

        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("유효하지 않은 경도입니다.");
        }

        if (radius <= 0 || radius > 10000) {
            throw new IllegalArgumentException("반경은 1~10000m 사이여야 합니다.");
        }
    }
}