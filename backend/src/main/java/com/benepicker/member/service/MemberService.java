package com.benepicker.member.service;

import java.util.Map;

import com.benepicker.member.dto.Member;

public interface MemberService {

    Map<String, String> login(String memberEmail, String memberPw);

    int signup(Member member);

    int checkEmail(String memberEmail);

    int checkNickname(String memberNickname);
}
