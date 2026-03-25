/**
 * @file regex.ts
 * @description 회원가입 및 정보 수정 시 입력값의 유효성을 검증하는 정규식 함수들을 처리하기 위한 파일
 */

/** @description 아이디 검증 정규식 */
export const regexUsername = (id: string) => {
	const regex = /^[a-z0-9]{4,10}$/;
	return regex.test(id);
};

/** @description 비밀번호 검증 정규식 */
export const regexPassword = (password: string) => {
	const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9])[a-zA-Z0-9!@#$%^*+=-]{8,15}$/;
	return regex.test(password);
};

/** @description 이메일 인증 정규식 */
export const regexEmail = (email: string) => {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regex.test(email);
};

/** @description 닉네임 인증 정규식 */
export const regexNickName = (nickname: string) => {
	const regex = /^[a-zA-Z0-9가-힣ぁ-ゔァ-ヴー々〆〤一-龥]{2,10}$/;
	return regex.test(nickname);
};
