/**
 * @file Comment.tsx
 * @description 댓글 모달 컴포넌트
 * 게시글 이미지와 본문을 좌측에, 댓글 목록과 입력 폼을 우측에 표시하는 분할 모달
 * 댓글 작성, 수정(인라인 편집), 삭제, 신고 기능을 포함
 * PostActions 컴포넌트로 좋아요/북마크/댓글 카운트를 표시
 */

'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import PostActions from './PostAction';
import BoardEtc from './BoardEtc';
import { BoardListItemDto } from '@/types/board';
import { useComments } from '@/hooks/useComments';
import CommentPostInfo from './CommentPostInfo';
import CommentList from './CommentList';
import CommentInput from './CommentInput';

/**
 * @description Comment 컴포넌트의 Props 인터페이스
 * @property {BoardListItemDto} board - 상세 정보를 표시할 대상 게시글 데이터 객체
 * @property {number} likeCount - 해당 게시글에 현재 기록된 총 좋아요 수 지표
 * @property {() => void} onClose - 댓글 모달 창을 닫기 위해 호출될 이벤트 핸들러 함수
 * @property {boolean} isLiked - 현재 접속한 사용자가 이 게시글에 대해 좋아요를 활성화했는지 여부
 * @property {boolean} isBookmarked - 현재 접속한 사용자가 이 게시글의 코디 프리셋을 북마크했는지 여부
 * @property {number} currentCommentCount - 실시간으로 관리되고 있는 게시글의 전체 댓글 개수 지표
 * @property {(change: number) => void} onCommentChange - 댓글이 추가되거나 삭제됨에 따라 상위 컴포넌트의 댓글 수를 실시간으로 갱신하기 위한 콜백 함수
 * @property {() => void} onToggleLike - 좋아요 아이콘 클릭 시 상태를 반전시키고 서버와 동기화하기 위한 콜백 함수
 * @property {() => void} onToggleBookmark - 북마크 아이콘 클릭 시 프리셋 저장 및 취소 작업을 수행하기 위한 콜백 함수
 * @property {() => void} [onEdit] - 게시글 수정 작업을 시작하기 위해 부모의 편집 모달을 호출하기 위한 함수 (선택적)
 * @property {() => void} [onDelete] - 게시글을 서버와 목록에서 완전히 제거하기 위한 함수 (선택적)
 * @property {() => void} [onReport] - 게시글에 대한 부적절한 내용을 신고 처리하기 위한 함수 (선택적)
 * @property {boolean} isPostOwner - 현재 로그인한 유저가 이 게시글의 작성자인지 여부를 판별하기 위한 상태 값
 * @property {boolean} isLoggedIn - 사용자의 로그인 유무를 확인하여 기능 접근 가능 여부를 결정하기 위한 상태 값
 * @property {string | null} currentNickname - 현재 접속 중인 사용자의 닉네임 문자열 데이터
 */
interface CommentProps {
	board: BoardListItemDto;
	likeCount: number;
	onClose: () => void;
	isLiked: boolean;
	isBookmarked: boolean;
	currentCommentCount: number;
	onCommentChange: (change: number) => void;
	onToggleLike: () => void;
	onToggleBookmark: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	onReport?: () => void;
	isPostOwner?: boolean;
	isLoggedIn?: boolean;
	currentNickname?: string | null;
}

/**
 * @description 댓글 모달 컴포넌트. 게시글 이미지와 본문을 좌측에, 댓글 목록과 입력 폼을 우측에
 *              표시하는 분할 모달. 댓글 작성, 수정, 삭제, 신고 기능을 포함
 * @param {CommentProps} props - 컴포넌트 Props
 * @return {TSX.Element} 댓글 모달 UI
 */
