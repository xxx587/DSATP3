/**
 * @file page.tsx
 * @description 회원가입 페이지 컴포넌트
 * Register 컴포넌트를 렌더링하여 사용자 회원가입 기능을 제공
 */

import Register from '@/components/auth/Register';

/**
 * @description 회원가입 페이지. Register 컴포넌트를 렌더링
 * @return {TSX.Element} 회원가입 폼 UI
 */
export default function RegisterPage() {
	return <Register />;
}
