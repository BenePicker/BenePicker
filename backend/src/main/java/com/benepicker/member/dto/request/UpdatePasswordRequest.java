package com.benepicker.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "비밀번호 변경 요청")
public class UpdatePasswordRequest {

    @Schema(description = "현재 비밀번호", example = "oldPassword123!")
    private String currentPassword;

    @Schema(description = "새 비밀번호", example = "newPassword123!")
    private String newPassword;
}