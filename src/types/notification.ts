/**
 * @file notification.ts
 * @description 알림 시스템(댓글, 좋아요, DM 등)과 관련된 데이터 구조(DTO)를 정의하기 위한 파일
 */

/** @description 알림 데이터 정보 */
export interface NotificationDto {
	notificationId: number;
	senderId: number;
	senderNickname: string;
	boardId: number | null;
	commentId: number | null;
	type: string;
	message: string;
	isRead: boolean;
	createdAt: string;
}
