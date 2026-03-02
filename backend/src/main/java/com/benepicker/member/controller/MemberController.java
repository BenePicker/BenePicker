package com.benepicker.member.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.benepicker.member.dto.Member;
import com.benepicker.member.service.MemberService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        Map<String, String> tokens = memberService.login(
            body.get("memberEmail"),
            body.get("memberPw")
        );
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Member member) {
        int result = memberService.signup(member);
        return result > 0
            ? ResponseEntity.ok("회원가입 성공")
            : ResponseEntity.badRequest().body("회원가입 실패");
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String memberEmail) {
        int count = memberService.checkEmail(memberEmail);
        return ResponseEntity.ok(Map.of("available", count == 0));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String memberNickname) {
        int count = memberService.checkNickname(memberNickname);
        return ResponseEntity.ok(Map.of("available", count == 0));
    }
}
