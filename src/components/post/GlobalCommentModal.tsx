/**
 * @file GlobalBoardModal.tsx
 * @description 전역 게시글 모달 관리 컴포넌트
 * URL의 쿼리 파라미터(boardId, commentBoardId)를 감시하여 게시글 상세 모달(Comment)을 표시
 * 어디서나 URL 조작만으로 게시글 모달을 열 수 있도록 구현
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { BoardListItemDto } from '@/types/board';
import { getBoardDetail } from '@/app/api/board';
import Comment from './Comment';
import { usePostActions } from '@/hooks/usePostActions';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import WriteContent from './WriteContent';
import useRequireAuth from '@/hooks/useRequireAuth';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

const BoardModalContent = ({
	board,
	onClose,
	setBoard,
}: {
	board: BoardListItemDto;
	onClose: () => void;
	setBoard: (board: BoardListItemDto) => void;
}) => {
	/**
	 * useCurrentUser: 현재 로그인한 사용자의 정보를 가져와 게시글 작성자 여부를 확인하기 위한 커스텀 훅
	 */
	const { isLoggedIn, nickname: currentNickname } = useCurrentUser();

	/**
	 * useRequireAuth: 게시글 수정 액션 시 사용자의 로그인 여부를 확인하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	/**
	 * useState: 게시글 수정을 위한 작성 모달(WriteContent)의 활성화 여부를 관리하기 위한 훅
	 */
	const [isEditing, setIsEditing] = useState(false);

	/**
	 * useState: 게시글의 댓글 수 상태를 관리하고 하위 컴포넌트(Comment)에서의 변경 사항을 반영하기 위한 훅
	 */
	const [currentCommentCount, setCurrentCommentCount] = useState(board.commentCount);

	/**
	 * usePostActions: 좋아요, 북마크, 게시글 삭제/신고와 같은 포스트 기반 액션의 비즈니스 로직을 처리하기 위한 커스텀 훅
	 */
	const { isLiked, likeCount, isBookmarked, handleToggleLike, handleToggleBookmark, handleDelete, handleReport } =
		usePostActions(board, onClose);

	const isPostOwner = isLoggedIn && currentNickname === board.nickname;

	const handleEdit = useCallback(() => {
		if (!checkAuth()) return;
		setIsEditing(true);
	}, [checkAuth]);

	return (
		<>
			<Comment
				board={board}
				likeCount={likeCount}
				onClose={onClose}
				currentCommentCount={currentCommentCount}
				onCommentChange={(change) => setCurrentCommentCount((prev) => prev + change)}
				isLiked={isLiked}
				isBookmarked={isBookmarked}
				onToggleLike={handleToggleLike}
				onToggleBookmark={handleToggleBookmark}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onReport={handleReport}
				isPostOwner={isPostOwner}
				isLoggedIn={isLoggedIn}
				currentNickname={currentNickname}
			/>

			{isEditing && (
				<WriteContent
					onClose={() => setIsEditing(false)}
					onSuccess={(updated) => {
						if (updated) {
							setBoard(updated);
							window.dispatchEvent(
								new CustomEvent('board-update', {
									detail: { boardId: board.boardId, updatedBoard: updated },
								}),
							);
						}
						setIsEditing(false);
					}}
					initialCaption={board.content}
					initialImage={board.imageUrl || null}
					initialPresetId={board.preset?.presetId}
					boardId={board.boardId}
				/>
			)}
		</>
	);
};

const GlobalBoardModal = () => {
	/**
	 * useSearchParams: URL의 쿼리 스트링(boardId, commentBoardId)을 실시간으로 감시하여 모달 오픈 여부를 결정하기 위한 훅
	 */
	const searchParams = useSearchParams();

	/**
	 * useRouter: 모달을 닫을 때 URL에서 게시글 관련 파라미터를 제거하여 라우팅하기 위한 훅
	 */
	const router = useRouter();

	/**
	 * usePathname: 현재 페이지의 경로 정보를 가져와 쿼리 스트링 제거 후의 기점 경로로 사용하기 위한 훅
	 */
	const pathname = usePathname();

	const boardIdParam = searchParams.get('boardId');
	const commentBoardIdParam = searchParams.get('commentBoardId');
	const targetBoardId = boardIdParam || commentBoardIdParam;

	/**
	 * useState: 서버에서 가져온 상세 게시글 데이터를 저장하고 관리하기 위한 훅
	 */
	const [board, setBoard] = useState<BoardListItemDto | null>(null);

	/**
	 * useState: 데이터 패칭 중에 화면을 가릴 수 있도록 로딩 상태를 관리하기 위한 훅
	 */
	const [loading, setLoading] = useState(false);
	const paramsString = searchParams.toString();

	/**
	 * @description 모달을 닫고 URL에서 게시글 관련 파라미터를 제거하는 핸들러
	 */
	const handleClose = useCallback(() => {
		const params = new URLSearchParams(paramsString);
		params.delete('boardId');
		params.delete('commentBoardId');
		params.delete('commentId');

		const queryString = params.toString();
		router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
	}, [router, pathname, paramsString]);

	/**
	 * useLanguage: 게시글 로딩 실패 시 표시할 토스트 메시지 등을 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].globalCommentModalComponent;

	/**
	 * useEffect: targetBoardId가 변경될 때마다 서버에 게시글 상세 정보를 요청(getBoardDetail)하기 위한 생명주기 훅
	 */
	useEffect(() => {
		if (targetBoardId) {
			// 이미 해당 게시글 정보가 있고, targetBoardId가 동일하다면 다시 fetch하지 않음 (로딩 상태 방지)
			if (board && String(board.boardId) === targetBoardId) {
				return;
			}

			const fetchBoard = async () => {
				setLoading(true);
				try {
					const response = await getBoardDetail(Number(targetBoardId));
					setBoard(response);
				} catch (error) {
					toast.error(dict.loadingErrorToast);
					console.error('게시글 로딩에 실패', error);
					handleClose();
				} finally {
					setLoading(false);
				}
			};
			fetchBoard();
		} else {
			setBoard(null);
		}
	}, [targetBoardId, handleClose, dict, board]);

	if (!targetBoardId || !board || loading) return null;

	return <BoardModalContent board={board} onClose={handleClose} setBoard={setBoard} />;
};

export default GlobalBoardModal;
