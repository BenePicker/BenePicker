package com.benepicker.member.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.benepicker.common.util.JwtUtil;
import com.benepicker.member.dto.request.UpdatePasswordRequest;
import com.benepicker.member.dto.request.UpdatePrivacyRequest;
import com.benepicker.member.dto.request.UpdateProfileRequest;
import com.benepicker.member.dto.response.MemberInfoResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benepicker.member.dto.Member;
import com.benepicker.member.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {

    private static final Set<String> ALLOWED_CARRIERS = Set.of("SKT", "KT", "LGU", "MVNO");

    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> login(String memberEmail, String memberPw) {
        Member member = memberMapper.findByEmail(memberEmail);

        if (member == null) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        if ("Y".equals(member.getMemberDelFl())) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        if (!passwordEncoder.matches(memberPw, member.getMemberPw())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(member);
        String refreshToken = jwtUtil.generateRefreshToken(member);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
    }

    @Override
    public int signup(Member member) {
        if (member.getMemberEmail() == null || member.getMemberEmail().isBlank()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }

        if (member.getMemberPw() == null || member.getMemberPw().isBlank()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        if (member.getMemberNickname() == null || member.getMemberNickname().isBlank()) {
            throw new IllegalArgumentException("닉네임은 필수입니다.");
        }

        if (member.getMemberTel() == null || member.getMemberTel().isBlank()) {
            throw new IllegalArgumentException("전화번호는 필수입니다.");
        }

        if (member.getMemberCarrier() == null || member.getMemberCarrier().isBlank()) {
            throw new IllegalArgumentException("통신사는 필수입니다.");
        }

        if (!ALLOWED_CARRIERS.contains(member.getMemberCarrier())) {
            throw new IllegalArgumentException("지원하지 않는 통신사입니다.");
        }

        if (memberMapper.checkEmail(member.getMemberEmail()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (memberMapper.checkNickname(member.getMemberNickname()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        member.setMemberPw(passwordEncoder.encode(member.getMemberPw()));

        return memberMapper.insertMember(member);
    }

    @Override
    @Transactional(readOnly = true)
    public int checkEmail(String memberEmail) {
        return memberMapper.checkEmail(memberEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public int checkNickname(String memberNickname) {
        return memberMapper.checkNickname(memberNickname);
    }

    @Override
    @Transactional(readOnly = true)
    public MemberInfoResponse getMyInfo(Long memberNo) {
        return memberMapper.selectMemberInfo(memberNo);
    }

    @Override
    public void updateProfile(Long memberNo, UpdateProfileRequest request) {
        memberMapper.updateProfile(memberNo, request);
    }

    @Override
    public void updatePassword(Long memberNo, UpdatePasswordRequest request) {
        String encodedPassword = memberMapper.selectPasswordByMemberNo(memberNo);

        if (!passwordEncoder.matches(request.getCurrentPassword(), encodedPassword)) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        String newEncodedPassword = passwordEncoder.encode(request.getNewPassword());
        memberMapper.updatePassword(memberNo, newEncodedPassword);
    }

    @Override
    public void updatePrivacy(Long memberNo, UpdatePrivacyRequest request) {
        memberMapper.updatePrivacy(memberNo, request);
    }
}