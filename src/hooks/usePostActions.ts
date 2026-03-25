/**
 * @file usePostActions.ts
 * @description 게시글 액션 커스텀 훅
 * 좋아요, 북마크, 삭제, 신고 기능의 상태 및 핸들러를 관리
 * 로그인 인증을 포함한 API 호출 처리
 */

import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { boardBookmark, boardDelete, boardLike } from '@/app/api/board';
import { boardReport } from '@/app/api/report';
import { BoardListItemDto, LikeResult, UsePostActionsReturn } from '@/types/board';
import { useMounted } from '@/hooks/useMounted';
import useRequireAuth from '@/hooks/useRequireAuth';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useDialog } from '@/context/DialogContext';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
/**
 * @description 게시글 액션 관리 커스텀 훅
 * @param {BoardListItemDto} board - 게시글 데이터
 * @return {UsePostActionsReturn}
 */
export function usePostActions(board: BoardListItemDto, onDeleteSuccess?: () => void): UsePostActionsReturn {
	/**
	 * useLanguage: 현재 언어 설정을 가져와 다국어 사전에 접근하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();

	/**
	 * useDialog: 공통 컨펌 및 프롬프트 다이얼로그를 사용하여 사용자 입력을 받기 위한 컨텍스트 훅
	 */
	const { confirm, prompt } = useDialog();
	const dict = dictionaries[currentLang].usePostActions;

	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 좋아요 여부, 좋아요 수, 북마크 상태 등을 개별적으로 추적함
	 */
	const [isLiked, setIsLiked] = useState(!!board.liked);
	const [likeCount, setLikeCount] = useState(board.likeCount);
	const [isBookmarked, setIsBookmarked] = useState(!!board.bookmarked);
	const [prevBoard, setPrevBoard] = useState(board);

	/**
	 * useMounted: 컴포넌트가 브라우저에 마운트되었는지 확인하여 CSR 전용 기능(쿠키 접근 등)을 안전하게 처리하기 위한 커스텀 훅
	 */
	const mounted = useMounted();
	const hasToken = mounted ? !!Cookies.get('access_token') : false;

	/**
	 * useRequireAuth: 로그인 상태를 확인하고 비로그인 사용자의 접근을 제한하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	// 게시글 데이터가 변경되면 상태를 최신화하기 위한 동기화 로직
	if (board !== prevBoard) {
		setPrevBoard(board);
		setIsLiked(!!board.liked);
		setLikeCount(board.likeCount);
		setIsBookmarked(!!board.bookmarked);
	}

	/**
	 * @description 좋아요 상태를 서버와 연동하여 토글하기 위한 비동기 함수
	 * useCallback: API 호출 및 상태 업데이트 로직을 메모이제이션하여 성능을 최적화하기 위한 훅
	 */
	const handleToggleLike = useCallback(async () => {
		if (!checkAuth()) return;
		try {
			const response: LikeResult = await boardLike(board.boardId);
			setIsLiked(response.liked);
			setLikeCount(response.likeCount);
			window.dispatchEvent(
				new CustomEvent('board-update', {
					detail: { boardId: board.boardId, likeCount: response.likeCount, liked: response.liked },
				}),
			);
		} catch (error) {
			toast.error(dict.likeError);
			console.error('좋아요 처리 실패', error);
		}
	}, [board.boardId, checkAuth, dict]);

	/**
	 * @description 북마크 상태를 서버와 연동하여 토글하기 위한 비동기 함수
	 * useCallback: 동일한 함수 참조를 유지하여 불필요한 리렌더링을 방지하기 위한 훅
	 */
	const handleToggleBookmark = useCallback(async () => {
		if (!checkAuth()) return;
		try {
			const response = await boardBookmark(board.boardId);
			setIsBookmarked(response.bookmarked);
			window.dispatchEvent(new CustomEvent('board-update', { 
				detail: { boardId: board.boardId, bookmarked: response.bookmarked } 
			}));
		} catch (error) {
			toast.error(dict.bookmarkError);
			console.error('북마크 처리 실패', error);
		}
	}, [board.boardId, checkAuth, dict]);

	/**
	 * @description 게시글을 삭제하기 위한 비동기 핸들러 함수
	 * 사용자 확인 절차를 거친 후 서버에서 삭제하고 필요 시 페이지를 새로고침하거나 성공 콜백을 호출함
	 */
	const handleDelete = async () => {
		if (!checkAuth()) return;
		if (await confirm(dict.deleteConfirm)) {
			try {
				await boardDelete(board.boardId);

				window.dispatchEvent(
					new CustomEvent('board-delete', {
						detail: { boardId: board.boardId },
					}),
				);

				if (onDeleteSuccess) {
					onDeleteSuccess();
				} else {
					window.location.reload();
				}
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					const status = error.response.status;
					if (status === 403) {
						console.error(error.response);
						toast.error(dict.notAuthorError);
					} else {
						console.error(error.response);
						toast.error(dict.deleteFail);
					}
				}
			}
		}
	};

	/**
	 * @description 특정 게시글을 신고하기 위한 비동기 핸들러 함수
	 * 사용자로부터 신고 사유를 입력받아 서버에 전송하고 결과에 맞춰 토스트 메시지를 표시함
	 */
	const handleReport = async () => {
		if (!checkAuth()) return;
		const reason = await prompt(dict.reportPrompt);
		if (reason && reason.trim()) {
			try {
				await boardReport(board.boardId, reason);
				console.log(board.boardId, reason);
				toast.success(dict.reportSuccess);
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					const status = error.response.status;
					if (status === 400) {
						console.error(error.response);
						toast.error(dict.alreadyReportedError);
					} else {
						console.error(error.response);
						toast.error(dict.reportFail);
					}
				}
			}
		}
	};

	return {
		isLiked: hasToken ? isLiked : false,
		likeCount,
		isBookmarked: hasToken ? isBookmarked : false,
		handleToggleLike,
		handleToggleBookmark,
		handleDelete,
		handleReport,
		dict,
	};
}

