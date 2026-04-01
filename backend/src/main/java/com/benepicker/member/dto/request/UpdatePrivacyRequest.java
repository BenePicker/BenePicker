package com.benepicker.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@Schema(description = "개인정보 수정 요청")
public class UpdatePrivacyRequest {

    @Schema(description = "전화번호", example = "010-1234-5678")
    private String memberTel;

    @Schema(description = "생년월일", example = "2000-01-01")
    private LocalDate birthDate;

    @Schema(description = "성별", example = "MALE")
    private String gender;

    @Schema(description = "개인정보 동의 여부", example = "Y")
    private String privacyAgreeFl;

    @Schema(description = "마케팅 동의 여부", example = "N")
    private String marketingAgreeFl;
}