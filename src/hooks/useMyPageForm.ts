/**
 * @file useMyPageForm.ts
 * @description 회원정보 수정 및 비밀번호 변경 폼 관리 커스텀 훅
 * JWT 토큰 디코딩을 통한 유저 정보 조회, 새 비밀번호 변경 요청 및 회원탈퇴 처리를 담당
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/cookie';
import { changePassword, deleteUser } from '@/app/api/user';
import { regexPassword } from '@/utils/regex';
import { MyPageErrors, MyPageForm, UseMyPageFormReturn, UserInfo } from '@/types/mypage';
import { toast } from 'sonner';
import { useDialog } from '@/context/DialogContext';

/**
 * @description 회원정보 수정 폼 커스텀 훅. JWT 토큰에서 유저 정보를 디코딩하여 표시하고, 비밀번호 변경, 회원탈퇴, 유효성 검사 기능을 제공
 * @return {UseMyPageFormReturn} 회원정보 수정 관련 상태 및 함수
 */
export function useMyPageForm(): UseMyPageFormReturn {
	/**
	 * useRouter: Next.js의 라우팅 기능을 제어하여 페이지 이동(비밀번호 변경 후 로그인 페이지 이동 등)을 처리하기 위한 훅
	 */
	const router = useRouter();

	/**
	 * useDialog: 공통 컨펌 다이얼로그를 사용하여 회원탈퇴 등의 사용자 확인을 받기 위한 컨텍스트 훅
	 */
	const { confirm } = useDialog();

	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 유저 정보, 폼 데이터, 입력 에러 상태를 저장하기 위해 사용함
	 */
	const [userInfo, setUserInfo] = useState<UserInfo>({
		username: '',
		nickname: '',
		countryCode: 1,
		email: '',
	});

	/**
	 * useEffect: 컴포넌트 마운트 시 쿠키에서 토큰을 읽어 유저 정보를 디코딩하고 상태를 초기화하기 위한 훅
	 */
	useEffect(() => {
		const token = Cookies.get('access_token');
		if (token) {
			try {
				const decoded = jwtDecode<JwtPayload>(token);
				setTimeout(() => {
					setUserInfo({
						username: decoded.sub || '',
						nickname: decoded.nickname || '',
						countryCode: decoded.countryCode || 1,
						email: decoded.email || '',
					});
				}, 0);
			} catch (error) {
				console.error('토큰 해독 실패', error);
			}
		}
	}, []);

	/**
	 * @description 이전 페이지로 이동하기 위한 핸들러 함수
	 * useCallback: 라우터 객체 의존성을 유지하며 함수를 메모이제이션하기 위한 훅
	 */
	const back = useCallback(() => {
		router.back();
	}, [router]);

	/**
	 * @description 회원탈퇴 처리를 수행하기 위한 비동기 함수
	 * useCallback: 불필요한 함수 재생성을 방지하고 사용자 확인 및 탈퇴 로직을 포함하기 위한 훅
	 */
	const del = useCallback(async () => {
		if (!(await confirm('정말로 회원탈퇴하시겠습니까?\n확인을 누르면 회원탈퇴 됩니다.'))) {
			return;
		}
		try {
			await deleteUser();
			Cookies.remove('access_token');
			toast.success('회원탈퇴가 완료되었습니다.');
			router.refresh();
			router.push('/');
		} catch (error) {
			toast.error('문제가 발생했습니다. 다시 시도해주세요.');
			console.log(error);
		}
	}, [router, confirm]);

	/**
	 * useState: 비밀번호 변경을 위한 폼 입력 데이터 상태를 관리하기 위한 훅
	 */
	const [formData, setFormData] = useState<MyPageForm>({
		currentPassword: '',
		newPassword: '',
		passwordConfirm: '',
	});

	/**
	 * useState: 비밀번호 변경 시 각 필드의 유효성 검사 에러 메시지를 관리하기 위한 훅
	 */
	const [errors, setErrors] = useState<MyPageErrors>({
		newPassword: '',
		passwordConfirm: '',
	});

	/**
	 * @description 폼 입력 필드 변경 시 데이터를 상태에 반영하고 에러 메시지를 초기화하기 위한 함수
	 * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 변경 이벤트
	 * useCallback: 입력 필드 변경 핸들러를 메모이제이션하여 성능을 최적화하기 위한 훅
	 */
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			const fieldName = name as keyof MyPageForm;
			setFormData((prev) => ({ ...prev, [fieldName]: value }));

			if (errors[fieldName as keyof MyPageErrors]) {
				setErrors((prev) => ({ ...prev, [fieldName]: '' }));
			}
		},
		[errors],
	);

	const isPasswordMatch = formData.newPassword === formData.passwordConfirm;
	const isConfirmEmpty = formData.passwordConfirm === '';

	/**
	 * @description 비밀번호 변경 폼 제출을 처리하고 유효성 검사를 수행하기 위한 비동기 함수
	 * @param {React.FormEvent} e - 폼 제출 이벤트
	 * useCallback: 제출 로직을 메모이제이션하고 대규모의 유효성 검사 및 서버 연동을 처리하기 위한 훅
	 */
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			const nextErrors: MyPageErrors = { ...errors };
			let hasError = false;

			if (!regexPassword(formData.newPassword)) {
				nextErrors.newPassword = '닉네임은 2~10글자의 영문, 숫자, 가나, 한자만 사용 가능합니다.';
				hasError = true;
			}
			if (!isPasswordMatch) {
				nextErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
				hasError = true;
			}

			if (formData.currentPassword === formData.newPassword) {
				toast.error('현재 비밀번호와 새 비밀번호가 일치합니다.');
				hasError = true;
			}

			setErrors(nextErrors);
			if (hasError) return;

			const submitData: Omit<MyPageForm, 'passwordConfirm'> = {
				currentPassword: formData.currentPassword,
				newPassword: formData.newPassword,
			};

			try {
				await changePassword(submitData);
				Cookies.remove('access_token');
				toast.success('비밀번호가 변경되었습니다.');
				router.refresh();
				router.push('/login');
			} catch (error) {
				if (isAxiosError(error) && error.response?.status === 400) {
					toast.error('현재 비밀번호가 일치하지 않습니다.');
					console.log(error.response);
					return;
				} else {
					toast.error('문제가 발생했습니다. 다시 시도해주세요.');
					console.error('회원정보 수정 에러', error);
				}
			}
		},
		[errors, formData, isPasswordMatch, router],
	);

	return {
		userInfo,
		formData,
		errors,
		isPasswordMatch,
		isConfirmEmpty,
		back,
		del,
		handleChange,
		handleSubmit,
	};
}

