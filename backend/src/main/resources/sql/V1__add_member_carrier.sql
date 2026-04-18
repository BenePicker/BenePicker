-- ============================================================
-- MEMBER 테이블에 통신사(MEMBER_CARRIER) 컬럼 추가
-- ============================================================
-- DB       : PostgreSQL
-- 목적     : 회원가입 시 통신사 정보(SKT/KT/LGU/MVNO) 저장
-- 실행방법 : psql 또는 DB 툴에서 파일 전체를 그대로 실행
-- 멱등성   : 몇 번 실행해도 에러 없음 (IF NOT EXISTS / DO 블록으로 중복 체크)
--
-- 실행 순서:
--   1) MEMBER_CARRIER 컬럼 생성 (이미 있으면 스킵)
--   2) CK_MEMBER_CARRIER 제약 생성 (이미 있으면 스킵)
--   3) 컬럼 설명(코멘트) 등록
--   4) (주석 처리된) 적용 확인용 SELECT
-- ============================================================


-- ------------------------------------------------------------
-- 1) 컬럼 추가
-- ------------------------------------------------------------
-- • MEMBER 테이블에 MEMBER_CARRIER 라는 새 컬럼을 생성한다.
-- • 타입: VARCHAR(10)
--   - 실제 enum 값(SKT/KT/LGU/MVNO)은 최대 4자이지만 여유분 확보.
-- • NULL 허용(기본값):
--   - 기존 회원 데이터는 carrier 값이 없으므로 NULL 로 채워진다.
--   - 신규 회원은 백엔드 서비스 계층(MemberServiceImpl.signup)에서 필수값 검증.
-- • IF NOT EXISTS
--   - 이미 컬럼이 있으면 에러 없이 건너뛴다 (재실행 안전).
-- ------------------------------------------------------------
ALTER TABLE MEMBER
    ADD COLUMN IF NOT EXISTS MEMBER_CARRIER VARCHAR(10);


-- ------------------------------------------------------------
-- 2) CHECK 제약 추가
-- ------------------------------------------------------------
-- • 허용값을 DB 레벨에서도 강제해 잘못된 값이 들어가는 것을 막는다.
-- • 허용값: SKT / KT / LGU / MVNO
--   (프론트 표시명 SKT / KT / LG U+ / 알뜰폰 → 전송 시 코드로 변환)
-- • NULL 도 허용:
--   - 기존 회원 데이터가 NULL 상태이므로 호환 위해 허용.
-- • DO 블록으로 감싼 이유:
--   - PostgreSQL 의 ADD CONSTRAINT 는 IF NOT EXISTS 문법이 없다.
--   - pg_constraint 시스템 카탈로그를 조회해서 "없을 때만 추가" 처리.
-- • $$ ... $$ 는 PostgreSQL 의 익명 프로시저 블록 (SQL 안에서 IF 같은 제어문 사용).
-- ------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ck_member_carrier'
          AND conrelid = 'member'::regclass
    ) THEN
        ALTER TABLE MEMBER
            ADD CONSTRAINT CK_MEMBER_CARRIER
            CHECK (MEMBER_CARRIER IS NULL
                   OR MEMBER_CARRIER IN ('SKT', 'KT', 'LGU', 'MVNO'));
    END IF;
END
$$;


-- ------------------------------------------------------------
-- 3) 컬럼 설명(코멘트) 등록
-- ------------------------------------------------------------
-- • DBeaver / pgAdmin 같은 DB 툴에서 컬럼 설명으로 표시된다.
-- • 동작에는 영향 없음 — 문서화 용도.
-- ------------------------------------------------------------
COMMENT ON COLUMN MEMBER.MEMBER_CARRIER IS
    '통신사 코드 (SKT/KT/LGU/MVNO). 기존 회원은 NULL 허용, 신규 가입 시 필수.';


-- ============================================================
-- 4) 적용 확인용 쿼리 (필요할 때만 주석 해제 후 실행)
-- ============================================================
-- [컬럼 생성 확인]
--   결과가 1줄 나오면 OK.
--   data_type = 'character varying', is_nullable = 'YES' 여야 정상.
-- ------------------------------------------------------------
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'member'
--   AND column_name = 'member_carrier';

-- ------------------------------------------------------------
-- [CHECK 제약 생성 확인]
--   conname = 'ck_member_carrier' 인 행이 1줄 나와야 한다.
--   pg_get_constraintdef 결과:
--     CHECK ((member_carrier IS NULL)
--            OR (member_carrier IN ('SKT', 'KT', 'LGU', 'MVNO')))
-- ------------------------------------------------------------
-- SELECT conname, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'member'::regclass
--   AND conname = 'ck_member_carrier';
