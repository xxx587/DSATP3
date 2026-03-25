/**
 * @file CommentPostInfo.tsx
 * @description 댓글 모달 내 게시글 정보 표시 컴포넌트
 * 게시글 이미지와 본문(작성자, 날짜, 제목, 제목 외 본문)을 표시
 */

import Image from 'next/image';
import TranslatableText from './TranslatableText';
import { BoardListItemDto } from '@/types/board';

/**
 * @description CommentPostInfo 컴포넌트의 Props 인터페이스
 */
/**
 * @description CommentPostInfo 컴포넌트의 Props 인터페이스
 * @property {BoardListItemDto} board - 좌측 영역에 상세 정보를 표시할 게시글 원본 데이터 객체
 * @property {string} formattedDate - 화면에 표시하기 위한 포맷으로 변환된 게시글 작성 시각 문자열
 * @property {string} title - 게시글 본문에서 추출된 첫 번째 줄(제목) 데이터
 * @property {string} body - 게시글 본문에서 제목을 제외한 나머지 상세 내용 데이터
 */
interface CommentPostInfoProps {
	board: BoardListItemDto;
	formattedDate: string;
	title: string;
	body: string;
}

/**
 * @description 게시글 이미지와 본문 정보를 표시하는 컴포넌트
 *              이미지는 비율에 맞춰 좌측에, 본문 정보는 하단에 고정되어 표시
 * @param {CommentPostInfoProps} props - 컴포넌트 Props
 * @return {TSX.Element} 게시글 정보 UI
 */
const CommentPostInfo = ({ board, formattedDate, title, body }: CommentPostInfoProps) => {
	return (
		<div className='flex-1 h-full flex flex-col bg-zinc-950'>
			<div className='relative flex-1 bg-zinc-950 overflow-hidden flex items-center justify-center group'>
				{board.imageUrl && (
					<Image
						src={encodeURI(board.imageUrl)}
						alt='게시글 이미지'
						fill
						className='object-contain transition-transform duration-1000 bg-white'
						sizes='(max-width: 768px) 100vw, 60vw'
						priority
					/>
				)}
				<div className='absolute inset-0 bg-linear-to-b from-transparent via-transparent to-zinc-950/50' />
			</div>

			<div className='p-8 border-t border-zinc-900/50 shrink-0 bg-zinc-950 relative overflow-hidden'>
				<div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full' />

				<div className='flex items-center gap-3 mb-6'>
					<div className='flex flex-col'>
						<span className='font-black text-sm text-zinc-100'>{board.nickname}</span>
						<span className='text-[10px] font-bold text-zinc-600  tracking-widest'>{formattedDate}</span>
					</div>
				</div>

				<div className='relative pl-4 mb-4 border-l-2 border-emerald-500/30'>
					<TranslatableText
						text={title}
						as='p'
						className='text-base font-black text-zinc-100 mb-3 wrap-break-words tracking-tight'
					/>
					<TranslatableText
						text={body}
						as='p'
						className='text-sm text-zinc-400 whitespace-pre-line wrap-break-word leading-relaxed max-h-[120px] overflow-y-auto scrollbar-hide font-medium'
					/>
				</div>
			</div>
		</div>
	);
};

export default CommentPostInfo;
