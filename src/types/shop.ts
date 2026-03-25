/**
 * @file shop.ts
 * @description 주변 상점 정보와 관련된 데이터 구조(DTO)를 정의하기 위한 파일
 */
export interface ShopResponseDto {
	shopId: number;
	shopName: string;
	address: string;
	phoneNumber: string;
	description: string;
	operationHours: string;
	openTime: string;
	closeTime: string;
	websiteUrl: string;
	tags: string;
	imageUrl: string;
	city: string;
}