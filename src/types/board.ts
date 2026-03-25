/**
 * @file board.ts
 * @description 게시글 관련 데이터 구조(DTO) 및 훅의 인터페이스를 정의하기 위한 파일
 */

import { PresetResponseDto } from './preset';
import { UsePostActionsLang } from './languague/lang';

/** @description 게시글 목록 정렬 방식 */
export type OrderType = 'recent' | 'like';

/** @description 게시글 데이터 정보 (List/Item) */
export interface BoardListItemDto {
	boardId: number;
	userId: number;
	nickname: string;
	content: string;
	imageUrl: string;
	likeCount: number;
	commentCount: number;
	createdAt: string;
	liked?: boolean;
	bookmarked?: boolean;
	preset: PresetResponseDto | null;
}

/** @description 게시글 작성/수정 시 필요한 데이터 */
export interface BoardWrite {
	content: string;
	imageUrl: string;
	presetId: number | null;
}

/** @description 좋아요 토글 결과 응답 데이터 */
export interface LikeResult {
	liked: boolean;
	likeCount: number;
}

/** @description 북마크 토글 결과 응답 데이터 */
export interface BookmarkResult {
	bookmarked: boolean;
}

/** @description usePostActions 훅의 반환 타입 */
export interface UsePostActionsReturn {
	isLiked: boolean;
	likeCount: number;
	isBookmarked: boolean;
	handleToggleLike: () => Promise<void>;
	handleToggleBookmark: () => Promise<void>;
	handleDelete: () => Promise<void>;
	handleReport: () => Promise<void>;
	dict: UsePostActionsLang;
}

/** @description useBoards 훅의 Props 인터페이스 */
export interface UseBoardsProps {
	pageSize?: number;
	initialData?: BoardListItemDto[];
}

/** @description useBoards 훅의 반환 타입 */
export interface UseBoardsReturn {
	boards: BoardListItemDto[];
	loading: boolean;
	error: string | null;
	hasMore: boolean;
	order: OrderType;
	setOrder: (newOrder: OrderType) => void;
	keyword: string;
	setKeyword: (newKeyword: string) => void;
	lastElementRef: (node: HTMLElement | null) => void;
	refresh: () => Promise<void>;
	fetchBoards: (currentOrder: OrderType, currentPage: number, currentKeyword: string) => Promise<void>;
	updateBoard: (updatedBoard: BoardListItemDto) => void;
	removeBoard: (boardId: number) => void;
}
