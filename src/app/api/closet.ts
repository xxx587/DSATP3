/**
 * @file closet.ts
 * @description 사용자 옷장(내 옷) 관련 API 요청을 처리하기 위한 함수 모듈
 * 내 옷 목록 조회, 옷 상세 정보 조회, 새로운 옷 등록, 정보 수정 및 삭제 기능을 포함
 * 가상 옷장에 의류 데이터를 동기화하기 위한 비동기 통신을 처리
 */

import { api } from '@/lib/axios';
import { ClothesResponseDto, ClothesForm } from '@/types/closet';

/**
 * @description 현재 로그인한 사용자의 전체 옷 목록을 조회하기 위한 함수
 * @returns {Promise<ClothesResponseDto[]>} 등록된 옷 목록 배열을 담은 Promise 객체
 */
export const getMyClothes = async (): Promise<ClothesResponseDto[]> => {
	const response = await api.get<ClothesResponseDto[]>('/clothes');
	return response.data;
};

/**
 * @description 특정 옷의 상세 정보를 조회하기 위한 함수
 * @param {number} clothesId - 조회할 옷의 고유 식별자 ID
 * @returns {Promise<ClothesResponseDto>} 해당 옷의 상세 정보를 담은 Promise 객체
 */
export const getClothesDetail = async (clothesId: number): Promise<ClothesResponseDto> => {
	const response = await api.get<ClothesResponseDto>(`/clothes/${clothesId}`);
	return response.data;
};

/**
 * @description 새로운 옷을 옷장에 등록하기 위한 함수
 * @param {ClothesForm | FormData} payload - 등록할 옷의 정보 (이미지 포함 시 FormData 사용)
 * @returns {Promise<ClothesResponseDto>} 서버에 등록된 옷 정보를 담은 Promise 객체
 */
export const addClothes = async (payload: ClothesForm | FormData): Promise<ClothesResponseDto> => {
	const response = await api.post<ClothesResponseDto>('/clothes', payload);
	return response.data;
};

/**
 * @description 등록된 옷의 정보를 수정하기 위한 함수
 * @param {number} clothesId - 수정할 옷의 고유 식별자 ID
 * @param {ClothesForm | FormData} payload - 수정할 내용 (이미지 변경 시 FormData 사용)
 * @returns {Promise<ClothesResponseDto>} 수정된 옷 정보를 담은 Promise 객체
 */
export const updateClothes = async (
	clothesId: number,
	payload: ClothesForm | FormData,
): Promise<ClothesResponseDto> => {
	const response = await api.put<ClothesResponseDto>(`/clothes/${clothesId}`, payload);
	return response.data;
};

/**
 * @description 등록된 옷을 옷장에서 삭제하기 위한 함수
 * @param {number} clothesId - 삭제할 옷의 고유 식별자 ID
 * @returns {Promise<string>} 삭제 결과 메시지를 담은 Promise 객체
 */
export const deleteClothes = async (clothesId: number): Promise<string> => {
	const response = await api.delete<string>(`/clothes/${clothesId}`);
	return response.data;
};
