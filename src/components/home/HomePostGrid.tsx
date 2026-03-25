/**
 * @file HomePostGrid.tsx
 * @description 홈 페이지의 메인 콘텐츠인 게시글 그리드 레이아웃 컴포넌트
 * 여러 개의 InstaPost 컴포넌트를 정렬하여 보여주며 무한 스크롤을 위한 참조(ref)를 관리
 */

import InstaPost from '@/components/post/InstaPost';
import { BoardListItemDto } from '@/types/board';

/**
 * @description HomePostGrid 컴포넌트의 Props 인터페이스
 * @property {BoardListItemDto[]} boards - 그리드에 표시할 게시글 객체 배열
 * @property {(node: HTMLDivElement | null) => void} lastElementRef - 마지막 게시글 요소를 참조하여 무한 스크롤을 감지하기 위한 Ref 콜백 함수
 * @property {(updatedBoard?: BoardListItemDto) => void} onSuccess - 게시글 관련 작업 성공 시 UI를 갱신하기 위한 콜백 함수
 * @property {(boardId: number) => void} onDelete - 게시글을 목록에서 제거하기 위한 콜백 함수
 */
interface HomePostGridProps {
	boards: BoardListItemDto[];
	lastElementRef: (node: HTMLDivElement | null) => void;
	onSuccess?: (updatedBoard?: BoardListItemDto) => void;
	onDelete?: (boardId: number) => void;
}

/**
 * @description 게시글 배열을 순회하며 InstaPost 카드를 그리드 형태로 렌더링
 *              마지막 요소에 무한 스크롤을 위한 ref를 바인딩
 * @param {HomePostGridProps} props - 컴포넌트 Props
 * @return {TSX.Element} 게시글 그리드 UI
 */
const HomePostGrid = ({ boards, lastElementRef, onSuccess, onDelete }: HomePostGridProps) => {
	return (
		<div className='relative'>
			{/* 배경 장식 */}
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/2 blur-[120px] -z-10 pointer-events-none' />
			
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
				{boards.map((board, index) => {
					const isLast = boards.length === index + 1;
					return (
						<div 
							ref={isLast ? lastElementRef : null} 
							key={board.boardId} 
							className='opacity-0 animate-fade-in translate-y-8 [animation-fill-mode:forwards] group/post'
							style={{ animationDelay: `${(index % 10) * 100}ms`, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
						>
							<div className='transition-all duration-500'>
								<InstaPost board={board} onSuccess={onSuccess} onDelete={onDelete} />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default HomePostGrid;
