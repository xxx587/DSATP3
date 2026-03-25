/**
 * @file CommentItem.tsx
 * @description 개별 댓글 항목 컴포넌트
 * 수정 모드 전환, 답글/수정/삭제/신고 버튼 및 대댓글 들여쓰기를 처리
 */

import { CommentListItemDto } from '@/types/comment';
import TranslatableText from './TranslatableText';
import { RefObject } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description CommentItem 컴포넌트의 Props 인터페이스
 */
/**
 * @description CommentItem 컴포넌트의 Props 인터페이스
 * @property {CommentListItemDto & { level: number; parentNickname?: string; }} comment - 표시할 개별 댓글 개체 데이터로 계층 깊이(level)와 부모 댓글의 닉네임 정보를 포함
 * @property {boolean} isEditing - 해당 댓글이 현재 수정 입력 모드인지 활성화된 상태를 판별하기 위한 값
 * @property {boolean} isCommentOwner - 현재 로그인한 유저가 해당 댓글을 실제 작성한 본인인지 식별하기 위한 값
 * @property {boolean} isLoggedIn - 기능 사용 권한(답글 등)을 제어하기 위해 사용자의 로그인 상태를 판별하기 위한 값
 * @property {string} editInput - 수정 모드 시 텍스트 필드에 바인딩될 입력 문자열 데이터
 * @property {RefObject<HTMLInputElement | null>} editInputRef - 수정 모드 진입 시 입력창에 자동으로 포커스를 부여하기 위한 DOM 참조 객체
 * @property {(val: string) => void} setEditInput - 수정 텍스트의 실시간 변경을 상태에 반영하기 위한 핸들러 함수
 * @property {string} formattedDate - 표시용으로 기 포맷팅된 댓글의 작성 시각 정보 문자열
 * @property {(id: number, nickname: string) => void} onReplyStart - 특정 댓글에 대한 답글 작성을 시작할 때 호출되기 위한 함수
 * @property {(id: number, content: string) => void} onEditStart - 댓글 수정 버튼을 클릭하여 수정 모드로 전환하기 위한 콜백 함수
 * @property {(id: number) => void} onEditSubmit - 수정한 댓글 내용을 최종 반영하기 위해 부모의 비즈니스 로직을 호출하기 위한 함수
 * @property {() => void} onEditCancel - 진행 중인 수정 과정을 중단하기 위한 이벤트 핸들러 함수
 * @property {(id: number) => void} onDelete - 해당 댓글을 영구 삭제하기 위해 호출될 비즈니스 로직 함수
 * @property {(id: number) => void} onReport - 부적절한 댓글 내용에 대해 신고 신청을 처리하기 위한 함수
 */
interface CommentItemProps {
	comment: CommentListItemDto & {
		level: number;
		parentNickname?: string;
	};
	isEditing: boolean;
	isCommentOwner: boolean;
	isLoggedIn: boolean;
	editInput: string;
	editInputRef: RefObject<HTMLInputElement | null>;
	setEditInput: (val: string) => void;
	formattedDate: string;
	onReplyStart: (id: number, nickname: string) => void;
	onEditStart: (id: number, content: string) => void;
	onEditSubmit: (id: number) => void;
	onEditCancel: () => void;
	onDelete: (id: number) => void;
	onReport: (id: number) => void;
}

/**
 * @description 개별 댓글 항목 컴포넌트. 수정 모드 여부에 따라 UI를 전환하며 대댓글인 경우 들여쓰기와 부모 닉네임을 표시
 * @param {CommentItemProps} props - 컴포넌트 Props
 * @return {TSX.Element} 댓글 항목 UI
 */
