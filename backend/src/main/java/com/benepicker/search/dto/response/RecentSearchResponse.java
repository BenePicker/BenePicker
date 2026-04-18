package com.benepicker.search.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "최근 검색어 응답 DTO")
public class RecentSearchResponse {

    @Schema(description = "검색 기록 ID", example = "1")
    private Long searchId;

    @Schema(description = "검색어", example = "스타벅스")
    private String keyword;

    @Schema(description = "검색일시", example = "2026-03-31T21:15:30")
    private LocalDateTime searchDate;
}