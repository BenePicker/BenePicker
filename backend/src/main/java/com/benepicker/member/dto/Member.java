package com.benepicker.member.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    private int    memberNo;
    private String memberEmail;
    private String memberPw;
    private String memberNickname;
    private String memberTel;
    private String profileImg;
    private String memberDelFl;
    private String enrollDate;
}
