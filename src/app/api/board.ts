/**
 * @file board.ts
 * @description 게시글(Board) 관련 API 요청을 처리하기 위한 함수 모듈
 * 게시글 목록 조회, 상세 정보 조회, 검색, 작성, 수정, 삭제 기능을 포함
 * 좋아요 및 북마크와 같은 사용자 상호작용 관련 비동기 통신을 처리
 */

import { api } from '@/lib/axios';
import { BoardListItemDto, BoardWrite, OrderType, LikeResult, BookmarkResult } from '@/types/board';

/**
 * @description 게시글 목록을 조회하기 위한 함수
 * @param {OrderType} order - 정렬 기준 ('recent' | 'like')
 * @param {number} page - 조회할 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<BoardListItemDto[]>} 게시글 목록 배열을 담은 Promise 객체
 */
export const getBoard = async (
	order: OrderType = 'recent',
	page: number = 0,
	size: number = 20,
): Promise<BoardListItemDto[]> => {
	const response = await api.get<BoardListItemDto[]>('/boards', {
		params: { order, page, size },
	});
	return response.data;
};

/**
 * @description 특정 게시글 하나를 조회하기 위한 함수
 * @param {number} boardId - 조회할 게시글의 고유 식별자 ID
 * @returns {Promise<BoardListItemDto>} 게시글 상세 정보를 담은 Promise 객체
 */
export const getBoardDetail = async (boardId: number): Promise<BoardListItemDto> => {
	const response = await api.get<BoardListItemDto>(`/boards/${boardId}`);
	return response.data;
};

/**
 * @description 게시글을 검색하기 위한 함수
 * @param {string} keyword - 검색할 단어
 * @param {number} page - 조회할 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<BoardListItemDto[]>} 검색 결과 목록을 담은 Promise 객체
 */
export const searchBoards = async (
	keyword: string,
	page: number = 0,
	size: number = 20,
): Promise<BoardListItemDto[]> => {
	const response = await api.get<BoardListItemDto[]>('/boards/search', {
		params: { keyword, page, size },
	});
	return response.data;
};

/**
 * @description 새 게시글을 작성하기 위한 함수
 * @param {BoardWrite | FormData} payload - 작성할 게시글 데이터
 * @returns {Promise<BoardListItemDto>} 생성된 게시글 정보를 담은 Promise 객체
 */
export const boardWrite = async (payload: BoardWrite | FormData): Promise<BoardListItemDto> => {
	const response = await api.post<BoardListItemDto>('/boards', payload);
	return response.data;
};

/**
 * @description 게시글을 삭제하기 위한 함수
 * @param {number} boardId - 삭제할 게시글의 고유 식별자 ID
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const boardDelete = async (boardId: number): Promise<void> => {
	await api.delete(`/boards/${boardId}`);
};

/**
 * @description 게시글을 수정하기 위한 함수
 * @param {number} boardId - 수정할 게시글의 고유 식별자 ID
 * @param {BoardWrite | FormData} payload - 수정할 게시글 데이터
 * @returns {Promise<BoardListItemDto>} 수정된 게시글 정보를 담은 Promise 객체
 */
export const boardUpdate = async (boardId: number, payload: BoardWrite | FormData): Promise<BoardListItemDto> => {
	const response = await api.put<BoardListItemDto>(`/boards/${boardId}`, payload);
	return response.data;
};

/**
 * @description 게시글 좋아요를 토글하기 위한 함수
 * @param {number} boardId - 게시글의 고유 식별자 ID
 * @returns {Promise<LikeResult>} 좋아요 변경 결과를 담은 Promise 객체
 */
export const boardLike = async (boardId: number): Promise<LikeResult> => {
	const response = await api.post<LikeResult>(`/boards/${boardId}/like`);
	return response.data;
};

/**
 * @description 게시글 북마크를 토글하기 위한 함수
 * @param {number} boardId - 게시글의 고유 식별자 ID
 * @returns {Promise<BookmarkResult>} 북마크 변경 결과를 담은 Promise 객체
 */
export const boardBookmark = async (boardId: number): Promise<BookmarkResult> => {
	const response = await api.post<BookmarkResult>(`/boards/${boardId}/bookmark`);
	return response.data;
};
