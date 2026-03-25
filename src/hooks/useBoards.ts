/**
 * @file useBoards.ts
 * @description 게시글 목록 무한 스크롤 커스텀 훅
 * 정렬 변경(최신순/좋아요순), 페이지네이션, 로딩/에러 상태 관리를 포함
 * useInfiniteScroll 훅과 연동하여 스크롤 기반 데이터 로드를 처리
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { BoardListItemDto, OrderType, UseBoardsProps, UseBoardsReturn } from '@/types/board';
import { getBoard, searchBoards } from '@/app/api/board';
import { useInfiniteScroll } from './useInfiniteScroll';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 게시글 목록 무한 스크롤 커스텀 훅. 정렬 변경, 페이지네이션,
 *              로딩/에러 상태 관리를 모두 포함.
 * @param {UseBoardsProps} [props] - 훅 설정 옵션
 * @return {UseBoardsReturn} 게시글 목록 상태 및 제어 함수
 */
export function useBoards({ pageSize = 20, initialData = [] }: UseBoardsProps = {}): UseBoardsReturn {
	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 게시글의 정렬 방식, 검색어, 데이터 목록, 로딩/에러 상태 및 추가 데이터 여부를 저장하기 위해 사용함
	 */
	const [order, setOrder] = useState<OrderType>('recent');
	const [keyword, setKeyword] = useState('');
	const [boards, setBoards] = useState<BoardListItemDto[]>(initialData);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(initialData.length === pageSize);

	/**
	 * useInfiniteScroll: 스크롤 이벤트를 감지하여 무한 스크롤 기능을 구현하기 위한 커스텀 훅
	 */
	const { page, setPage, lastElementRef } = useInfiniteScroll(loading, hasMore, 0);

	/**
	 * useRef: 컴포넌트 리렌더링과 관계없이 유지되어야 하는 값(초기 마운트 여부, 페칭 상태, 초기 데이터 존재 여부)을 관리하기 위한 훅
	 */
	const isInitialMount = useRef(true);
	const isFetching = useRef(false);
	const hasInitialData = useRef(initialData && initialData.length > 0);

	/**
	 * useLanguage: 현재 언어 설정 및 다국어 사전을 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].useBoard;

	/**
	 * @description 게시글 데이터를 서버에서 가져오기 위한 비동기 함수
	 * @param {OrderType} currentOrder - 정렬 방식 (최신순/좋아요순)
	 * @param {number} currentPage - 현재 페이지 번호
	 * @param {string} currentKeyword - 검색 키워드
	 * useCallback: 불필요한 함수 재생성을 방지하고 메모이제이션하기 위한 훅
	 */
	const fetchBoards = useCallback(
		async (currentOrder: OrderType, currentPage: number, currentKeyword: string) => {
			if (isFetching.current) return;
			isFetching.current = true;
			setLoading(true);
			try {
				let response: BoardListItemDto[];
				if (currentKeyword.trim()) {
					response = await searchBoards(currentKeyword, currentPage, pageSize);
				} else {
					response = await getBoard(currentOrder, currentPage, pageSize);
				}

				setHasMore(response.length >= pageSize);
				setBoards((prev) => (currentPage === 0 ? response : [...prev, ...response]));
				setError(null);
			} catch (error) {
				toast.error(dict.boardLoadError);
				console.error('데이터를 불러오는데 실패', error);
				setError(dict.boardLoadError);
			} finally {
				setLoading(false);
				isFetching.current = false;
			}
		},
		[pageSize, dict],
	);

	/**
	 * useEffect: 컴포넌트의 마운트 시점이나 의존성 배열(order, page, keyword)이 변경될 때 데이터를 페칭하기 위한 훅
	 */
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			if (hasInitialData.current) return;
		}

		fetchBoards(order, page, keyword);
	}, [order, page, keyword, fetchBoards]);

	/**
	 * @description 정렬 방식 변경을 처리하기 위한 핸들러 함수
	 * @param {OrderType} newOrder - 새로 설정할 정렬 방식
	 * useCallback: 함수를 재사용하여 자식 컴포넌트의 불필요한 리렌더링을 방지하기 위한 훅
	 */
	const handleSetOrder = useCallback(
		(newOrder: OrderType) => {
			if (order === newOrder) return;
			setPage(0);
			setBoards([]);
			setHasMore(true);
			setOrder(newOrder);
		},
		[order, setPage],
	);

	/**
	 * @description 검색어 변경을 처리하기 위한 핸들러 함수
	 * @param {string} newKeyword - 새로 입력된 검색어
	 * useCallback: 검색어 변경 시 함수 재생성을 방지하기 위한 훅
	 */
	const handleSetKeyword = useCallback(
		(newKeyword: string) => {
			if (keyword === newKeyword) return;
			setPage(0);
			setBoards([]);
			setHasMore(true);
			setKeyword(newKeyword);
		},
		[keyword, setPage],
	);

	/**
	 * useEffect: 전역 게시글 관련 커스텀 이벤트를 구독하고 해제하기 위한 훅
	 */
	useEffect(() => {
		const handleBoardUpdate = (event: Event) => {
			const customEvent = event as CustomEvent<{
				boardId: number;
				commentCountChange?: number;
				likeCount?: number;
				liked?: boolean;
				bookmarked?: boolean;
				updatedBoard?: BoardListItemDto;
			}>;
			const {
				boardId,
				commentCountChange,
				likeCount: newLikeCount,
				liked,
				bookmarked,
				updatedBoard,
			} = customEvent.detail;

			setBoards((prev) =>
				prev.map((board) => {
					if (board.boardId === boardId) {
						if (updatedBoard) return updatedBoard;
						const newBoard = { ...board };
						if (commentCountChange !== undefined) {
							newBoard.commentCount += commentCountChange;
						}
						if (newLikeCount !== undefined) {
							newBoard.likeCount = newLikeCount;
						}
						if (liked !== undefined) {
							newBoard.liked = liked;
						}
						if (bookmarked !== undefined) {
							newBoard.bookmarked = bookmarked;
						}
						return newBoard;
					}
					return board;
				}),
			);
		};

		const handleBoardDelete = (event: Event) => {
			const customEvent = event as CustomEvent<{ boardId: number | string }>;
			setBoards((prev) => prev.filter((board) => Number(board.boardId) !== Number(customEvent.detail.boardId)));
		};

		window.addEventListener('board-update', handleBoardUpdate);
		window.addEventListener('board-delete', handleBoardDelete);
		return () => {
			window.removeEventListener('board-update', handleBoardUpdate);
			window.removeEventListener('board-delete', handleBoardDelete);
		};
	}, []);

	/**
	 * @description 게시글 목록을 새로고침하기 위한 함수
	 * useCallback: 리렌더링 성능 최적화를 위해 함수를 메모이제이션하는 훅
	 */
	const refresh = useCallback(async () => {
		setPage(0);
		setHasMore(true);
		// 페이지가 이미 0이면 useEffect가 트리거되지 않으므로 직접 호출
		await fetchBoards(order, 0, keyword);
	}, [order, keyword, fetchBoards, setPage]);

	/**
	 * @description 특정 게시글의 정보를 개별적으로 수정하기 위한 함수
	 * @param {BoardListItemDto} updatedBoard - 업데이트된 게시글 데이터
	 * useCallback: 동일한 함수 참조를 유지하기 위한 훅
	 */
	const updateBoard = useCallback((updatedBoard: BoardListItemDto) => {
		setBoards((prev) => prev.map((board) => (board.boardId === updatedBoard.boardId ? updatedBoard : board)));
	}, []);

	/**
	 * @description 특정 게시글을 목록에서 제거하기 위한 함수
	 * @param {number} boardId - 삭제할 게시글의 ID
	 * useCallback: 함수를 메모이제이션하여 불필요한 연산을 줄이기 위한 훅
	 */
	const removeBoard = useCallback((boardId: number) => {
		setBoards((prev) => prev.filter((board) => board.boardId !== boardId));
	}, []);

	return {
		boards,
		loading,
		error,
		hasMore,
		order,
		setOrder: handleSetOrder,
		keyword,
		setKeyword: handleSetKeyword,
		lastElementRef,
		refresh,
		fetchBoards,
		updateBoard,
		removeBoard,
	};
}

