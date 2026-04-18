package com.benepicker.search.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benepicker.search.dto.response.RecentSearchResponse;
import com.benepicker.search.dto.response.SearchResultResponse;
import com.benepicker.search.mapper.SearchMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchServiceImpl implements SearchService {

    private final SearchMapper searchMapper;

    @Override
    @Transactional
    public List<SearchResultResponse> search(String keyword, Long memberNo) {
        if (memberNo != null && keyword != null && !keyword.isBlank()) {
            searchMapper.insertSearchHistory(memberNo, keyword.trim());
        }
        return searchMapper.searchByKeyword(keyword);
    }

    @Override
    public List<RecentSearchResponse> getRecentSearches(Long memberNo) {
        return searchMapper.findRecentSearches(memberNo);
    }

    @Override
    @Transactional
    public void deleteRecentSearch(Long searchId, Long memberNo) {
        searchMapper.deleteRecentSearch(searchId, memberNo);
    }

    @Override
    @Transactional
    public void deleteAllRecentSearches(Long memberNo) {
        searchMapper.deleteAllRecentSearches(memberNo);
    }
}