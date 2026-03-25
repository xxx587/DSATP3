/**
 * @file error.tsx
 * @description Next.js 전역 에러 바운더리 컴포넌트
 * 페이지 렌더링 중 예상치 못한 에러가 발생했을 때 표시되는 폴백 UI를 제공
 * '다시 시도하기' 버튼으로 컴포넌트 리셋, '홈으로 돌아가기' 링크를 포함
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * @description Error 컴포넌트의 Props 인터페이스
 * @property {Error & { digest?: string }} error - 발생한 에러 객체 (digest는 서버 에러 추적용)
 * @property {() => void} reset - 에러 바운더리를 리셋하여 컴포넌트를 다시 렌더링하기 위한 함수
 */
interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/**
 * @description 에러 바운더리 컴포넌트. 런타임 에러 발생 시 사용자에게 에러 안내 및 복구 옵션을 제공
 * @param {ErrorProps} props - 컴포넌트 props
 * @return {TSX.Element} 에러 안내 UI
 */
export default function Error({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error('페이지 에러 발생', error);
	}, [error]);

	return (
		<div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center'>
			<p className='text-gray-500 mb-8 max-w-md'>
				요청을 처리하는 중에 예상치 못한 에러가 발생했습니다. <br />
				일시적인 오류일 수 있으니 다시 시도해 주세요.
			</p>

			<div className='flex gap-4'>
				<button
					onClick={() => reset()}
					className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
				>
					다시 시도하기
				</button>

				<Link
					href='/'
					className='px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
				>
					홈으로 돌아가기
				</Link>
			</div>
		</div>
	);
}
