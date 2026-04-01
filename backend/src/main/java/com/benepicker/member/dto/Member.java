package com.benepicker.member.dto;

import java.time.LocalDateTime;

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

    private Long memberNo;
    private String memberEmail;
    private String memberPw;
    private String memberNickname;
    private String memberTel;
    private String profileImg;
    private String memberDelFl;
    private LocalDateTime enrollDate;
}
