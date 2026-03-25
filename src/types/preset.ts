/**
 * @file preset.ts
 * @description 코디 프리셋 생성, 수정, 응답과 관련된 데이터 구조(DTO)를 정의하기 위한 파일
 */
import { ClothesResponseDto } from './closet';

export interface PresetCreateRequestDto {
	title: string;
	description: string;
	clothesIds: number[];
}

export interface PresetUpdateRequestDto {
	title: string;
	description: string;
	clothesIds: number[];
}

export interface PresetResponseDto {
	presetId: number;
	title: string;
	description: string;
	createdAt: string;
	clothesList: ClothesResponseDto[];
}
