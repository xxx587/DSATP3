/**
 * @file comment.ts
 * @description 게시글의 댓글 및 대댓글 관련 API 요청을 처리하기 위한 함수 모듈
 * 댓글 목록 조회, 신규 댓글 작성, 기존 댓글 수정 및 삭제 기능을 포함
 */

import { api } from '@/lib/axios';
import { CommentListItemDto } from '@/types/comment';

/**
 * @description 특정 게시글에 달린 전체 댓글 및 대댓글 목록을 조회하기 위한 함수
 * @param {number} boardId - 댓글을 조회할 게시글의 고유 식별자 ID
 * @returns {Promise<CommentListItemDto[]>} 댓글 목록 배열을 담은 Promise 객체
 */
export const getComment = async (boardId: number): Promise<CommentListItemDto[]> => {
	const response = await api.get<CommentListItemDto[]>(`/boards/${boardId}/comments`);
	return response.data;
};

/**
 * @description 특정 게시글에 새로운 댓글 또는 대댓글을 등록하기 위한 함수
 * @param {number} boardId - 댓글을 등록할 게시글의 고유 식별자 ID
 * @param {string} content - 등록할 댓글의 내용
 * @param {number | null} parentCommentId - 부모 댓글의 ID (대댓글인 경우 필수, 일반 댓글은 null)
 * @returns {Promise<CommentListItemDto>} 생성된 댓글 정보를 담은 Promise 객체
 */
export const addComment = async (boardId: number, content: string, parentCommentId: number | null = null): Promise<CommentListItemDto> => {
	const response = await api.post<CommentListItemDto>(`/boards/${boardId}/comments`, { content, parentCommentId });
	return response.data;
};

/**
 * @description 이미 작성된 댓글의 내용을 수정하기 위한 함수
 * @param {number} boardId - 해당 댓글이 속한 게시글의 고유 식별자 ID
 * @param {number} commentId - 수정할 댓글의 고유 식별자 ID
 * @param {string} content - 수정할 새로운 댓글 내용
 * @returns {Promise<CommentListItemDto>} 수정된 댓글 정보를 담은 Promise 객체
 */
export const updateComment = async (boardId: number, commentId: number, content: string): Promise<CommentListItemDto> => {
	const response = await api.put<CommentListItemDto>(`/boards/${boardId}/comments/${commentId}`, { content });
	return response.data;
};

/**
 * @description 작성된 댓글을 삭제하기 위한 함수
 * @param {number} boardId - 해당 댓글이 속한 게시글의 고유 식별자 ID
 * @param {number} commentId - 삭제할 댓글의 고유 식별자 ID
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const deleteComment = async (boardId: number, commentId: number): Promise<void> => {
	const response = await api.delete(`/boards/${boardId}/comments/${commentId}`);
	return response.data;
};
