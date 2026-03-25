/**
 * @file InstaPost.tsx
 * @description 인스타그램 스타일의 게시글 카드 컴포넌트
 * 게시글 이미지, 좋아요/댓글/북마크 액션 버튼, 게시글 내용을 카드 형태로 표시
 * 더보기(BoardEtc) 메뉴, 댓글 모달(Comment), 수정 모달(WriteContent)을 포함
 * usePostActions 훅으로 좋아요/북마크/삭제/신고 상태를 관리
 */

'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PostImage from './PostImage';
import PostActions from './PostAction';
import PostContent from './PostContent';
import BoardEtc from './BoardEtc';
import WriteContent from './WriteContent';
import { BoardListItemDto } from '@/types/board';
import { usePostActions } from '@/hooks/usePostActions';
import useRequireAuth from '@/hooks/useRequireAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';

/**
 * @description InstaPost 컴포넌트의 Props 인터페이스
 * @property {BoardListItemDto} board - 카드에 표시할 게시글의 전체 정보를 담고 있는 데이터 객체
 * @property {(updatedBoard?: BoardListItemDto) => void} onSuccess - 게시글의 수정 등에 성공했을 때 부모 컴포넌트의 상태를 동기화하기 위한 콜백 함수
 * @property {(boardId: number) => void} onDelete - 게시글 삭제 시 부모 목록에서 해당 항목을 제거하기 위한 콜백 함수
 */
interface InstaPostProps {
	board: BoardListItemDto;
	onSuccess?: (updatedBoard?: BoardListItemDto) => void;
	onDelete?: (boardId: number) => void;
}

/**
 * @description 인스타그램 스타일의 게시글 카드 컴포넌트
 *              게시글 이미지, 좋아요/댓글/북마크 액션 버튼, 게시글 내용을 카드 형태로 표시
 *              BoardEtc 메뉴, 댓글 모달(Comment), 수정 모달(WriteContent)도 포함
 * @param {InstaPostProps} props - 컴포넌트 Props
 * @return {TSX.Element} 게시글 카드 UI
 */
const InstaPost = ({ board, onSuccess, onDelete }: InstaPostProps) => {
	/**
	 * useSearchParams: URL의 쿼리 스트링(예: boardId)을 읽어와 댓글 모달 표시 여부 등을 판단하기 위한 훅
	 */
	const searchParams = useSearchParams();

	/**
	 * useRouter: 댓글 모달을 열거나 닫을 때 URL의 쿼리 파라미터를 변경하여 라우팅하기 위한 훅
	 */
	const router = useRouter();

	/**
	 * usePathname: 현재 페이지의 경로 정보를 가져와 쿼리 스트링 변경 시 기본 경로로 사용하기 위한 훅
	 */
	const pathname = usePathname();

	/**
	 * useState: '더보기' 메뉴(삭제, 신고 등)의 노출 여부를 상태로 관리하기 위한 훅
	 */
	const [showEtc, setShowEtc] = useState(false);

	/**
	 * useState: 게시글 수정을 위한 모달 창의 활성화 상태를 관리하기 위한 훅
	 */
	const [isEditing, setIsEditing] = useState(false);

	/**
	 * useState: 게시글의 실시간 댓글 수를 관리하고 데이터 변경 시 동기화하기 위한 훅
	 */
	const [currentCommentCount, setCurrentCommentCount] = useState(board.commentCount);
	const [prevCommentCount, setPrevCommentCount] = useState(board.commentCount);

	if (board.commentCount !== prevCommentCount) {
		setPrevCommentCount(board.commentCount);
		setCurrentCommentCount(board.commentCount);
	}

	/**
	 * usePostActions: 좋아요, 북마크, 게시글 삭제 및 신고와 관련된 비즈니스 로직을 처리하기 위한 커스텀 훅
	 */
	const { isLiked, likeCount, isBookmarked, handleToggleLike, handleToggleBookmark, handleDelete, handleReport } =
		usePostActions(board, onDelete ? () => onDelete(board.boardId) : undefined);

	/**
	 * useCurrentUser: 현재 로그인한 사용자의 정보를 가져와 게시글 작성자 여부를 확인하기 위한 커스텀 훅
	 */
	const { isLoggedIn, nickname: currentNickname } = useCurrentUser();

	// 게시글 작성자 여부 (로그인 + 닉네임 일치)
	const isPostOwner = isLoggedIn && currentNickname === board.nickname;

	/**
	 * @description 게시글 카드의 우측 하단 '더보기' 메뉴의 노출 상태를 반전시키기 위한 토글 핸들러 함수
	 */
	const toggleEtc = useCallback(() => setShowEtc((prevShowEtc) => !prevShowEtc), []);

	/**
	 * @description 해당 게시글의 댓글 모달을 열기 위한 핸들러 함수
	 * 현재 URL의 쿼리 스트링에 boardId를 추가하여 전역 댓글 모달이 활성화되도록 처리하기 위한 로직을 포함
	 */
	const toggleComments = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('boardId', String(board.boardId));
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
		setShowEtc(false);
	}, [board.boardId, pathname, router, searchParams]);

	/**
	 * useRequireAuth: 좋아요나 수정 등 인증이 필요한 액션 실행 전 로그인 여부를 확인하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	/**
	 * @description 게시글 수정 모달 창을 띄우기 위한 핸들러 함수
	 * 사용자 인증 여부를 확인한 후, 권한이 있을 경우에만 수정 모드(Editing)를 활성화하기 위한 로직을 포함
	 */
	const handleEdit = useCallback(() => {
		if (!checkAuth()) return;
		setIsEditing(true);
		setShowEtc(false);
	}, [checkAuth]);

	// 날짜 포맷
	const dateObj = new Date(board.createdAt);
	const formattedDate = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

	return (
		<div className='relative max-w-lg mx-auto'>
			<div className='bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 group'>
				<PostImage src={encodeURI(board.imageUrl) || ''} />

				<PostActions
					isLiked={isLiked}
					isBookmarked={isBookmarked}
					likeCount={likeCount}
					commentCount={currentCommentCount}
					bookmarkCount={0}
					onToggleLike={handleToggleLike}
					onToggleComments={toggleComments}
					onToggleBookmark={handleToggleBookmark}
					onToggleEtc={toggleEtc}
					showEtcButton={isLoggedIn}
					showBookmarkButton={!!board.preset?.presetId && !isPostOwner}
				/>

				<div className='px-4 pb-4'>
					<PostContent nickname={board.nickname} date={formattedDate} content={board.content} />
				</div>
			</div>

			{showEtc && (
				<div className='absolute inset-0 z-45 bg-zinc-950/90 flex items-center justify-center rounded-sm'>
					<BoardEtc
						onClose={() => setShowEtc(false)}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onReport={handleReport}
						isOwner={isPostOwner}
					/>
				</div>
			)}

			{isEditing && (
				<WriteContent
					onClose={() => setIsEditing(false)}
					onSuccess={onSuccess}
					initialCaption={board.content}
					initialImage={board.imageUrl || null}
					initialPresetId={board.preset?.presetId}
					boardId={board.boardId}
				/>
			)}
		</div>
	);
};

export default InstaPost;
