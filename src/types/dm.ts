/**
 * @file dm.ts
 * @description 1:1 메시지(DM) 관련 데이터 구조(DTO)를 정의하기 위한 파일
 */

/** @description 메시지 데이터 정보 */
export interface DmResponseDTO {
	dmId: number;
	senderNickname: string;
	receiverNickname: string;
	content: string;
	read: boolean;
	createdAt: string;
}
