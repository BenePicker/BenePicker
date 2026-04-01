package com.benepicker.member.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateProfileRequest {
    private String memberNickname;
    private String memberName;
    private String profileImageUrl;
}