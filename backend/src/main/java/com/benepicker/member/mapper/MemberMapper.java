package com.benepicker.member.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.benepicker.member.dto.Member;

@Mapper
public interface MemberMapper {

    Member findByEmail(String memberEmail);

    int signup(Member member);

    int checkEmail(String memberEmail);

    int checkNickname(String memberNickname);
}
