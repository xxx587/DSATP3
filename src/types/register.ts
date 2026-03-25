/**
 * @file register.ts
 * @description 회원가입 기능과 관련된 데이터 구조 및 useRegisterForm 훅의 인터페이스를 정의하기 위한 파일
 */
import { UseRegisterLang } from './languague/lang';
/** @description 회원가입 폼 데이터 */
export interface RegisterForm {
	username: string;
	password: string;
	passwordConfirm: string;
	nickname: string;
	countryCode: number;
	email: string;
}

/** @description 백엔드에 보낼 폼 데이터 */
export type RegisterRequest = Omit<RegisterForm, 'passwordConfirm'>;

/** @description 회원가입 폼 에러 메시지 타입 */
export type RegisterErrors = Record<Exclude<keyof RegisterForm, 'countryCode'>, string>;

/** @description 회원가입 폼 성공 메시지 타입 */
export type RegisterSuccess = Pick<RegisterForm, 'username' | 'email' | 'nickname'>;

/** @description 중복 확인 상태 타입 */
export type RegisterCheckStatus = Record<'username' | 'email' | 'nickname', boolean>;

/** @description useRegisterForm 훅의 반환 타입 */
export interface UseRegisterFormReturn {
	formData: RegisterForm;
	errors: RegisterErrors;
	successMsg: RegisterSuccess;
	checkStatus: RegisterCheckStatus;
	isPasswordMatch: boolean;
	isConfirmEmpty: boolean;
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	handleCheckUsername: () => Promise<void>;
	handleCheckNickname: () => Promise<void>;
	handleCheckEmail: () => Promise<void>;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	dict: UseRegisterLang;
}
