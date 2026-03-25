package com.benepicker.benefit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.benepicker.benefit.dto.response.BenefitDetailResponse;
import com.benepicker.benefit.service.BenefitService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/benefits")
@RequiredArgsConstructor
public class BenefitController {

    private final BenefitService benefitService;

    @GetMapping("/{benefitId}")
    public ResponseEntity<BenefitDetailResponse> getBenefitDetail(
            @PathVariable("benefitId") Long benefitId,
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        BenefitDetailResponse response = benefitService.getBenefitDetail(benefitId, memberNo);
        return ResponseEntity.ok(response);
    }
}