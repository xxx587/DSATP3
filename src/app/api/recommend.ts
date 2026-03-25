/**
 * @file recommend.ts
 * @description 날씨 및 성별 기반 의류 추천 관련 API 요청을 처리하기 위한 함수 모듈
 * 기온과 성별 정보를 바탕으로 서버의 추천 알고리즘에 따른 적절한 코디 목록을 제공함
 */

import { api } from '@/lib/axios';
import { RecommendEntity } from '@/types/recommend';

/**
 * @description 특정 기온과 성별 조건에 맞는 의류 추천 목록을 조회하기 위한 함수
 * @param {number} temp - 현재 기온 (섭씨 기준)
 * @param {string} gender - 추천을 받을 사용자의 성별 ('MALE', 'FEMALE' 등)
 * @returns {Promise<RecommendEntity[]>} 추천된 의류 아이템 목록 배열을 담은 Promise 객체
 */

export const getRecommendation = async (temp: number, gender: string): Promise<RecommendEntity[]> => {
	const response = await api.get<RecommendEntity[]>('/recommends', { params: { temp, gender } });
	return response.data;
};
