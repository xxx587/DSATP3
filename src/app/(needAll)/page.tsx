/**
 * @file page.tsx
 * @description 메인(홈) 페이지 (서버 컴포넌트)
 * 서버 사이드에서 초기 게시글 목록을 fetch하여 HomeClient 컴포넌트에 전달
 * SSR 환경에서 쿠키 기반 인증 토큰을 헤더에 포함하여 API 호출
 */

import { cookies } from 'next/headers';
import { BoardListItemDto } from '@/types/board';
import HomeClient from '@/components/home/HomeClient';

/**
 * @description 서버 사이드에서 초기 게시글 목록을 가져오기 위한 함수
 * 쿠키에서 인증 토큰을 추출하여 보안 헤더와 함께 최신순 게시글 데이터를 요청하고 처리하기 위한 로직을 포함
 * SSR 환경에서 외부 API와의 통신을 안정적으로 처리하기 위해 fetch API를 사용
 * @return {Promise<BoardListItemDto[]>} 초기 게시글 목록 데이터를 담은 프로미스 객체
 */
async function getInitialBoards(): Promise<BoardListItemDto[]> {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token')?.value;
		const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/ottaku/api';

		const headers: Record<string, string> = { 'Content-Type': 'application/json' };
		if (token) headers['Authorization'] = `Bearer ${token}`;

		// SSR 에러로 fetch 사용
		const res = await fetch(`${API_BASE}/boards?order=recent&page=0&size=20`, {
			headers,
			cache: 'no-store',
		});
		if (!res.ok) throw new Error(`HTTP에러 ${res.status}`);

		const data: BoardListItemDto[] = await res.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error('보드 불러오는 중에 에러 발생', error);
		return [];
	}
}

/**
 * @description 메인 홈 페이지 컴포넌트. 서버에서 fetch한 초기 데이터를 클라이언트 컴포넌트에 전달하여 화면에 렌더링하기 위한 컴포넌트
 * @return {Promise<TSX.Element>} 홈 페이지의 전체 레이아웃 구조를 처리하기 위한 요소
 */
export default async function Home() {
	const initialBoards = await getInitialBoards();

	return (
		<main>
			<HomeClient initialBoards={initialBoards} />
		</main>
	);
}
