/**
 * @file preset.ts
 * @description 사용자 정의 의류 조합(Preset) 관련 API 요청을 처리하기 위한 함수 모듈
 * 프리셋 생성, 내 프리셋 목록 조회, 프리셋 정보 수정, 삭제 및 상세 조회 기능을 포함
 * 가상 피팅 모델의 코디네이트 데이터를 관리하기 위한 비동기 통신을 처리
 */

import { api } from '@/lib/axios';
import { PresetCreateRequestDto, PresetResponseDto, PresetUpdateRequestDto } from '@/types/preset';

/**
 * @description 새로운 의류 조합 프리셋을 생성하기 위한 함수
 * @param {PresetCreateRequestDto} payload - 생성할 프리셋 정보 (이름, 포함된 옷 ID 목록 등)
 * @returns {Promise<PresetResponseDto>} 생성된 프리셋 상세 정보를 담은 Promise 객체
 */
export const createPreset = async (payload: PresetCreateRequestDto): Promise<PresetResponseDto> => {
	const response = await api.post<PresetResponseDto>('/presets', payload);
	return response.data;
};

/**
 * @description 현재 로그인한 사용자가 생성한 모든 프리셋 목록을 조회하기 위한 함수
 * @returns {Promise<PresetResponseDto[]>} 내 프리셋 목록 배열을 담은 Promise 객체
 */
export const getMyPresets = async (): Promise<PresetResponseDto[]> => {
	const response = await api.get<PresetResponseDto[]>('/presets/my');
	return response.data;
};

/**
 * @description 기존 프리셋의 정보를 수정하기 위한 함수
 * @param {number} presetId - 수정할 프리셋의 고유 식별자 ID
 * @param {PresetUpdateRequestDto} payload - 수정할 내용 (이름 변경 또는 구성 의류 변경 등)
 * @returns {Promise<PresetResponseDto>} 수정된 프리셋 상세 정보를 담은 Promise 객체
 */
export const updatePreset = async (presetId: number, payload: PresetUpdateRequestDto): Promise<PresetResponseDto> => {
	const response = await api.put<PresetResponseDto>(`/presets/${presetId}`, payload);
	return response.data;
};

/**
 * @description 특정 프리셋을 삭제하기 위한 함수
 * @param {number} presetId - 삭제할 프리셋의 고유 식별자 ID
 * @returns {Promise<void>} 결과값이 없는 Promise 객체
 */
export const deletePreset = async (presetId: number): Promise<void> => {
	await api.delete(`/presets/${presetId}`);
};

/**
 * @description 특정 프리셋의 상세 정보(포함된 의류 목록 등)를 조회하기 위한 함수
 * @param {number} presetId - 조회할 프리셋의 고유 식별자 ID
 * @returns {Promise<PresetResponseDto>} 프리셋 상세 정보를 담은 Promise 객체
 */
export const getPresetDetail = async (presetId: number): Promise<PresetResponseDto> => {
	const response = await api.get<PresetResponseDto>(`/presets/${presetId}`);
	return response.data;
};
