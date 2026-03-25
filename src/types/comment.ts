/**
 * @file comment.ts
 * @description 댓글 데이터 구조 및 useComments 훅의 인터페이스를 정의하기 위한 파일
 */
import { UseCommentLang } from './languague/lang';
/** @description 댓글 데이터 정보 */
export interface CommentListItemDto {
	commentId: number;
	parentCommentId: number | null;
	userId: number;
	nickname: string;
	content: string;
	createdAt: string;
}

/** @description useComments 훅의 반환 타입 */
export interface UseCommentsReturn {
	comments: CommentListItemDto[];
	input: string;
	setInput: (val: string) => void;
	showEtc: boolean;
	setShowEtc: (val: boolean) => void;
	editingCommentId: number | null;
	editInput: string;
	setEditInput: (val: string) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
	editInputRef: React.RefObject<HTMLInputElement | null>;
	replyingTo: { id: number; nickname: string } | null;
	handleReplyStart: (commentId: number, nickname: string) => void;
	handleReplyCancel: () => void;
	handleFocus: () => void;
	handleAdd: (e: React.FormEvent) => Promise<void>;
	handleDelete: (commentId: number) => Promise<void>;
	handleEditStart: (commentId: number, currentContent: string) => void;
	handleEditCancel: () => void;
	handleEditSubmit: (commentId: number) => Promise<void>;
	handleReport: (commentId: number) => Promise<void>;
	xButtonRoute: () => void;
	dict: UseCommentLang;
}
