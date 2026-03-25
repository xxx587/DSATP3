/**
 * @file notification.ts
 * @description 시스템 및 사용자 알림 관련 API 요청을 처리하기 위한 함수 모듈
 * 알림 목록 조회, 개별 알림 읽음 처리, 개별 및 전체 읽은 알림 삭제 기능을 제공
 */

import { api } from '@/lib/axios';
import { NotificationDto } from '@/types/notification';

/**
 * @description 사용자의 전체 알림 목록을 서버에서 조회하기 위한 함수
 * @returns {Promise<NotificationDto[]>} 알림 정보 목록 배열을 담은 Promise 객체
 */
export const getNotifications = async (): Promise<NotificationDto[]> => {
	const response = await api.get<NotificationDto[]>('/notifications');
	return response.data;
};

/**
 * @description 특정 알림을 사용자가 확인(읽음)한 것으로 상태를 변경하기 위한 함수
 * @param {number} notificationId - 읽음 처리할 알림의 고유 식별자 ID
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const markRead = async (notificationId: number): Promise<void> => {
	const response = await api.post(`/notifications/${notificationId}/read`);
	return response.data;
};

/**
 * @description 특정 알림을 목록에서 영구적으로 삭제하기 위한 함수
 * @param {number} notificationId - 삭제할 알림의 고유 식별자 ID
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const deleteNotification = async (notificationId: number): Promise<void> => {
	const response = await api.delete(`/notifications/${notificationId}`);
	return response.data;
};

/**
 * @description 이미 읽은 상태인 모든 알림을 한꺼번에 삭제하기 위한 함수
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const deleteAllReadNotifications = async (): Promise<void> => {
	const response = await api.delete('/notifications/read');
	return response.data;
};
