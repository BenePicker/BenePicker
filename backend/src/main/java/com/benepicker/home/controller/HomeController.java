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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
@Tag(name = "Home", description = "홈 화면 관련 API")
public class HomeController {

    private final HomeService homeService;

    @Operation(
            summary = "주변 혜택 조회",
            description = """
            현재 사용자 위치(위도, 경도)를 기준으로 반경 내 혜택 목록을 조회합니다.
                        
            - 비로그인 사용자도 호출할 수 있습니다.
            - 로그인 사용자의 경우 찜 여부(isLiked) 정보도 함께 반환합니다.
            - 기본 반경은 3000m입니다.
            """
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "주변 혜택 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = HomeNearbyResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 파라미터"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 내부 오류"
            )
    })
    @GetMapping("/benefits/nearby")
    public ResponseEntity<HomeNearbyResponse> getNearbyBenefits(

            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails user,

            @Parameter(
                    description = "현재 위치의 위도",
                    example = "37.3595704",
                    required = true
            )
            @RequestParam double latitude,

            @Parameter(
                    description = "현재 위치의 경도",
                    example = "127.105399",
                    required = true
            )
            @RequestParam double longitude,

            @Parameter(
                    description = "조회 반경(m). 기본값은 3000",
                    example = "3000"
            )
            @RequestParam(defaultValue = "3000") int radius
    ) {
        Long memberNo = (user != null) ? user.getMemberNo() : null;

        HomeNearbyResponse response =
                homeService.getNearbyBenefits(memberNo, latitude, longitude, radius);

        return ResponseEntity.ok(response);
    }
}