/**
 * @file page.tsx
 * @description 마이페이지 컴포넌트
 * MyPage 컴포넌트를 렌더링하여 회원정보 수정(비밀번호 변경) 기능을 제공
 */

import MyPage from '@/components/auth/MyPage';

/**
 * @description 마이페이지. MyPage 컴포넌트를 렌더링
 * @return {TSX.Element} 회원정보 수정 폼 UI
 */
export default function MyPagePage() {
	return <MyPage />;
}
