/**
 * @file shop.ts
 * @description 의류 쇼핑몰 정보 조회를 처리하기 위한 API 함수 모듈
 * 제휴된 또는 등록된 모든 쇼핑몰 목록을 가져오는 기능을 제공함
 */

import { ShopResponseDto } from '@/types/shop';
import { api } from '@/lib/axios';

/**
 * @description 서버에 등록된 전체 쇼핑몰 목록을 조회하기 위한 함수
 * @returns {Promise<ShopResponseDto[]>} 쇼핑몰 정보 배열을 담은 Promise 객체
 */

export const getAllShops = async (): Promise<ShopResponseDto[]> => {
	const response = await api.get<ShopResponseDto[]>('/shops');
	return response.data;
}