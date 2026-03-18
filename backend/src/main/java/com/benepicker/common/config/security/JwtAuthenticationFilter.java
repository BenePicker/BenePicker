package com.benepicker.common.config.security;

import java.io.IOException;

import com.benepicker.common.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.benepicker.auth.dto.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil; // 너가 만든 JWT 유틸

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        // 1. 토큰 없으면 그냥 통과
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. 토큰 추출
        String token = authorization.substring(7);

        // 3. 토큰 유효성 검사
        if (!jwtUtil.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. 토큰에서 정보 추출
        Long memberNo = jwtUtil.getMemberNo(token);
        String email = jwtUtil.getEmail(token);

        CustomUserDetails userDetails =
                new CustomUserDetails(memberNo, email, "");

        var authentication =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 5. 다음 필터 진행
        filterChain.doFilter(request, response);
    }
}