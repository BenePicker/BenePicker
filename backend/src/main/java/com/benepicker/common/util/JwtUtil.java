package com.benepicker.common.util;

import java.util.Date;

import javax.crypto.SecretKey;

import com.benepicker.member.dto.Member;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessExpiration;
    private final long refreshExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") long accessExpiration,
            @Value("${jwt.refresh-expiration}") long refreshExpiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessExpiration = accessExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    public String generateAccessToken(Member member) {
        return Jwts.builder()
                .subject(member.getMemberEmail())
                .claim("memberNo", member.getMemberNo())
                .claim("email", member.getMemberEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(Member member) {
        return Jwts.builder()
                .subject(member.getMemberEmail())
                .claim("memberNo", member.getMemberNo())
                .claim("email", member.getMemberEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isValid(String token) {
        return validateToken(token);
    }

    public String getEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    public String getMemberId(String token) {
        return getClaims(token).getSubject();
    }

    public Long getMemberNo(String token) {
        return getClaims(token).get("memberNo", Long.class);
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}