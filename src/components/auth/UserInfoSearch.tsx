/**
 * @file UserInfoSearch.tsx
 * @description 아이디 찾기 / 비밀번호 변경 공통 컴포넌트
 * mode prop에 따라 'findUsername'(아이디 찾기) 또는 'changePassword'(비밀번호 변경) 기능을 제공
 * 이메일 인증을 공통으로 수행하며, 비밀번호 변경 모드에서는 새 비밀번호 입력 UI를 추가로 표시
 */

'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { regexPassword, regexEmail } from '@/utils/regex';
import {
	UserInfoSearchCheckStatus,
	UserInfoSearchErrors,
	UserInfoSearchForm,
	UserInfoSearchSuccess,
} from '@/types/userinfosearch';
import { emailDuplicate } from '@/app/api/user';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description UserInfoSearch 컴포넌트의 Props 인터페이스
 * @property {'findUsername' | 'changePassword'} mode - 동작 모드 (아이디 찾기 또는 비밀번호 변경)
 */
interface UserInfoSearchProps {
	mode: 'findUsername' | 'changePassword';
}

/**
 * @description 아이디 찾기 / 비밀번호 변경 공통 컴포넌트
 * 이메일 존재 여부 확인 후, 모드에 따라 아이디를 보여주거나 새 비밀번호를 설정할 수 있게 함
 * @param {UserInfoSearchProps} props - 컴포넌트 Props
 * @param {'findUsername' | 'changePassword'} props.mode - 동작 모드
 * @return {TSX.Element} 아이디 찾기/비밀번호 변경 폼 UI
 */
