package com.benepicker.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    private String memberEmail;
    private String memberPw;
    private String memberNickname;
    private String memberTel;
    private String memberCarrier;
}