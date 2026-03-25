/**
 * @file recommend.ts
 * @description 날씨 기반 코디 추천 기능과 관련된 데이터 구조를 정의하기 위한 파일
 */
export interface Recommend {
	temp: number;
	gender: string;
}

export interface RecommendEntity {
	recommendId: number;
	minTemp: number;
	maxTemp: number;
	gender: string;
	imageUrl: string;
	description: string;
}
