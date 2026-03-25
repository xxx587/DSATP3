/**
 * @file user.ts
 * @description 사용자(User) 계정 및 인증 관련 API 요청을 처리하기 위한 함수 모듈
 * 로그인, 회원가입, 회원 탈퇴, 비밀번호 변경 및 계정 정보 중복 확인 기능을 포함
 */

import { api } from '@/lib/axios';
import { LoginForm } from '@/types/login';
import { MyPageForm } from '@/types/mypage';
import { RegisterForm, RegisterRequest } from '@/types/register';

/**
 * @description 사용자 로그인을 요청하기 위한 함수
 * @param {LoginForm} data - 사용자가 입력한 아이디와 비밀번호 정보
 * @returns {Promise<string>} 인증 성공 시 서버에서 발급한 JWT 액세스 토큰을 담은 Promise 객체
 */
export const loginFormRequest = async (data: LoginForm): Promise<string> => {
	const response = await api.post<string>('/users/login', data);
	return response.data;
};

/**
 * @description 현재 로그인한 사용자의 비밀번호를 변경하기 위한 함수
 * @param {Omit<MyPageForm, 'passwordConfirm'>} data - 기존 비밀번호 및 새 비밀번호 정보
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const changePassword = async (data: Omit<MyPageForm, 'passwordConfirm'>): Promise<void> => {
	const response = await api.put('/users/password', data);
	return response.data;
};

/**
 * @description 현재 로그인한 사용자의 계정을 영구적으로 삭제(탈퇴)하기 위한 함수
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const deleteUser = async (): Promise<void> => {
	const response = await api.delete('/users/me');
	return response.data;
};

/**
 * @description 새로운 사용자 회원가입을 요청하기 위한 함수
 * @param {RegisterRequest} data - 가입에 필요한 사용자 인적 사항 및 계정 정보
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const registerFormRequest = async (data: RegisterRequest): Promise<void> => {
	const response = await api.post('/users/register', data);
	return response.data;
};

/**
 * @description 회원가입 시 입력한 아이디의 중복 여부를 확인하기 위한 함수
 * @param {string} username - 중복 확인을 진행할 아이디 문자열
 * @returns {Promise<boolean>} 중복 여부 (true: 중복됨, false: 사용 가능)를 담은 Promise 객체
 */
export const usernameDuplicate = async (username: RegisterForm['username']): Promise<boolean> => {
	const response = await api.get<boolean>('/users/check-username', { params: { username } });
	return response.data;
};

/**
 * @description 회원가입 또는 정보 수정 시 닉네임의 중복 여부를 확인하기 위한 함수
 * @param {string} nickname - 중복 확인을 진행할 닉네임 문자열
 * @returns {Promise<boolean>} 중복 여부 (true: 중복됨, false: 사용 가능)를 담은 Promise 객체
 */
export const nicknameDuplicate = async (nickname: RegisterForm['nickname']): Promise<boolean> => {
	const response = await api.get<boolean>('/users/check-nickname', { params: { nickname } });
	return response.data;
};

/**
 * @description 회원가입 시 입력한 이메일 주소의 중복 여부를 확인하기 위한 함수
 * @param {string} email - 중복 확인을 진행할 이메일 주소 문자열
 * @returns {Promise<boolean>} 중복 여부 (true: 중복됨, false: 사용 가능)를 담은 Promise 객체
 */
export const emailDuplicate = async (email: RegisterForm['email']): Promise<boolean> => {
	const response = await api.get<boolean>('/users/check-email', {
		params: { email },
	});
	return response.data;
};
