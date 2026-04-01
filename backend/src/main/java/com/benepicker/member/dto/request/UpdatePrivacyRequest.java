package com.benepicker.member.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdatePrivacyRequest {
    private String memberTel;
    private String birthDate;
    private String gender;
    private String privacyAgreeFl;
    private String marketingAgreeFl;
}