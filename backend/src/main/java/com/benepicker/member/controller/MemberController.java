package com.benepicker.member.controller;

import java.util.Map;

import com.benepicker.common.auth.dto.CustomUserDetails;
import com.benepicker.member.dto.request.UpdatePasswordRequest;
import com.benepicker.member.dto.request.UpdatePrivacyRequest;
import com.benepicker.member.dto.request.UpdateProfileRequest;
import com.benepicker.member.dto.response.MemberInfoResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.benepicker.member.dto.Member;
import com.benepicker.member.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Member", description = "회원 관련 API")
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @Operation(
            summary = "로그인",
            description = "이메일과 비밀번호를 이용해 로그인하고 토큰을 반환합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "로그인 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "accessToken": "sample-access-token",
                                              "refreshToken": "sample-refresh-token"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "로그인 실패")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "로그인 요청 정보",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class),
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "memberEmail": "test@example.com",
                                              "memberPw": "1234"
                                            }
                                            """
                            )
                    )
            )
            Map<String, String> body
    ) {
        Map<String, String> tokens = memberService.login(
                body.get("memberEmail"),
                body.get("memberPw")
        );
        return ResponseEntity.ok(tokens);
    }

    @Operation(
            summary = "회원가입",
            description = "회원 정보를 입력받아 회원가입을 진행합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "회원가입 실패")
    })
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "회원가입 정보",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "memberEmail": "test@example.com",
                                              "memberPw": "1234",
                                              "memberNickname": "정환",
                                              "memberTel": "010-1234-5678",
                                              "memberCarrier": "SKT"
                                            }
                                            """
                            )
                    )
            )
            @RequestBody Member member
    ) {
        int result = memberService.signup(member);
        return result > 0
                ? ResponseEntity.ok("회원가입 성공")
                : ResponseEntity.badRequest().body("회원가입 실패");
    }

    @Operation(
            summary = "이메일 중복 확인",
            description = "입력한 이메일의 사용 가능 여부를 확인합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "확인 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "available": true
                                            }
                                            """
                            )
                    )
            )
    })
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(
            @Parameter(description = "중복 확인할 이메일", example = "test@example.com")
            @RequestParam String memberEmail
    ) {
        int count = memberService.checkEmail(memberEmail);
        return ResponseEntity.ok(Map.of("available", count == 0));
    }

    @Operation(
            summary = "닉네임 중복 확인",
            description = "입력한 닉네임의 사용 가능 여부를 확인합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "확인 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "available": true
                                            }
                                            """
                            )
                    )
            )
    })
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(
            @Parameter(description = "중복 확인할 닉네임", example = "정환")
            @RequestParam String memberNickname
    ) {
        int count = memberService.checkNickname(memberNickname);
        return ResponseEntity.ok(Map.of("available", count == 0));
    }

    @Operation(
            summary = "내 정보 조회",
            description = """
                    로그인한 회원의 설정 정보를 조회합니다.
                    
                    조회 항목:
                    - 이메일
                    - 닉네임
                    - 이름
                    - 전화번호
                    - 프로필 이미지
                    - 생년월일
                    - 성별
                    - 개인정보 동의 여부
                    - 마케팅 동의 여부
                    """,
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "내 정보 조회 성공",
                    content = @Content(schema = @Schema(implementation = MemberInfoResponse.class))
            ),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
    })
    @GetMapping("/me")
    public ResponseEntity<MemberInfoResponse> getMyInfo(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(memberService.getMyInfo(userDetails.getMemberNo()));
    }

    @Operation(
            summary = "프로필 수정",
            description = """
                    로그인한 회원의 프로필 정보를 수정합니다.
                    
                    수정 가능 항목:
                    - 닉네임
                    - 이름
                    - 프로필 이미지 URL
                    """,
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로필 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
    })
    @PatchMapping("/me/profile")
    public ResponseEntity<Void> updateProfile(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateProfileRequest request
    ) {
        memberService.updateProfile(userDetails.getMemberNo(), request);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "비밀번호 변경",
            description = """
                    로그인한 회원의 비밀번호를 변경합니다.
                    
                    요청 값:
                    - 현재 비밀번호
                    - 새 비밀번호
                    
                    현재 비밀번호가 일치해야 변경할 수 있습니다.
                    """,
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공"),
            @ApiResponse(responseCode = "400", description = "현재 비밀번호 불일치 또는 잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
    })
    @PatchMapping("/me/password")
    public ResponseEntity<Void> updatePassword(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdatePasswordRequest request
    ) {
        memberService.updatePassword(userDetails.getMemberNo(), request);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "개인정보 수정",
            description = """
                    로그인한 회원의 개인정보를 수정합니다.
                    
                    수정 가능 항목:
                    - 전화번호
                    - 생년월일
                    - 성별
                    - 개인정보 수집 및 이용 동의 여부
                    - 마케팅 수신 동의 여부
                    """,
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "개인정보 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
    })
    @PatchMapping("/me/privacy")
    public ResponseEntity<Void> updatePrivacy(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdatePrivacyRequest request
    ) {
        memberService.updatePrivacy(userDetails.getMemberNo(), request);
        return ResponseEntity.ok().build();
    }
}