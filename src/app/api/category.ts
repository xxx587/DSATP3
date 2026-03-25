/**
 * @file category.ts
 * @description 의류 카테고리 정보 조회를 처리하기 위한 API 함수 모듈
 * 서버에 정의된 모든 의류 카테고리 목록을 가져오는 기능을 제공
 */

import { api } from '@/lib/axios';
import { CategoryDto } from '@/types/closet';

/**
 * @description 서버에서 전체 카테고리 목록을 조회하기 위한 함수
 * @returns {Promise<CategoryDto[]>} 카테고리 정보 배열을 담은 Promise 객체
 */
export const getCategories = async (): Promise<CategoryDto[]> => {
	const response = await api.get<CategoryDto[]>('/categories');
	return response.data;
};
