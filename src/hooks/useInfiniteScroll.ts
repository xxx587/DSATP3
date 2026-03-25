/**
 * @file useInfiniteScroll.ts
 * @description 무한 스크롤 커스텀 훅
 * IntersectionObserver를 사용하여 마지막 요소가 화면에 보이면 자동으로 다음 페이지를 로드
 */

import { useCallback, useRef, useState } from 'react';

/**
 * @description 무한 스크롤을 위한 커스텀 훅. IntersectionObserver를 사용하여 마지막 요소가 화면에 보이면 자동으로 페이지를 증가
 * @param {boolean} loading - 현재 로딩 중인지 여부
 * @param {boolean} hasMore - 더 불러올 데이터가 있는지 여부
 * @param {number} [initialPage=0] - 초기 페이지 번호
 * @return {{ page: number, setPage: Function, lastElementRef: Function }} 페이지 상태 및 마지막 요소 ref 콜백
 */
export function useInfiniteScroll(loading: boolean, hasMore: boolean, initialPage: number = 0) {
	/**
	 * useState: 현재 페이지 번호를 관리하기 위한 훅으로, 데이터 로드 시 다음 페이지를 추적하기 위해 사용함
	 */
	const [page, setPage] = useState(initialPage);

	/**
	 * useRef: IntersectionObserver 인스턴스를 유지하여 리렌더링 시에도 동일한 관찰자를 참조하기 위한 훅
	 */
	const observer = useRef<IntersectionObserver | null>(null);

	/**
	 * @description 마지막 요소가 화면에 보일 때 페이지를 증가시키는 콜백 ref 함수
	 * @param {HTMLElement | null} node - 관찰할 DOM 요소
	 * useCallback: 함수 참조를 유지하여 불필요한 관찰자 재설정을 방지하기 위한 훅
	 */
	const lastElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prev) => prev + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, hasMore],
	);

	return { page, setPage, lastElementRef };
}

