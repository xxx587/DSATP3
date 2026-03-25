/**
 * @file proxy.ts
 * @description Next.js 미들웨어 - 인증 기반 라우팅 제어
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * @description 인증 기반 라우팅 제어 미들웨어. 사용자의 로그인 상태에 따라 접근 권한을 처리하기 위한 함수
 * @param {NextRequest} request - 현재 요청 정보를 담고 있는 Next.js 요청 객체
 * @returns {NextResponse} 다음 미들웨어로 진행하거나 리다이렉트를 수행하는 Next.js 응답 객체
 */
export function proxy(request: NextRequest) {
	// access_token value값 꺼내기
	const token = request.cookies.get('access_token')?.value;
	const pathname = request.nextUrl.pathname;

	// 토큰이 없을 때 접속을 막아놓을 주소 리스트
	const isProtectedRoute =
		pathname.startsWith('/mypage') ||
		pathname.startsWith('/closet') ||
		pathname.startsWith('/preset') ||
		pathname.startsWith('/capture');

	// 토큰이 없을 경우 로그인 페이지로 내보내기
	if (!token && isProtectedRoute) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// 토큰이 있는 유저가 로그인/회원가입 페이지 요청시 메인사이트로
	if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	// 조건문에 걸리지 않으면 실행시킴
	return NextResponse.next();
}

//이 코드가 작동될 경로
export const config = {
	matcher: [
		// /:path*는 하위 모든 경로
		'/login',
		'/register',
		'/mypage',
		'/closet/:path*',
		'/preset/:path*',
		'/capture/:path*',
	],
};
