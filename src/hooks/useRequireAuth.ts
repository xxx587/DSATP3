/**
 * @file useRequireAuth.ts
 * @description 로그인 인증 요구 커스텀 훅
 * access_token 쿠키 유무를 확인하여 로그인 상태를 검증
 * 미로그인 시 알림 표시 후 로그인 페이지로 리다이렉트
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 로그인 인증 요구 커스텀 훅.
 * @return {() => boolean} checkAuth - 로그인 상태 확인 함수
 */
export default function useRequireAuth(): () => boolean {
	/**
	 * useRouter: Next.js의 라우팅 기능을 제어하여 비로그인 사용자를 로그인 페이지로 이동시키기 위한 훅
	 */
	const router = useRouter();

	/**
	 * useLanguage: 현재 언어 설정을 가져와 다국어 알림 메시지를 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].useRequireAuth;

	/**
	 * @description 현재 사용자의 로그인 여부를 확인하고, 미로그인 시 로그인 페이지로 리다이렉트하는 함수
	 * @returns {boolean} 로그인 여부
	 * useCallback: 동일한 함수 참조를 유지하여 여러 컴포넌트에서 효율적으로 사용하기 위한 훅
	 */
	const checkAuth = useCallback(() => {
		if (typeof window === 'undefined') return false;

		const token = Cookies.get('access_token');

		if (!token) {
			toast.info(dict.requireLogin);
			router.push('/login');
			return false;
		}

		return true;
	}, [router, dict]);

	return checkAuth;
}

