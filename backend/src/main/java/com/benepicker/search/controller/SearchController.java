package com.benepicker.search.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.benepicker.common.auth.dto.CustomUserDetails;
import com.benepicker.search.dto.response.RecentSearchResponse;
import com.benepicker.search.dto.response.SearchResultResponse;
import com.benepicker.search.service.SearchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "검색 및 최근 검색어 관련 API")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    @Operation(
            summary = "키워드 검색",
            description = """
					매장명, 브랜드명, 혜택 내용, 혜택 조건을 기준으로 검색합니다.
					로그인한 사용자의 경우 검색 시 최근 검색어가 저장됩니다.
					비회원도 검색은 가능하지만 검색 기록은 저장되지 않습니다.
					"""
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "검색 성공",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = SearchResultResponse.class)))
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청값")
    })
    public ResponseEntity<List<SearchResultResponse>> search(
            @Parameter(
                    description = "검색 키워드",
                    example = "스타벅스",
                    required = true
            )
            @RequestParam String keyword,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberNo = userDetails != null ? userDetails.getMemberNo() : null;
        return ResponseEntity.ok(searchService.search(keyword, memberNo));
    }

    @GetMapping("/history")
    @Operation(
            summary = "최근 검색어 조회",
            description = "로그인한 사용자의 최근 검색어 목록을 최신순으로 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "최근 검색어 조회 성공",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = RecentSearchResponse.class)))
            ),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음")
    })
    public ResponseEntity<List<RecentSearchResponse>> getRecentSearches(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(searchService.getRecentSearches(userDetails.getMemberNo()));
    }

    @DeleteMapping("/history/{searchId}")
    @Operation(
            summary = "최근 검색어 개별 삭제",
            description = "로그인한 사용자의 특정 최근 검색어 1건을 삭제합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "본인 검색 기록만 삭제 가능"),
            @ApiResponse(responseCode = "404", description = "검색 기록을 찾을 수 없음")
    })
    public ResponseEntity<Void> deleteRecentSearch(
            @Parameter(description = "삭제할 검색 기록 ID", example = "1", required = true)
            @PathVariable Long searchId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        searchService.deleteRecentSearch(searchId, userDetails.getMemberNo());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/history")
    @Operation(
            summary = "최근 검색어 전체 삭제",
            description = "로그인한 사용자의 최근 검색어를 전체 삭제합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "전체 삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음")
    })
    public ResponseEntity<Void> deleteAllRecentSearches(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        searchService.deleteAllRecentSearches(userDetails.getMemberNo());
        return ResponseEntity.noContent().build();
    }
}