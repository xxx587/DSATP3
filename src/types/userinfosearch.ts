/**
 * @file userinfosearch.ts
 * @description 아이디/비밀번호 찾기 등 사용자 정보 검색과 관련된 데이터 구조를 정의하기 위한 파일
 */

/** @description 사용자 정보 검색 폼 데이터 */
export interface UserInfoSearchForm {
	email: string;
	password: string;
	passwordConfirm: string;
}

/** @description 사용자 정보 검색 폼 에러 메시지 타입 */
export type UserInfoSearchErrors = Record<keyof UserInfoSearchForm, string>;

/** @description 사용자 정보 검색 폼 성공 메시지 타입 */
export type UserInfoSearchSuccess = Pick<UserInfoSearchForm, 'email'>;

/** @description 사용자 정보 검색 중복 확인 상태 타입 */
export type UserInfoSearchCheckStatus = Record<'email', boolean>;
