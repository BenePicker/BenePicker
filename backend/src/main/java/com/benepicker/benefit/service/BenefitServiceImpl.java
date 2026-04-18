package com.benepicker.benefit.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benepicker.benefit.dto.response.BenefitDetailResponse;
import com.benepicker.benefit.mapper.BenefitMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BenefitServiceImpl implements BenefitService {

    private final BenefitMapper benefitMapper;

    @Override
    public BenefitDetailResponse getBenefitDetail(Long benefitId, Long memberNo) {

        BenefitDetailResponse detail = benefitMapper.selectBenefitDetail(benefitId);

        if (detail == null) {
            throw new IllegalArgumentException("존재하지 않는 혜택입니다.");
        }

        boolean isStoreWished = false;
        boolean isBrandWished = false;

        if (memberNo != null) {
            if (detail.getStoreId() != null) {
                isStoreWished = benefitMapper.existsStoreWish(memberNo, detail.getStoreId()) > 0;
            }
            if (detail.getBrandId() != null) {
                isBrandWished = benefitMapper.existsBrandWish(memberNo, detail.getBrandId()) > 0;
            }
        }

        detail.setIsStoreWished(isStoreWished);
        detail.setIsBrandWished(isBrandWished);

        return detail;
    }
}