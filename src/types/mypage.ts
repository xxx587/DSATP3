/**
 * @file mypage.ts
 * @description 마이페이지 및 회원 정보 수정과 관련된 데이터 구조를 정의하기 위한 파일
 */

/** @description 정보 수정 폼 타입 */
export interface MyPageForm {
	currentPassword: string;
	newPassword: string;
	passwordConfirm: string;
}

/** @description 백엔드에 보낼 폼 데이터 */
export type RegisterRequest = Omit<MyPageForm, 'passwordConfirm'>;

/** @description 정보 수정 폼 에러 메시지 타입 */
export type MyPageErrors = Record<keyof Omit<MyPageForm, 'currentPassword'>, string>;

/** @description 유저 기본 정보 타입 */
export interface UserInfo {
	username: string;
	nickname: string;
	countryCode: number;
	email: string;
}

/** @description useMyPageForm 훅의 반환 타입 */
export interface UseMyPageFormReturn {
	userInfo: UserInfo;
	formData: MyPageForm;
	errors: MyPageErrors;
	isPasswordMatch: boolean;
	isConfirmEmpty: boolean;
	back: () => void;
	del: () => Promise<void>;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
}
