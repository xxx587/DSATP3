/**
 * @file useMounted.ts
 * @description 브라우저 마운트 여부 확인 커스텀 훅
 * Hydration 에러(서버/클라이언트 렌더링 결과 불일치) 방지를 위해
 * 컴포넌트가 브라우저에 마운트되었는지를 확인
 */

import { useEffect, useState } from 'react';

/**
 * @description 브라우저 마운트 여부를 확인하는 커스텀 훅
 * @return {boolean} 마운트 여부
 */
export function useMounted(): boolean {
	/**
	 * useState: 컴포넌트의 마운트 상태를 관리하기 위한 훅으로, 클라이언트 사이드 렌더링 완료 여부를 저장함
	 */
	const [mounted, setMounted] = useState(false);

	/**
	 * useEffect: 컴포넌트가 마운트된 직후에 실행되어 마운트 상태를 true로 변경하기 위한 훅
	 */
	useEffect(() => {
		// 비동기 처리로 성능 저하 방지
		const timer = setTimeout(() => {
			setMounted(true);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	return mounted;
}