const UserInfoSearch = ({ mode }: UserInfoSearchProps) => {
	/**
	 * useLanguage: 현재 설정된 언어 정보를 기반으로 UI 텍스트를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].userInfoSearchComponent;

	/**
	 * useState: 사용자가 입력한 이메일, 새 비밀번호 등 검색 및 변경을 위한 정보를 상태로 관리하기 위한 훅
	 */
	const [formData, setFormData] = useState<UserInfoSearchForm>({
		email: '',
		password: '',
		passwordConfirm: '',
	});

	/**
	 * useState: 이메일 인증 등 검색 과정에서의 검증 상태를 관리하기 위한 훅
	 */
	const [checkStatus, setCheckStatus] = useState<UserInfoSearchCheckStatus>({
		email: false,
	});

	/**
	 * useState: 각 입력 필드에 대응하는 유효성 검사 에러 메시지를 관리하기 위한 훅
	 */
	const [errors, setErrors] = useState<UserInfoSearchErrors>({
		password: '',
		passwordConfirm: '',
		email: '',
	});

	/**
	 * useState: 특정 입력 필드(이메일 등)의 검증 성공 시 표시할 메시지를 관리하기 위한 훅
	 */
	const [successMsg, setSuccessMsg] = useState<UserInfoSearchSuccess>({
		email: '',
	});

	/**
	 * useState: 서버에서 조회된 결과를 화면에 표시하기 위해 해당 데이터를 임시 저장하기 위한 훅
	 */
	const [foundUsername, setFoundUsername] = useState<string | null>(null);

	/**
	 * @description 폼 입력 필드 변경 핸들러. 입력값을 formData 상태에 반영
	 *              해당 필드의 에러 메시지를 초기화
	 *              이메일 필드 변경 시 인증 상태와 성공 메시지 초기화
	 * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 변경 이벤트 객체
	 * @return {void}
	 */
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setFormData((prev) => ({ ...prev, [name]: value }));

			if (errors[name as keyof UserInfoSearchErrors]) {
				setErrors((prev) => ({ ...prev, [name]: '' }));
			}

			if (name === 'email') {
				setCheckStatus((prev) => ({ ...prev, [name]: false }));
				setSuccessMsg((prev) => ({ ...prev, [name]: '' }));
				setFoundUsername(null);
			}
		},
		[errors],
	);

	const isPasswordMatch = formData.password === formData.passwordConfirm;
	const isConfirmEmpty = formData.passwordConfirm === '';

	/**
	 * @description 이메일 가입 여부 확인 핸들러. 이메일 형식 유효성 검사 후
	 *              서버 API를 호출하여 이메일 존재 여부를 확인
	 *              확인 결과에 따라 성공/에러 메시지를 설정
	 * @return {Promise<void>}
	 */
	const handleCheckEmail = useCallback(async () => {
		setErrors((prev) => ({ ...prev, email: '' }));
		setSuccessMsg((prev) => ({ ...prev, email: '' }));

		if (!formData.email) {
			setErrors((prev) => ({ ...prev, email: dict.emailRequired }));
			return;
		}

		if (!regexEmail(formData.email)) {
			setErrors((prev) => ({
				...prev,
				email: dict.invalidEmail,
			}));
			return;
		}

		// axios 이메일 중복 확인 로직 재활용(이메일 존재 여부 확인)
		try {
			const response = await emailDuplicate(formData.email);
			if (response) {
				setSuccessMsg((prev) => ({
					...prev,
					email: dict.emailInUse,
				}));
				setCheckStatus((prev) => ({ ...prev, email: true }));
				// console.log(response);
			} else {
				setErrors((prev) => ({
					...prev,
					email: dict.emailNotFound,
				}));
				setCheckStatus((prev) => ({ ...prev, email: false }));
				// console.log(response);
			}
		} catch (error) {
			console.error('이메일 존재 여부 확인 에러:', error);
			setErrors((prev) => ({
				...prev,
				email: dict.checkError,
			}));
			setCheckStatus((prev) => ({ ...prev, email: false }));
		}
	}, [formData.email, dict]);

	/**
	 * @description 폼 제출 핸들러. 이메일 인증 상태를 검증
	 *              비밀번호 변경 모드에서는 비밀번호 유효성 검사를 추가로 수행
	 *              모든 검증 통과 시 모드에 따라 아이디 찾기 또는 비밀번호 변경 API를 호출
	 * @param {React.FormEvent} e - 폼 제출 이벤트
	 * @return {Promise<void>}
	 */
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			const nextErrors: UserInfoSearchErrors = { ...errors };
			let hasError = false;

			// 공통 유효성 검사: 이메일 확인 여부
			if (!checkStatus.email) {
				nextErrors.email = dict.emailCheckRequired;
				hasError = true;
			}

			// 비밀번호 변경 모드일 때만 비밀번호 유효성 검사 실행
			if (mode === 'changePassword') {
				if (!regexPassword(formData.password)) {
					nextErrors.password = dict.passwordRegexError;
					hasError = true;
				}
				if (!isPasswordMatch) {
					nextErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
					hasError = true;
				}
			}

			setErrors(nextErrors);
			if (hasError) return;

			// api 나중에 추가
			// if (mode === 'findUsername') {
			//     // API 아이디 찾기
			// } else if (mode === 'changePassword') {
			//     // API 비밀번호 변경
			//     try {
			//         const response = await changePassword(formData);
			//         console.log(response);
			//         alert('비밀번호 변경 완료');
			//     } catch (error) {
			//         console.error('비밀번호 변경 에러', error);
			//         alert('문제가 발생했습니다. 다시 시도해주세요.');
			//     }
			// }
		},
		[mode, checkStatus, errors, formData, isPasswordMatch, dict],
	);

	return (
		<section className='fixed inset-0 flex h-screen w-screen mt-8 flex-col items-center justify-center bg-zinc-950 px-4'>
			<div className='w-full max-w-md space-y-8 rounded-xl bg-zinc-900 border border-zinc-800 p-10 shadow-lg'>
				<div className='text-center'>
					<p className='text-3xl font-extrabold text-zinc-100'>
						{mode === 'findUsername' ? dict.findUsername : dict.changePassword}
					</p>
					<p className='mt-1 text-sm text-zinc-400'>
						{mode === 'findUsername'
							? dict.inputEmailExplain
							: dict.inputNewPasswordExplain}
					</p>
				</div>

				<form className='mt-2 space-y-5' onSubmit={handleSubmit}>
					<div className='space-y-4'>
						{/* 이메일 필드 (공통) */}
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
								{dict.email}
							</label>
							<div className='mt-1 flex gap-2'>
								<input
									id='email'
									name='email'
									type='email'
									required
									value={formData.email}
									onChange={handleChange}
									className={`block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition duration-200
                                    ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
									placeholder={dict.emailPlaceholder}
								/>
								<button
									type='button'
									onClick={handleCheckEmail}
									className='whitespace-nowrap rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors'
								>
									{dict.check}
								</button>
							</div>
							{errors.email && <p className='mt-1 text-xs text-red-600'>{errors.email}</p>}
							{!errors.email && successMsg.email && (
								<p className='mt-1 text-xs text-green-600'>{successMsg.email}</p>
							)}
						</div>

						{/* 비밀번호 필드 (비밀번호 변경 모드에서만 렌더링) */}
						{mode === 'changePassword' && (
							<>
								<div>
									<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
										{dict.newPassword}
									</label>
									<input
										id='password'
										name='password'
										type='password'
										required
										value={formData.password}
										onChange={handleChange}
										className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition duration-200
                                        ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
									/>
									{errors.password && <p className='mt-1 text-xs text-red-600'>{errors.password}</p>}
								</div>
								<div>
									<label
										htmlFor='passwordConfirm'
										className='block text-sm font-medium text-gray-700'
									>
										{dict.newPasswordConfirm}
									</label>
									<input
										id='passwordConfirm'
										name='passwordConfirm'
										type='password'
										required
										value={formData.passwordConfirm}
										onChange={handleChange}
										className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition duration-200 
                                        ${(!isConfirmEmpty && !isPasswordMatch) || errors.passwordConfirm ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
									/>
									{!isConfirmEmpty && (
										<p
											className={`mt-1 text-xs ${isPasswordMatch ? 'text-green-600' : 'text-red-600'}`}
										>
											{isPasswordMatch
												? dict.passwordMatch
												: dict.passwordMismatch}
										</p>
									)}
								</div>
							</>
						)}

						{/* 아이디 결과 렌더링 (아이디 찾기 모드에서만) */}
						{mode === 'findUsername' && foundUsername && (
							<div className='rounded-md bg-blue-50 p-4 mt-4 transition-all'>
								<p className='text-sm text-blue-700 text-center'>
									{dict.foundIdPrefix} <strong>{foundUsername}</strong> {dict.foundIdSuffix}
								</p>
							</div>
						)}
					</div>

					<div className='pt-2'>
						<button
							type='submit'
							className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors'
						>
							{mode === 'findUsername' ? dict.findUsername : dict.changePasswordButton}
						</button>
					</div>
				</form>

				<div className='text-center text-sm'>
					<p className='text-zinc-400'>
						{dict.knowAccount}
						<Link href='/login' className='ml-1 font-medium text-indigo-600 hover:text-indigo-500'>
							{dict.goLogin}
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default UserInfoSearch;
