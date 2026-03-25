/**
 * @file CommentInput.tsx
 * @description 댓글 입력 폼 컴포넌트
 * 댓글 작성 필드와 답글 대상 표시/취소 기능을 포함
 */

import { X } from 'lucide-react';
import { FormEvent, RefObject } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description CommentInput 컴포넌트의 Props 인터페이스
 */
/**
 * @description CommentInput 컴포넌트의 Props 인터페이스
 * @property {string} input - 현재 입력창에 작성 중인 댓글의 텍스트 데이터 값
 * @property {(val: string) => void} setInput - 입력창의 텍스트가 변경될 때 호출되어 상태를 갱신하기 위한 핸들러 함수
 * @property {(event: FormEvent) => void} onSubmit - 작성된 댓글을 제출하여 서버로 전송하기 위한 폼 이벤트 핸들러 함수
 * @property {RefObject<HTMLInputElement | null>} inputRef - 특정 상황(로그인, 답글 클릭 등)에서 입력창에 포커스를 직접 제어하기 위한 DOM 참조 객체
 * @property {{ id: number; nickname: string } | null} replyingTo - 현재 답글을 작성 중인 대상 사용자의 ID와 닉네임 정보를 담고 있는 객체 (답글 모드 식별용)
 * @property {() => void} onReplyCancel - 활성화된 답글 작성 모드를 취소하고 일반 댓글 작성 모드로 복귀하기 위한 콜백 함수
 * @property {boolean} isLoggedIn - 사용자의 로그인 여부에 따라 입력 폼의 렌더링 여부를 결정하기 위한 상태 값
 */
interface CommentInputProps {
	input: string;
	setInput: (val: string) => void;
	onSubmit: (event: FormEvent) => void;
	inputRef: RefObject<HTMLInputElement | null>;
	replyingTo: { id: number; nickname: string } | null;
	onReplyCancel: () => void;
	isLoggedIn: boolean;
}

/**
 * @description 댓글 입력 폼 컴포넌트. 로그인한 경우에만 폼을 렌더링
 * @param {CommentInputProps} props - 컴포넌트 Props
 * @return {TSX.Element | null} 댓글 입력 UI
 */
const CommentInput = ({
	input,
	setInput,
	onSubmit,
	inputRef,
	replyingTo,
	onReplyCancel,
	isLoggedIn,
}: CommentInputProps) => {
	/**
	 * useLanguage: 댓글 입력창의 placeholder나 '답글 작성 중' 안내 문구를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].commentInputComponent;

	if (!isLoggedIn) return null;

	return (
		<div className='flex flex-col shrink-0 bg-zinc-950 p-6 pt-2 border-t border-zinc-900/50'>
			{replyingTo && (
				<div className='mb-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex justify-between items-center animate-fade-in-up'>
					<span className='text-[11px] font-bold text-emerald-500'>
						<strong className='font-black mr-1'>{replyingTo.nickname}</strong>
						{dict.writingReply}
					</span>
					<button
						onClick={onReplyCancel}
						className='text-emerald-500/50 hover:text-emerald-500 transition-colors'
					>
						<X size={14} strokeWidth={3} />
					</button>
				</div>
			)}
			<form onSubmit={onSubmit} className='flex items-center gap-3'>
				<div className='flex-1 h-12 bg-zinc-900/80 border border-zinc-800/50 rounded-2xl flex items-center px-4 focus-within:border-emerald-500/50 transition-all duration-300'>
					<input
						ref={inputRef}
						type='text'
						placeholder={dict.writeCommentPlaceholder}
						className='flex-1 outline-none text-sm placeholder-zinc-700 bg-transparent text-zinc-100 font-medium'
						value={input}
						onChange={(event) => setInput(event.target.value)}
					/>
				</div>
				<button
					type='submit'
					disabled={!input.trim()}
					className={`h-12 px-6 rounded-2xl text-sm font-black transition-all duration-300  tracking-wider
						${
							input.trim()
								? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 active:scale-95'
								: 'bg-zinc-800 text-zinc-600 cursor-default shadow-none'
						}`}
				>
					{dict.writeComment}
				</button>
			</form>
		</div>
	);
};

export default CommentInput;
