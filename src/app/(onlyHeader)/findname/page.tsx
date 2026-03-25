/**
 * @file page.tsx
 * @description 비로그인 아이디 찾기 페이지 컴포넌트
 * UserInfoSearch 컴포넌트를 'findUsername' 모드로 렌더링하여
 * 가입한 이메일을 통해 아이디를 찾을 수 있는 페이지를 제공
 */

import UserInfoSearch from '@/components/auth/UserInfoSearch';

/**
 * @description 아이디 찾기 페이지. UserInfoSearch 컴포넌트에 'findUsername' 모드를 전달
 * @return {TSX.Element} 아이디 찾기 폼 UI
 */
export default function FindNamePage() {
	return <UserInfoSearch mode='findUsername' />;
}
