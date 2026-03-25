/**
 * @file cookie.ts
 * @description JWT 토큰 및 쿠키 관련 데이터 구조를 정의하기 위한 파일
 */

/** @description JWT 토큰 데이터 타입(Spring 백엔드에서 JTW 구조 수정 가능) */
export interface JwtPayload {
	sub: string; // 아이디
	nickname: string; // 닉네임
	countryCode: number; // 국가 코드
	email: string; // 이메일
	iat: number; // 발급 시간
	exp: number; // 만료 시간
}
