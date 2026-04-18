package com.benepicker.member.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "회원 정보 조회 응답")
public class MemberInfoResponse {

    @Schema(description = "회원 번호", example = "1")
    private Long memberNo;

    @Schema(description = "회원 이메일", example = "test@benepicker.com")
    private String memberEmail;

    @Schema(description = "닉네임", example = "정환")
    private String memberNickname;

    @Schema(description = "이름", example = "이정환")
    private String memberName;

    @Schema(description = "전화번호", example = "010-1234-5678")
    private String memberTel;

    @Schema(description = "통신사 (SKT, KT, LGU, MVNO)", example = "SKT")
    private String memberCarrier;

    @Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.png")
    private String profileImageUrl;

    @Schema(description = "생년월일", example = "2000-01-01")
    private String birthDate;

    @Schema(description = "성별", example = "MALE")
    private String gender;

    @Schema(description = "개인정보 동의 여부", example = "Y")
    private String privacyAgreeFl;

    @Schema(description = "마케팅 동의 여부", example = "N")
    private String marketingAgreeFl;
}