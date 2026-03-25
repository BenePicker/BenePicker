package com.benepicker.wish.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.benepicker.wish.service.WishService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wishes")
@RequiredArgsConstructor
@Tag(name = "Wish", description = "찜(관심 매장/브랜드) 관련 API")
public class WishController {

    private final WishService wishService;

    @Operation(
            summary = "매장 찜 등록",
            description = "로그인한 사용자가 특정 매장을 찜 목록에 추가합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "매장 찜 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 이미 찜한 매장"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 매장")
    })
    @PostMapping("/stores/{storeId}")
    public ResponseEntity<Void> addStoreWish(
            @Parameter(description = "찜할 매장 ID", example = "1")
            @PathVariable("storeId") Long storeId,

            @Parameter(hidden = true)
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.addStoreWish(memberNo, storeId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "매장 찜 해제",
            description = "로그인한 사용자가 특정 매장을 찜 목록에서 삭제합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "매장 찜 해제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 매장 또는 찜 내역 없음")
    })
    @DeleteMapping("/stores/{storeId}")
    public ResponseEntity<Void> deleteStoreWish(
            @Parameter(description = "찜 해제할 매장 ID", example = "1")
            @PathVariable("storeId") Long storeId,

            @Parameter(hidden = true)
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.deleteStoreWish(memberNo, storeId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "브랜드 찜 등록",
            description = "로그인한 사용자가 특정 브랜드를 찜 목록에 추가합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "브랜드 찜 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 이미 찜한 브랜드"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 브랜드")
    })
    @PostMapping("/brands/{brandId}")
    public ResponseEntity<Void> addBrandWish(
            @Parameter(description = "찜할 브랜드 ID", example = "1")
            @PathVariable("brandId") Long brandId,

            @Parameter(hidden = true)
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.addBrandWish(memberNo, brandId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "브랜드 찜 해제",
            description = "로그인한 사용자가 특정 브랜드를 찜 목록에서 삭제합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "브랜드 찜 해제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 브랜드 또는 찜 내역 없음")
    })
    @DeleteMapping("/brands/{brandId}")
    public ResponseEntity<Void> deleteBrandWish(
            @Parameter(description = "찜 해제할 브랜드 ID", example = "1")
            @PathVariable("brandId") Long brandId,

            @Parameter(hidden = true)
            @AuthenticationPrincipal(expression = "memberNo") Long memberNo
    ) {
        wishService.deleteBrandWish(memberNo, brandId);
        return ResponseEntity.ok().build();
    }
}