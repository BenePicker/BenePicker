package com.benepicker.search.service;

import java.util.List;

import com.benepicker.search.dto.response.RecentSearchResponse;
import com.benepicker.search.dto.response.SearchResultResponse;

public interface SearchService {

    List<SearchResultResponse> search(String keyword, Long memberNo);

    List<RecentSearchResponse> getRecentSearches(Long memberNo);

    void deleteRecentSearch(Long searchId, Long memberNo);

    void deleteAllRecentSearches(Long memberNo);
}