/**
 * @file HomeSkeletonGrid.tsx
 * @description 게시글 목록 로딩 중에 보여줄 스켈레톤(Placeholder) 그리드 컴포넌트
 * 실제 데이터가 로드되기 전까지 사용자에게 구조적 레이아웃을 미리 보여주어 사용자 경험을 개선
 */

/**
 * @description 데이터 로딩 중에 표시할 펄스 애니메이션이 적용된 스켈레톤 그리드
 * @return {TSX.Element} 스켈레톤 그리드 UI
 */
const HomeSkeletonGrid = () => {
	return (
		<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6'>
			{Array.from({ length: 8 }).map((_, index) => (
				<div
					key={`loading-${index}`}
					className='bg-zinc-900/50 border border-zinc-800/50 rounded-[32px] overflow-hidden shadow-2xl animate-pulse aspect-3/4'
				>
					<div className='w-full h-2/3 bg-zinc-800/50' />
					<div className='p-6 space-y-4'>
						<div className='flex justify-between items-center'>
							<div className='h-3 bg-zinc-800/50 rounded-full w-1/3' />
							<div className='h-2 bg-zinc-800/50 rounded-full w-1/4' />
						</div>
						<div className='h-5 bg-zinc-800/50 rounded-xl w-3/4' />
						<div className='h-px bg-zinc-800/30 w-full' />
						<div className='h-3 bg-zinc-800/50 rounded-full w-1/2' />
					</div>
				</div>
			))}
		</div>
	);
};

export default HomeSkeletonGrid;
