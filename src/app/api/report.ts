/**
 * @file report.ts
 * @description 게시글 및 댓글의 신고 처리를 담당하는 API 함수 모듈
 * 부적절한 콘텐츠에 대해 사유를 포함하여 관리자에게 신고하는 기능을 제공함
 */

import { api } from '@/lib/axios';

/**
 * @description 특정 게시글을 부적절한 사유로 신고하기 위한 함수
 * @param {number} boardId - 신고할 게시글의 고유 식별자 ID
 * @param {string} reason - 신고하는 구체적인 사유
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const boardReport = async (boardId: number, reason: string): Promise<void> => {
	const response = await api.post(`/boards/${boardId}/report`, { reason });
	return response.data;
};

/**
 * @description 특정 댓글을 부적절한 사유로 신고하기 위한 함수
 * @param {number} boardId - 해당 댓글이 달린 게시글의 고유 식별자 ID
 * @param {number} commentId - 신고할 댓글의 고유 식별자 ID
 * @param {string} reason - 신고하는 구체적인 사유
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const commentReport = async (boardId: number, commentId: number, reason: string): Promise<void> => {
	const response = await api.post(`/boards/${boardId}/comments/${commentId}/report`, { reason });
	return response.data;
};
