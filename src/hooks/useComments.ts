/**
 * @file useComments.ts
 * @description 댓글 관리 커스텀 훅
 * 게시글의 댓글 CRUD(조회, 작성, 수정, 삭제) 및 신고 기능을 제공
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useDialog } from '@/context/DialogContext';
import useRequireAuth from '@/hooks/useRequireAuth';
import { CommentListItemDto, UseCommentsReturn } from '@/types/comment';
import { getComment, addComment, deleteComment, updateComment } from '@/app/api/comment';
import { commentReport } from '@/app/api/report';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
/**
 * @description 댓글 관리 커스텀 훅. 게시글의 댓글 CRUD 및 신고 기능 제공
 * @param {number} boardId - 댓글을 조회/관리할 게시글 ID
 * @param {(change: number) => void} onCommentChange - 댓글 수 변경 시 호출되는 콜백
 * @return {UseCommentsReturn} 댓글 관리 관련 상태 및 함수
 */
export function useComments(
	boardId: number,
	onCommentChange: (change: number) => void,
	onClose: () => void,
): UseCommentsReturn {
	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 댓글 목록, 입력 값, 수정 모드 상태 및 답글 대상 정보를 저장하기 위해 사용함
	 */
	const [comments, setComments] = useState<CommentListItemDto[]>([]);
	const [input, setInput] = useState('');
	const [showEtc, setShowEtc] = useState(false);
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
	const [editInput, setEditInput] = useState('');
	const [replyingTo, setReplyingTo] = useState<{
		id: number;
		nickname: string;
	} | null>(null);

	/**
	 * useRef: DOM 요소(입력 필드)에 직접 접근하여 포커스를 제어하기 위한 훅
	 */
	const inputRef = useRef<HTMLInputElement>(null);
	const editInputRef = useRef<HTMLInputElement>(null);

	/**
	 * useRequireAuth: 인증 여부를 확인하고 필요 시 로그인 페이지로 유도하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	/**
	 * useDialog: 공통 컨펌 및 프롬프트 다이얼로그를 사용하기 위한 컨텍스트 훅
	 */
	const { confirm, prompt } = useDialog();

	/**
	 * useLanguage: 현재 언어 설정 및 다국어 사전을 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].useComment;

	/**
	 * useEffect: 컴포넌트 마운트 시 또는 게시글 ID가 변경될 때 댓글 목록을 초기 조회하기 위한 훅
	 */
	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await getComment(boardId);
				setComments(response);
			} catch (error) {
				toast.error(dict.commentLoadError);
				console.error('댓글 조회 실패', error);
			}
		};
		fetchComments();
	}, [boardId, dict.commentLoadError]);

	/**
	 * @description 답글 작성을 시작하고 입력 필드에 포커스를 주기 위한 함수
	 * @param {number} commentId - 답글을 달 대상 댓글의 ID
	 * @param {string} nickname - 답글 대상자의 닉네임
	 * useCallback: 불필요한 함수 재생성을 방지하고 메모이제이션하기 위한 훅
	 */
	const handleReplyStart = useCallback(
		(commentId: number, nickname: string) => {
			if (!checkAuth()) return;
			setReplyingTo({ id: commentId, nickname });
			setTimeout(() => inputRef.current?.focus(), 50);
		},
		[checkAuth],
	);

	/**
	 * @description 모달 닫기 시 라우팅 처리를 조율하기 위한 함수
	 * useCallback: 동일한 함수 참조를 유지하기 위한 훅
	 */
	const xButtonRoute = useCallback(() => {
		onClose();
	}, [onClose]);

	/**
	 * @description 답글 작성을 취소하고 상태를 초기화하기 위한 함수
	 * useCallback: 리렌더링 시 함수 참조를 유지하기 위한 훅
	 */
	const handleReplyCancel = useCallback(() => {
		setReplyingTo(null);
		setInput('');
	}, []);

	/**
	 * @description 메인 댓글 입력 필드에 포커스를 주기 위한 함수
	 * useCallback: 이벤트 핸들러를 메모이제이션하기 위한 훅
	 */
	const handleFocus = useCallback(() => {
		inputRef.current?.focus();
	}, []);

	/**
	 * @description 새로운 댓글을 등록하기 위한 비동기 함수
	 * @param {React.FormEvent} event - 폼 제출 이벤트
	 * useCallback: 등록 로직이 포함된 함수를 재사용하여 성능을 최적화하기 위한 훅
	 */
	const handleAdd = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();
			if (!checkAuth()) return;
			if (!input.trim()) return;

			try {
				const parentCommentId = replyingTo?.id || null;
				const response = await addComment(boardId, input, parentCommentId);
				setComments((prev) => [...prev, response]);
				onCommentChange(1);
				window.dispatchEvent(
					new CustomEvent('board-update', {
						detail: { boardId, commentCountChange: 1 },
					}),
				);
				setInput('');
				setReplyingTo(null);
				toast.success(dict.commentWriteSuccess);
			} catch (error) {
				toast.error(dict.commentWriteFail);
				console.error('댓글 작성 실패', error);
			}
		},
		[input, boardId, replyingTo, onCommentChange, checkAuth, dict.commentWriteSuccess, dict.commentWriteFail],
	);

	/**
	 * @description 특정 댓글과 해당 대댓글들을 연쇄적으로 삭제하기 위한 비동기 함수
	 * @param {number} commentId - 삭제할 댓글의 ID
	 * useCallback: 복잡한 삭제 로직이 포함된 함수를 메모이제이션하기 위한 훅
	 */
	const handleDelete = useCallback(
		async (commentId: number) => {
			if (!checkAuth()) return;
			if (await confirm(dict.deleteConfirm)) {
				try {
					/**
					 * 삭제될 본인 및 모든 하위 대댓글(자식, 손자 등)의 ID를 재귀적으로 찾기 위한 내부 유틸리티 함수
					 */
					const getDescendantIds = (targetId: number, allComments: CommentListItemDto[]): number[] => {
						const children = allComments
							.filter((c) => c.parentCommentId === targetId)
							.map((c) => c.commentId);
						let descendants = [...children];
						for (const childId of children) {
							descendants = descendants.concat(getDescendantIds(childId, allComments));
						}
						return descendants;
					};

					const deletedDescendantIds = getDescendantIds(commentId, comments);
					const allDeletedIds = new Set([commentId, ...deletedDescendantIds]);
					const deletedCount = allDeletedIds.size;

					await deleteComment(boardId, commentId);
					console.log(`${boardId}번 게시판 ${commentId}번 댓글 삭제 처리 (총 ${deletedCount}개)`);
					toast.success(dict.deleteSuccess);

					setComments((prev) => prev.filter((comment) => !allDeletedIds.has(comment.commentId)));

					onCommentChange(-deletedCount);
					window.dispatchEvent(
						new CustomEvent('board-update', {
							detail: { boardId, commentCountChange: -deletedCount },
						}),
					);
				} catch (error) {
					if (isAxiosError(error)) {
						const status = error.response?.status;
						if (status === 403) {
							toast.error(dict.notAuthorError);
						} else {
							toast.error(dict.deleteFail);
						}
					} else {
						toast.error(dict.deleteFail);
					}
					console.error('댓글 삭제 실패', error);
				}
			}
		},
		[
			boardId,
			onCommentChange,
			checkAuth,
			comments,
			confirm,
			dict.deleteConfirm,
			dict.deleteSuccess,
			dict.notAuthorError,
			dict.deleteFail,
		],
	);

	/**
	 * @description 수정 모드를 활성화하고 수정용 입력 필드로 포커스를 이동하기 위한 함수
	 * @param {number} commentId - 수정할 댓글의 ID
	 * @param {string} currentContent - 현재 댓글 내용
	 * useCallback: 수정 시작 핸들러를 메모이제이션하기 위한 훅
	 */
	const handleEditStart = useCallback(
		(commentId: number, currentContent: string) => {
			if (!checkAuth()) return;
			setEditingCommentId(commentId);
			setEditInput(currentContent);
			setTimeout(() => editInputRef.current?.focus(), 50);
		},
		[checkAuth],
	);

	/**
	 * @description 수정을 취소하고 입력 필드를 초기화하기 위한 함수
	 * useCallback: 함수 재생성을 방지하기 위한 훅
	 */
	const handleEditCancel = useCallback(() => {
		setEditingCommentId(null);
		setEditInput('');
	}, []);

	/**
	 * @description 수정된 내용을 서버에 제출하고 화면을 갱신하기 위한 비동기 함수
	 * @param {number} commentId - 수정할 댓글의 ID
	 * useCallback: 제출 로직을 메모이제이션하여 성능을 향상시키기 위한 훅
	 */
	const handleEditSubmit = useCallback(
		async (commentId: number) => {
			if (!checkAuth()) return;
			if (!editInput.trim()) return;

			try {
				const response = await updateComment(boardId, commentId, editInput);
				setComments((prev) => prev.map((comment) => (comment.commentId === commentId ? response : comment)));
				setEditingCommentId(null);
				setEditInput('');
				toast.success(dict.editSuccess);
			} catch (error) {
				toast.error(dict.editFail);
				console.error('댓글 수정 실패', error);
			}
		},
		[boardId, editInput, checkAuth, dict.editSuccess, dict.editFail],
	);

	/**
	 * @description 특정 댓글에 대한 신고 접수를 처리하기 위한 비동기 함수
	 * @param {number} commentId - 신고할 댓글의 ID
	 * useCallback: 신고 로직이 포함된 함수를 재생성하지 않기 위한 훅
	 */
	const handleReport = useCallback(
		async (commentId: number) => {
			if (!checkAuth()) return;
			const reason = await prompt(dict.reportPrompt);
			if (reason?.trim()) {
				try {
					await commentReport(boardId, commentId, reason);
					toast.success(dict.reportSuccess);
				} catch (error) {
					toast.error(dict.reportFail);
					console.error('댓글 신고 실패', error);
				}
			}
		},
		[boardId, checkAuth, prompt, dict.reportPrompt, dict.reportSuccess, dict.reportFail],
	);

	return {
		comments,
		input,
		setInput,
		showEtc,
		setShowEtc,
		editingCommentId,
		editInput,
		setEditInput,
		inputRef,
		editInputRef,
		replyingTo,
		handleReplyStart,
		handleReplyCancel,
		handleFocus,
		handleAdd,
		handleDelete,
		handleEditStart,
		handleEditCancel,
		handleEditSubmit,
		handleReport,
		xButtonRoute,
		dict,
	};
}

