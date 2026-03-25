/**
 * @file page.tsx
 * @description 로그인 페이지 컴포넌트
 * Login 컴포넌트를 렌더링하여 사용자 로그인 기능을 제공
 */

import Login from '@/components/auth/Login';

/**
 * @description 로그인 페이지. Login 컴포넌트를 렌더링
 * @return {TSX.Element} 로그인 폼 UI
 */
export default function LoginPage() {
	return <Login />;
}
