package com.benepicker.member.mapper;

import com.benepicker.member.dto.request.UpdatePrivacyRequest;
import com.benepicker.member.dto.request.UpdateProfileRequest;
import com.benepicker.member.dto.response.MemberInfoResponse;
import org.apache.ibatis.annotations.Mapper;

import com.benepicker.member.dto.Member;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {

    int insertMember(Member member);

    Member findByEmail(@Param("memberEmail") String memberEmail);

    int checkNickname(@Param("memberNickname") String memberNickname);

    int checkEmail(@Param("memberEmail") String memberEmail);

    MemberInfoResponse selectMemberInfo(@Param("memberNo") Long memberNo);

    String selectPasswordByMemberNo(@Param("memberNo") Long memberNo);

    int updateProfile(@Param("memberNo") Long memberNo, @Param("request") UpdateProfileRequest request);

    int updatePassword(@Param("memberNo") Long memberNo, @Param("newPassword") String newPassword);

    int updatePrivacy(@Param("memberNo") Long memberNo, @Param("request") UpdatePrivacyRequest request);
}