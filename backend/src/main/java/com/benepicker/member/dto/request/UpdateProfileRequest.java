package com.benepicker.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "프로필 수정 요청")
public class UpdateProfileRequest {

    @Schema(description = "닉네임", example = "혜택왕")
    private String memberNickname;

    @Schema(description = "이름", example = "이정환")
    private String memberName;

    @Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.png")
    private String profileImageUrl;
}