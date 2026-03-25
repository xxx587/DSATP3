/**
 * @file dm.ts
 * @description 사용자 간의 다이렉트 메시지(DM) 관련 API 요청을 처리하기 위한 함수 모듈
 * 받은 메시지함 조회, 보낸 메시지함 조회, 신규 메시지 전송 및 상세 조회 기능을 포함
 */

import { api } from '@/lib/axios';
import { DmResponseDTO } from '@/types/dm';

/**
 * @description 현재 로그인한 사용자가 받은 모든 메시지 목록을 조회하기 위한 함수
 * @returns {Promise<DmResponseDTO[]>} 받은 메시지 목록 배열을 담은 Promise 객체
 */
export const getReceiveDms = async (): Promise<DmResponseDTO[]> => {
	const response = await api.get<DmResponseDTO[]>('/dms/received');
	return response.data;
};

/**
 * @description 현재 로그인한 사용자가 보낸 모든 메시지 목록을 조회하기 위한 함수
 * @returns {Promise<DmResponseDTO[]>} 보낸 메시지 목록 배열을 담은 Promise 객체
 */
export const getSentDms = async (): Promise<DmResponseDTO[]> => {
	const response = await api.get<DmResponseDTO[]>('/dms/sent');
	return response.data;
};

/**
 * @description 특정 사용자에게 새로운 다이렉트 메시지를 전송하기 위한 함수
 * @param {string} receiverNickname - 메시지를 받을 사용자의 닉네임
 * @param {string} content - 전송할 메시지 내용
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const sendDm = async (receiverNickname: string, content: string): Promise<void> => {
	const response = await api.post('/dms', { receiverNickname, content });
	return response.data;
};

/**
 * @description 특정 메시지의 내용을 상세하게 조회하기 위한 함수
 * @param {number} dmId - 조회할 메시지의 고유 식별자 ID
 * @returns {Promise<DmResponseDTO>} 메시지 상세 내용을 담은 Promise 객체
 */
export const getDmDetail = async (dmId: number): Promise<DmResponseDTO> => {
	const response = await api.get<DmResponseDTO>(`/dms/${dmId}`);
	return response.data;
};
