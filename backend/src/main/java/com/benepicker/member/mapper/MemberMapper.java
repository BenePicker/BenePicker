package com.benepicker.member.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.benepicker.member.dto.Member;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {

    int insertMember(Member member);

    Member findByEmail(@Param("memberEmail") String memberEmail);

    int existsByEmail(@Param("memberEmail") String memberEmail);

    int checkNickname(@Param("memberNickname") String memberNickname);

    int checkEmail(@Param("memberEmail") String memberEmail);

}