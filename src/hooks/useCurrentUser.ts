/**
 * @file useCurrentUser.ts
 * @description 현재 로그인 유저 정보를 반환하는 커스텀 훅
 * access_token 쿠키를 디코딩하여 닉네임, 로그인 여부를 반환
 */

'use client';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/cookie';
import { useMounted } from '@/hooks/useMounted';

/** @description useCurrentUser 훅의 반환 타입 */
interface CurrentUser {
	isLoggedIn: boolean;
	nickname: string | null;
}

/**
 * @description 현재 로그인한 유저 정보를 반환하는 훅
 *              access_token 쿠키를 디코딩하여 닉네임과 로그인 여부 반환
 * @return {CurrentUser} 유저 상태 정보
 */
export function useCurrentUser(): CurrentUser {
	/**
	 * useMounted: 컴포넌트가 브라우저에 마운트되었는지 확인하여 SSR 환경과의 불일치를 방지하기 위한 커스텀 훅
	 */
	const mounted = useMounted();

	if (!mounted) {
		return { isLoggedIn: false, nickname: null };
	}

	const token = Cookies.get('access_token');
	if (!token) {
		return { isLoggedIn: false, nickname: null };
	}

	try {
		/**
		 * jwtDecode: 쿠키에 저장된 JWT 토큰을 디코딩하여 내부 페이로드 정보를 추출하기 위해 사용함
		 */
		const decoded = jwtDecode<JwtPayload>(token);
		return {
			isLoggedIn: true,
			nickname: decoded.nickname ?? null,
		};
	} catch {
		return { isLoggedIn: false, nickname: null };
	}
}

