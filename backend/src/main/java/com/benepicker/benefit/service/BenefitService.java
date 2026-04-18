package com.benepicker.benefit.service;

import com.benepicker.benefit.dto.response.BenefitDetailResponse;

public interface BenefitService {

    BenefitDetailResponse getBenefitDetail(Long benefitId, Long memberNo);
}