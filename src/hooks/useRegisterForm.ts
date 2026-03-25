/**
 * @file useRegisterForm.ts
 * @description 회원가입 폼 관리 및 유효성 검사 커스텀 훅
 * 아이디, 닉네임, 이메일 중복 확인 및 비밀번호 일치 여부 등 가입 폼의 상태와 검증 로직을 포함
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
	RegisterErrors,
	RegisterSuccess,
	RegisterCheckStatus,
	RegisterForm,
	UseRegisterFormReturn,
} from '@/types/register';
import { registerFormRequest, usernameDuplicate, nicknameDuplicate, emailDuplicate } from '@/app/api/user';
import { regexUsername, regexPassword, regexEmail, regexNickName } from '@/utils/regex';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
/**
 * @description 회원가입 폼 커스텀 훅. 입력 상태 관리, 유효성 검사, 중복 확인, 폼 제출 처리 포함
 * @return {UseRegisterFormReturn} 회원가입 관련 상태 및 함수
 */
export function useRegisterForm(): UseRegisterFormReturn {
	/**
	 * useRouter: Next.js의 라우팅 기능을 제어하여 회원가입 성공 후 로그인 페이지 등으로 이동하기 위한 훅
	 */
	const router = useRouter();

	/**
	 * useLanguage: 현재 언어 설정을 가져와 다국어 사전에 접근하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].useRegister;

	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 회원가입 폼 데이터, 중복 확인 상태, 에러 메시지 및 성공 메시지를 대수적으로 관리함
	 */
	const [formData, setFormData] = useState<RegisterForm>({
		username: '',
		password: '',
		passwordConfirm: '',
		nickname: '',
		countryCode: 1,
		email: '',
	});

	/**
	 * useState: 각 입력 필드(아이디, 이메일, 닉네임)의 중복 확인 여부를 관리하기 위한 훅
	 */
	const [checkStatus, setCheckStatus] = useState<RegisterCheckStatus>({
		username: false,
		email: false,
		nickname: false,
	});

	/**
	 * useState: 폼 유효성 검사 실패 시 각 필드에 표시할 에러 메시지를 관리하기 위한 훅
	 */
	const [errors, setErrors] = useState<RegisterErrors>({
		username: '',
		password: '',
		passwordConfirm: '',
		nickname: '',
		email: '',
	});

	/**
	 * useState: 중복 확인 성공 시 각 필드에 표시할 성공 메시지를 관리하기 위한 훅
	 */
	const [successMsg, setSuccessMsg] = useState<RegisterSuccess>({
		username: '',
		email: '',
		nickname: '',
	});

	/**
	 * @description 폼 입력 필드가 변경될 때 데이터를 상태에 동기화하고 관련 경고 메시지를 초기화하기 위한 함수
	 * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - 입력 변경 이벤트
	 * useCallback: 동일한 함수 참조를 유지하여 폼 입력 시 성능을 최적화하기 위한 훅
	 */
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const { name, value } = e.target;
			const fieldName = name as keyof RegisterForm;

			setFormData((prev) => ({
				...prev,
				[fieldName]: value,
			}));

			if (errors[fieldName as keyof RegisterErrors]) {
				setErrors((prev) => ({
					...prev,
					[fieldName]: '',
				}));
			}

			if (fieldName === 'username' || fieldName === 'email' || fieldName === 'nickname') {
				setCheckStatus((prev) => ({ ...prev, [fieldName]: false }));
				setSuccessMsg((prev) => ({ ...prev, [fieldName]: '' }));
			}
		},
		[errors],
	);

	const isPasswordMatch = formData.password === formData.passwordConfirm;
	const isConfirmEmpty = formData.passwordConfirm === '';

	/**
	 * @description 입력된 아이디의 중복 여부를 서버에 확인하기 위한 비동기 함수
	 * useCallback: 아이디 입력값에 의존하여 중복 확인 로직을 수행하도록 메모이제이션된 훅
	 */
	const handleCheckUsername = useCallback(async () => {
		setErrors((prev) => ({ ...prev, username: '' }));
		setSuccessMsg((prev) => ({ ...prev, username: '' }));

		if (!formData.username) {
			toast.info(dict.idRequired);
			return;
		}

		if (!regexUsername(formData.username)) {
			toast.info(dict.idRegexError);
			return;
		}

		try {
			const duplicated = await usernameDuplicate(formData.username);
			if (duplicated) {
				toast.error(dict.idDuplicateError);
				setCheckStatus((prev) => ({ ...prev, username: false }));
			} else {
				toast.success(dict.idAvailable);
				setCheckStatus((prev) => ({ ...prev, username: true }));
			}
		} catch (error) {
			console.error('아이디 중복 검사 에러', error);
			toast.error(dict.idCheckError);
			setCheckStatus((prev) => ({ ...prev, username: false }));
		}
	}, [formData.username, dict]);

	/**
	 * @description 입력된 닉네임의 중복 여부를 서버에 확인하기 위한 비동기 함수
	 * useCallback: 닉네임 입력값 변경 시에만 함수를 갱신하도록 최적화된 훅
	 */
	const handleCheckNickname = useCallback(async () => {
		setErrors((prev) => ({ ...prev, nickname: '' }));
		setSuccessMsg((prev) => ({ ...prev, nickname: '' }));

		if (!formData.nickname) {
			toast.info(dict.nicknameRequired);
			return;
		}

		if (!regexNickName(formData.nickname)) {
			toast.info(dict.nicknameRegexError);
			return;
		}

		try {
			const duplicated = await nicknameDuplicate(formData.nickname);
			if (duplicated) {
				toast.error(dict.nicknameDuplicateError);
				setCheckStatus((prev) => ({ ...prev, nickname: false }));
			} else {
				toast.success(dict.nicknameAvailable);
				setCheckStatus((prev) => ({ ...prev, nickname: true }));
			}
		} catch (error) {
			console.error('닉네임 중복 검사 에러', error);
			toast.error(dict.nicknameCheckError);
			setCheckStatus((prev) => ({ ...prev, nickname: false }));
		}
	}, [formData.nickname, dict]);

	/**
	 * @description 입력된 이메일의 중복 여부를 서버에 확인하기 위한 비동기 함수
	 * useCallback: 이메일 입력값 기반의 중복 체크 로직을 관리하기 위한 훅
	 */
	const handleCheckEmail = useCallback(async () => {
		setErrors((prev) => ({ ...prev, email: '' }));
		setSuccessMsg((prev) => ({ ...prev, email: '' }));

		if (!formData.email) {
			toast.info(dict.emailRequired);
			return;
		}

		if (!regexEmail(formData.email)) {
			toast.info(dict.emailRegexError);
			return;
		}

		try {
			const duplicated = await emailDuplicate(formData.email);
			if (duplicated) {
				toast.error(dict.emailDuplicateError);
				setCheckStatus((prev) => ({ ...prev, email: false }));
			} else {
				toast.success(dict.emailAvailable);
				setCheckStatus((prev) => ({ ...prev, email: true }));
			}
		} catch (error) {
			console.error('이메일 중복 검사 에러', error);
			toast.error(dict.emailCheckError);
			setCheckStatus((prev) => ({ ...prev, email: false }));
		}
	}, [formData.email, dict]);

	/**
	 * @description 회원가입 폼 제출을 처리하고 최종 유효성 검사를 수행하기 위한 비동기 함수
	 * @param {React.FormEvent} e - 폼 제출 이벤트
	 * useCallback: 수많은 의존성을 바탕으로 제출 로직을 일관되게 처리하기 위한 훅
	 */
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			const nextErrors: RegisterErrors = { ...errors };
			let hasError = false;

			if (!checkStatus.username) {
				toast.error(dict.idCheckRequired);
				hasError = true;
			}
			if (!checkStatus.email) {
				toast.error(dict.emailCheckRequired);
				hasError = true;
			}
			if (!checkStatus.nickname) {
				toast.error(dict.nicknameCheckRequired);
				hasError = true;
			}
			if (!regexPassword(formData.password)) {
				toast.error(dict.passwordRegexError);
				hasError = true;
			}
			if (!isPasswordMatch) {
				toast.error(dict.passwordMismatchError);
				hasError = true;
			}

			setErrors(nextErrors);
			if (hasError) return;

			const { username, nickname, countryCode, email, password } = formData;
			const submitData = {
				username,
				nickname,
				countryCode,
				email,
				password,
			};
			try {
				await registerFormRequest(submitData);
				toast.success(dict.registerSuccess);
				router.push('/login');
			} catch (error) {
				toast.error(dict.genericError);
				console.error('회원가입 에러', error);
			}
		},
		[checkStatus, errors, formData, isPasswordMatch, router, dict],
	);

	return {
		formData,
		errors,
		successMsg,
		checkStatus,
		isPasswordMatch,
		isConfirmEmpty,
		handleChange,
		handleCheckUsername,
		handleCheckNickname,
		handleCheckEmail,
		handleSubmit,
		dict,
	};
}

