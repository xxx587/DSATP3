/**
 * @file page.tsx
 * @description 비로그인 비밀번호 변경 페이지 컴포넌트
 * UserInfoSearch 컴포넌트를 'changePassword' 모드로 렌더링하여
 * 이메일 인증 후 새 비밀번호를 설정할 수 있는 페이지를 제공
 */

import UserInfoSearch from '@/components/auth/UserInfoSearch';

/**
 * @description 비밀번호 변경 페이지. UserInfoSearch 컴포넌트에 'changePassword' 모드를 전달
 * @return {TSX.Element} 비밀번호 변경 폼 UI
 */
export default function ChangePasswordPage() {
	return <UserInfoSearch mode='changePassword' />;
}
