package com.benepicker.member.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberInfoResponse {
    private Long memberNo;
    private String memberEmail;
    private String memberNickname;
    private String memberName;
    private String memberTel;
    private String profileImageUrl;
    private String birthDate;
    private String gender;
    private String privacyAgreeFl;
    private String marketingAgreeFl;
}