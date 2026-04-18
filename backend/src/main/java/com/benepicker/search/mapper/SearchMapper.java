package com.benepicker.search.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.benepicker.search.dto.response.RecentSearchResponse;
import com.benepicker.search.dto.response.SearchResultResponse;

@Mapper
public interface SearchMapper {

    List<SearchResultResponse> searchByKeyword(@Param("keyword") String keyword);

    void insertSearchHistory(
            @Param("memberNo") Long memberNo,
            @Param("keyword") String keyword
    );

    List<RecentSearchResponse> findRecentSearches(@Param("memberNo") Long memberNo);

    void deleteRecentSearch(
            @Param("searchId") Long searchId,
            @Param("memberNo") Long memberNo
    );

    void deleteAllRecentSearches(@Param("memberNo") Long memberNo);
}