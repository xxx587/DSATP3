/**
 * @file PostContent.tsx
 * @description 게시글 본문 표시 컴포넌트
 * 게시글 내용을 첫 줄(제목)과 나머지(본문)로 분리하여 렌더링
 * 닉네임, 날짜, 제목, 본문을 구조적으로 표시하며 줄바꿈(\n)을 기준으로 분리
 */

/**
 * @description PostContent 컴포넌트의 Props 인터페이스
 * @property {string} nickname - 게시글 하단에 표시할 작성자의 닉네임 정보
 * @property {string} date - 게시글이 생성된 날짜 및 시간 정보 (포맷팅된 문자열)
 * @property {string} content - 게시글의 전체 본문 텍스트 (줄바꿈을 포함할 수 있음)
 */
interface PostContentProps {
	nickname: string;
	date: string;
	content: string;
}

import TranslatableText from './TranslatableText';

/**
 * @description 게시글 본문 표시 컴포넌트
 *              content를 첫 줄(제목)과 나머지(본문)로 \n 기준으로 분리하여 구조적으로 렌더링
 *              닉네임, 날짜, 제목, 본문을 카드 하단에 표시
 * @param {PostContentProps} props - 컴포넌트 Props
 * @return {TSX.Element} 게시글 본문 영역 UI
 */
const PostContent = ({ nickname, date, content }: PostContentProps) => {
	const normalized = content.replace(/\r\n/g, '\n');
	const splitIndex = normalized.indexOf('\n');
	let title = splitIndex >= 0 ? normalized.slice(0, splitIndex) : normalized;
	let body = splitIndex >= 0 ? normalized.slice(splitIndex + 1) : '';

	if (!title && body) {
		title = body;
		body = '';
	}

	return (
		<div className='px-1 pt-2 w-full'>
			<div className='flex justify-between items-center mb-4 gap-2 px-1'>
				<div className='flex items-center gap-2'>
					<span className='text-xs font-bold text-zinc-200 tracking-tight'>{nickname}</span>
				</div>
				<span className='text-[10px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md  tracking-wider'>
					{date}
				</span>
			</div>

			{title && (
				<div className='relative group px-1'>
					<div className='absolute left-[-4px] top-0 bottom-0 w-0.5 bg-emerald-500/50 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300' />
					<TranslatableText
						text={title}
						as='p'
						className='text-sm font-black text-zinc-100 line-clamp-1 break-all mb-2 leading-tight'
					/>
				</div>
			)}

			<div className='h-px w-full bg-linear-to-r from-zinc-800/50 via-zinc-800 to-zinc-800/50 my-2' />

			{body && (
				<div className='px-1'>
					<TranslatableText
						text={body}
						as='p'
						className='text-xs text-zinc-400 font-medium leading-relaxed whitespace-pre-line line-clamp-1 mt-2'
					/>
				</div>
			)}
		</div>
	);
};

export default PostContent;
