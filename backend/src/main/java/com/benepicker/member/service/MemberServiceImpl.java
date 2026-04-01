package com.benepicker.member.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benepicker.common.util.JwtUtil;
import com.benepicker.member.dto.Member;
import com.benepicker.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    @Override
    public Map<String, String> login(String memberEmail, String memberPw) {
        Member member = memberMapper.findByEmail(memberEmail);

        if (member == null || !encoder.matches(memberPw, member.getMemberPw())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String memberId = String.valueOf(member.getMemberNo());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken",  jwtUtil.generateAccessToken(memberId));
        tokens.put("refreshToken", jwtUtil.generateRefreshToken(memberId));
        return tokens;
    }

    @Override
    public int signup(Member member) {
        member.setMemberPw(encoder.encode(member.getMemberPw()));
        return memberMapper.signup(member);
    }

    @Override
    public int checkEmail(String memberEmail) {
        return memberMapper.checkEmail(memberEmail);
    }

    @Override
    public int checkNickname(String memberNickname) {
        return memberMapper.checkNickname(memberNickname);
    }
}