const CommentItem = ({
	comment,
	isEditing,
	isCommentOwner,
	isLoggedIn,
	editInput,
	editInputRef,
	setEditInput,
	formattedDate,
	onReplyStart,
	onEditStart,
	onEditSubmit,
	onEditCancel,
	onDelete,
	onReport,
}: CommentItemProps) => {
	/**
	 * useLanguage: 댓글 아이템의 액션 버튼(답글, 수정, 삭제, 신고) 텍스트를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].commentItemComponent;

	return (
		<li
			className={`text-sm group flex flex-row gap-2 relative ${comment.level > 0 ? 'mt-4' : 'mt-1 first:mt-0'}`}
			style={{
				marginLeft: `${comment.level * 1.5}rem`,
			}}
		>
			{comment.level > 0 && (
				<div className='absolute left-[-1.2rem] top-0 bottom-0 w-0.5 bg-zinc-500 flex items-start pt-2'>
					<div className='w-3 h-px bg-zinc-800' />
				</div>
			)}

			<div className='flex-1 mb-1'>
				{isEditing ? (
					/* 수정 모드일 때 보여줄 UI */
					<div className='animate-scale-in'>
						<div className='flex items-center gap-2 mb-2'>
							<span className='font-black text-xs text-zinc-100'>{comment.nickname}</span>
							{comment.level > 0 && comment.parentNickname && (
								<span className='text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500'>
									@{comment.parentNickname}
								</span>
							)}
						</div>
						<div className='mb-3'>
							<input
								ref={editInputRef}
								type='text'
								className='w-full bg-zinc-900 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm outline-none text-zinc-100 focus:border-emerald-500/60 transition-all'
								value={editInput}
								onChange={(e) => setEditInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') onEditSubmit(comment.commentId);
									if (e.key === 'Escape') onEditCancel();
								}}
							/>
						</div>
						<div className='flex gap-2 text-[10px] font-black  tracking-widest'>
							<button
								onClick={() => onEditSubmit(comment.commentId)}
								className='text-emerald-500 hover:text-emerald-400'
							>
								{dict.changeComment}
							</button>
							<span className='text-zinc-800'>/</span>
							<button onClick={onEditCancel} className='text-zinc-600 hover:text-zinc-400'>
								{dict.cancel}
							</button>
						</div>
					</div>
				) : (
					/* 기본 모드일 때 보여줄 원래 UI */
					<>
						<div className='flex items-center gap-2 mb-1.5'>
							<span className='font-black text-xs text-zinc-100'>{comment.nickname}</span>
							{comment.level > 0 && comment.parentNickname && (
								<span className='text-[10px] font-black px-1.5 py-0.5 rounded-md bg-zinc-800 text-emerald-500/80'>
									@{comment.parentNickname}
								</span>
							)}
							<span className='text-[9px] font-bold text-zinc-600  tracking-tighter'>
								{formattedDate}
							</span>
						</div>

						<div className='mb-2'>
							<TranslatableText
								text={comment.content}
								as='p'
								className='text-sm text-zinc-300 font-medium leading-relaxed'
							/>
						</div>

						<div className='flex items-center gap-4 mb-1 text-[10px] font-black  tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
							{isLoggedIn && (
								<button
									onClick={() => onReplyStart(comment.commentId, comment.nickname)}
									className='text-zinc-500 hover:text-emerald-500 transition-colors text-xs'
								>
									{dict.reply}
								</button>
							)}
							{isCommentOwner && (
								<>
									<button
										onClick={() => onEditStart(comment.commentId, comment.content)}
										className='text-zinc-500 hover:text-emerald-500 transition-colors text-xs'
									>
										{dict.edit}
									</button>
									<button
										onClick={() => onDelete(comment.commentId)}
										className='text-zinc-500 hover:text-red-500 transition-colors text-xs'
									>
										{dict.delete}
									</button>
								</>
							)}
							{isLoggedIn && (
								<button
									onClick={() => onReport(comment.commentId)}
									className='text-zinc-500 hover:text-purple-500 transition-colors text-xs'
								>
									{dict.report}
								</button>
							)}
						</div>
						<hr className='border-zinc-100/30 mt-3' />
					</>
				)}
			</div>
		</li>
	);
};

export default CommentItem;
