/**
 * @file PostAction.tsx
 * @description 게시글 액션 버튼 컴포넌트
 * 좋아요(Heart), 댓글(MessageCircle), 북마크(Bookmark), 더보기(MoreHorizontal) 버튼을 일렬로 배치
 * 각 버튼의 토글 상태에 따라 색상(채움)이 변경되며, 카운트를 함께 표시
 */

import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';

/**
 * @description PostActions 컴포넌트의 Props 인터페이스
 * @property {boolean} isLiked - 현재 사용자가 이 게시글에 좋아요를 눌렀는지 여부를 나타내는 상태 값
 * @property {boolean} isBookmarked - 현재 사용자가 이 게시글(프리셋)을 북마크했는지 여부를 나타내는 상태 값
 * @property {number} likeCount - 게시글에 표시될 전체 좋아요 개수 지표
 * @property {number} commentCount - 게시글에 달린 전체 댓글 및 대댓글 개수 지표
 * @property {number} bookmarkCount - 게시글이 북마크된 총 횟수 지표
 * @property {() => void} onToggleLike - 좋아요 아이콘 클릭 시 상태를 반전시키고 서버와 통신하기 위한 콜백 함수
 * @property {() => void} onToggleComments - 댓글 아이콘 클릭 시 댓글 모달을 열거나 닫기 위한 핸들러 함수
 * @property {() => void} onToggleBookmark - 북마크 아이콘 클릭 시 상태를 토글하기 위한 콜백 함수
 * @property {() => void} onToggleEtc - 더보기(...) 버튼 클릭 시 추가 메뉴를 노출하기 위한 핸들러 함수
 * @property {boolean} showEtcButton - 더보기 버튼을 화면에 렌더링할지 여부를 결정하기 위한 제어 플래그
 * @property {boolean} showBookmarkButton - 북마크 버튼을 화면에 렌더링할지 여부를 결정하기 위한 제어 플래그
 */
interface PostActionsProps {
	isLiked: boolean;
	isBookmarked: boolean;
	likeCount: number;
	commentCount: number;
	bookmarkCount: number;
	onToggleLike: () => void;
	onToggleComments: () => void;
	onToggleBookmark: () => void;
	onToggleEtc: () => void;
	showEtcButton?: boolean;
	showBookmarkButton?: boolean;
}

/**
 * @description 게시글 액션 버튼 컴포넌트. 좋아요(Heart), 댓글(MessageCircle),
 *              북마크(Bookmark), 더보기(MoreHorizontal) 버튼을 일렬로 배치하며,
 *              각 버튼의 토글 상태에 따라 색상(채움)이 변경되고 카운트를 함께 표시
 * @param {PostActionsProps} props - 컴포넌트 Props
 * @return {TSX.Element} 액션 버튼 영역 UI
 */
const PostActions = ({
	isLiked,
	isBookmarked,
	likeCount = 0,
	commentCount = 0,
	bookmarkCount = 0,
	onToggleLike,
	onToggleComments,
	onToggleBookmark,
	onToggleEtc,
	showEtcButton = true,
	showBookmarkButton = true,
}: PostActionsProps) => {
	return (
		<div className='flex items-center justify-between p-6 border-t border-zinc-900/50 bg-zinc-950/20'>
			<div className='flex items-center gap-6'>
				{/* 좋아요 영역 */}
				<div className='flex items-center gap-2 group'>
					<button
						onClick={onToggleLike}
						className={`transition-all duration-300 p-2 rounded-xl hover:bg-zinc-800/80 ${isLiked ? 'text-red-500 bg-red-500/5 border border-red-500/20' : 'text-zinc-500 hover:text-zinc-200 border border-transparent'}`}
					>
						<Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2.5} />
					</button>
					{likeCount > 0 && (
						<span className='text-xs font-black text-zinc-400 group-hover:text-zinc-100 transition-colors'>
							{likeCount}
						</span>
					)}
				</div>

				{/* 댓글 영역 */}
				<div className='flex items-center gap-2 group'>
					<button
						onClick={onToggleComments}
						className='transition-all duration-300 p-2 rounded-xl hover:bg-zinc-800/80 text-zinc-500 hover:text-emerald-400 border border-transparent hover:border-emerald-500/10'
					>
						<MessageCircle className='w-5 h-5' strokeWidth={2.5} />
					</button>
					{commentCount > 0 && (
						<span className='text-xs font-black text-zinc-400 group-hover:text-emerald-400 transition-colors'>
							{commentCount}
						</span>
					)}
				</div>

				{/* 북마크 영역 */}
				{showBookmarkButton && (
					<div className='flex items-center gap-2 group'>
						<button
							onClick={onToggleBookmark}
							className={`transition-all duration-300 p-2 rounded-xl hover:bg-zinc-800/80 ${isBookmarked ? 'text-blue-500 bg-blue-500/5 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-200 border border-transparent'}`}
						>
							<Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} strokeWidth={2.5} />
						</button>
						{bookmarkCount > 0 && (
							<span className='text-xs font-black text-zinc-400 group-hover:text-zinc-100 transition-colors'>
								{bookmarkCount}
							</span>
						)}
					</div>
				)}
			</div>

			{/* 기타버튼 영역: 로그인 상태일 때만 표시 */}
			{showEtcButton && (
				<button
					onClick={onToggleEtc}
					className='text-zinc-600 hover:text-zinc-100 p-2 rounded-xl border border-zinc-800/50 hover:bg-zinc-800 focus:ring-4 focus:ring-emerald-500/10 transition-all relative z-20'
				>
					<MoreHorizontal size={20} />
				</button>
			)}
		</div>
	);
};

export default PostActions;
