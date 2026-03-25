/**
 * @file not-found.tsx
 * @description 404 에러 페이지 컴포넌트
 * 존재하지 않는 경로에 접근했을 때 표시되는 커스텀 404 페이지
 * '홈으로 돌아가기' 링크를 제공하여 사용자를 메인 페이지로 안내
 */

import Link from 'next/link';

/**
 * @description 404 Not Found 페이지 컴포넌트. 존재하지 않는 경로 접근 시 사용자를 안내하기 위한 컴포넌트
 * @return {TSX.Element} 404 에러 안내 UI를 처리하기 위한 요소
 */
export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center'>
			<p className='text-7xl font-extrabold text-blue-500 mb-2'>404</p>
			<p className='text-2xl font-bold text-gray-800 mb-4'>
				페이지를 찾을 수 없습니다
			</p>
			<Link
				href='/'
				className='px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors'
			>
				홈으로 돌아가기
			</Link>
		</div>
	);
}
