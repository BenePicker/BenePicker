package com.benepicker.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private Long memberNo;
    private String memberEmail;
    private String memberNickname;
}