package com.benepicker.member.service;

import java.util.Map;

import com.benepicker.member.dto.Member;
import com.benepicker.member.dto.request.UpdatePasswordRequest;
import com.benepicker.member.dto.request.UpdatePrivacyRequest;
import com.benepicker.member.dto.request.UpdateProfileRequest;
import com.benepicker.member.dto.response.MemberInfoResponse;

public interface MemberService {

    Map<String, String> login(String memberEmail, String memberPw);
    MemberInfoResponse getMyInfo(Long memberNo);

    int signup(Member member);

    int checkEmail(String memberEmail);

    int checkNickname(String memberNickname);

    void updateProfile(Long memberNo, UpdateProfileRequest request);

    void updatePassword(Long memberNo, UpdatePasswordRequest request);

    void updatePrivacy(Long memberNo, UpdatePrivacyRequest request);

}