const Comment = ({
	board,
	likeCount,
	onClose,
	isLiked,
	isBookmarked,
	currentCommentCount,
	onCommentChange,
	onToggleLike,
	onToggleBookmark,
	onEdit,
	onDelete,
	onReport,
	isPostOwner = false,
	isLoggedIn = false,
	currentNickname = null,
}: CommentProps) => {
	/**
	 * useComments: 댓글 목록 가져오기, 추가, 수정, 삭제, 신고 및 답글 작성을 위한 비즈니스 로직을 처리하기 위한 커스텀 훅
	 */
	const {
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
	} = useComments(board.boardId, onCommentChange, onClose);

	// 게시글 날짜 포맷팅
	const dateObj = new Date(board.createdAt);
	const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

	// 본문 내용 제목/내용 분리
	const normalized = board.content.replace(/\r\n/g, '\n');
	const splitIndex = normalized.indexOf('\n');
	let title = splitIndex >= 0 ? normalized.slice(0, splitIndex) : normalized;
	let body = splitIndex >= 0 ? normalized.slice(splitIndex + 1) : '';

	if (!title && body) {
		title = body;
		body = '';
	}

	/**
	 * useState: 모달이 처음 나타날 때 애니메이션 효과를 부여하기 위해 초기 마운트 상태를 관리하기 위한 훅
	 */
	const [isFirstMount, setIsFirstMount] = useState(true);

	/**
	 * useEffect: 컴포넌트 마운트 직후 일정 시간(500ms) 뒤에 애니메이션 상태를 변경하기 위한 생명주기 훅
	 */
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsFirstMount(false);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-500 ${isFirstMount ? 'animate-fade-in' : ''}`}
			onClick={xButtonRoute}
		>
			<div
				className='relative bg-zinc-950 w-full h-full flex flex-row shadow-2xl border-l border-r border-zinc-800/50 group/modal'
				onClick={(event) => event.stopPropagation()}
			>
				{/* [왼쪽] 이미지 + 본문 영역 */}
				<CommentPostInfo board={board} formattedDate={formattedDate} title={title} body={body} />

				{/* [오른쪽] 댓글 목록 + 입력 폼 영역 */}
				<div className='w-[400px] h-full flex flex-col bg-zinc-900/50 border-l border-zinc-800/50 relative'>
					<div className='flex items-center justify-between p-6 border-b border-zinc-800/50 shrink-0 bg-zinc-950/20'>
						<div className='flex items-center gap-3'>
							<div className='w-1 h-4 bg-emerald-500 rounded-full' />
							<span className='font-black text-base  tracking-[0.2em] text-zinc-100'>
								{dict.commentTitle || 'Comments'}
							</span>
							<span className='bg-zinc-800 text-zinc-100 text-base font-black px-2 py-0.5 rounded-full'>
								{currentCommentCount}
							</span>
						</div>
						<button
							onClick={xButtonRoute}
							className='text-zinc-500 hover:text-zinc-100 p-2 rounded-xl hover:bg-zinc-800/50 transition-all'
						>
							<X size={20} />
						</button>
					</div>

					{/* 댓글 리스트 */}
					<div className='flex-1 overflow-y-auto p-6 scrollbar-hide bg-zinc-950/20'>
						<CommentList
							comments={comments}
							editingCommentId={editingCommentId}
							isLoggedIn={isLoggedIn}
							currentNickname={currentNickname}
							editInput={editInput}
							editInputRef={editInputRef}
							setEditInput={setEditInput}
							onReplyStart={handleReplyStart}
							onEditStart={handleEditStart}
							onEditSubmit={handleEditSubmit}
							onEditCancel={handleEditCancel}
							onDelete={handleDelete}
							onReport={handleReport}
						/>
					</div>

					{/* 하단 액션 버튼 (좋아요 등) */}
					<PostActions
						isLiked={isLiked}
						isBookmarked={isBookmarked}
						likeCount={likeCount}
						commentCount={currentCommentCount}
						bookmarkCount={0}
						onToggleLike={onToggleLike}
						onToggleComments={handleFocus}
						onToggleBookmark={onToggleBookmark}
						onToggleEtc={() => setShowEtc(true)}
						showEtcButton={isLoggedIn}
						showBookmarkButton={!!board.preset?.presetId && !isPostOwner}
					/>

					{/* 댓글 입력 폼 */}
					<CommentInput
						input={input}
						setInput={setInput}
						onSubmit={handleAdd}
						inputRef={inputRef}
						replyingTo={replyingTo}
						onReplyCancel={handleReplyCancel}
						isLoggedIn={isLoggedIn}
					/>
				</div>

				{/* 기타 메뉴 모달 (삭제/수정/신고 등) */}
				{showEtc && (
					<div className='absolute inset-0 z-30 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center animate-fade-in'>
						<BoardEtc
							onClose={() => setShowEtc(false)}
							onEdit={onEdit}
							onDelete={onDelete}
							onReport={onReport}
							isOwner={isPostOwner}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Comment;
