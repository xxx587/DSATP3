/**
 * @file closet.ts
 * @description 옷장 아이템 및 카테고리 관련 데이터 구조(DTO)를 정의하기 위한 파일
 */
export interface ClothesResponseDto {
	id: number;
	itemName: string;
	imageUrl: string;
	category: CategoryDto;
	season: string;
	createdAt: string;
}

export type ClosetItem = Pick<ClothesResponseDto, 'createdAt'>

export interface CategoryDto {
	id: number;
	name: string;
}

export interface ClothesForm {
	categoryId: number;
	itemName: string;
	season: string;
	image: File;
}
