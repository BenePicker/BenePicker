package com.benepicker.benefit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.benepicker.benefit.dto.response.BenefitDetailResponse;
import com.benepicker.benefit.service.BenefitService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/benefits")
@RequiredArgsConstructor
@Tag(name = "Benefit", description = "혜택 관련 API")
public class BenefitController {

    private final BenefitService benefitService;

    @Operation(
            summary = "혜택 상세 조회",
            description = "특정 혜택의 상세 정보를 조회합니다. 로그인 사용자인 경우 찜 여부 등 개인화 정보가 함께 포함될 수 있습니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "혜택 상세 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 혜택")
    })
    @GetMapping("/{benefitId}")
    public ResponseEntity<BenefitDetailResponse> getBenefitDetail(
            @Parameter(description = "조회할 혜택 ID", example = "1")
            @PathVariable("benefitId") Long benefitId,

            @Parameter(hidden = true)
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        BenefitDetailResponse response = benefitService.getBenefitDetail(benefitId, memberNo);
        return ResponseEntity.ok(response);
    }
}