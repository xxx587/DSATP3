/**
 * @file loading.tsx
 * @description 뉴스 페이지 로딩 스켈레톤 UI 컴포넌트
 * 뉴스 데이터를 불러오는 동안 표시되는 애니메이션 스켈레톤 UI를 제공
 * 한국/일본 패션 뉴스 두 섹션의 로딩 상태를 시각적으로 표현
 */

/** @description 스켈레톤 아이템 배열 (12개의 빈 카드) */
const items = Array.from({ length: 12 });

/**
 * @description 뉴스 그리드 스켈레톤 컴포넌트. 첫 번째 아이템은 특성 기사(2x2 크기)로 표시되고, 나머지는 1x1 크기
 * @return {TSX.Element} 뉴스 그리드 스켈레톤 UI
 */
const NewsSkeleton = () => (
	<div className='grid! grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 auto-rows-[280px]'>
		{items.map((_, index) => {
			const isFeatured = index === 0;
			return (
				<div
					key={index}
					className={`relative block overflow-hidden rounded-[32px] bg-zinc-900 animate-pulse border border-zinc-800/50 ${isFeatured ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}`}
				>
					<div className='absolute inset-0 bg-linear-to-t from-zinc-800/50 via-zinc-900/10 to-transparent' />
					<div className='absolute bottom-0 left-0 p-6 w-full flex flex-col justify-end gap-3'>
						<div
							className={`bg-zinc-800/80 rounded-xl w-3/4 ${isFeatured ? 'h-6 md:h-8 mb-1' : 'h-5 md:h-6 mb-1'}`}
						/>

						<div className={`flex items-center gap-2 mt-1`}>
							<div className='bg-zinc-800 rounded-lg h-4 w-16' />
							<div className='text-zinc-700 font-bold'>•</div>
							<div className='bg-zinc-800 rounded-lg h-4 w-10' />
						</div>
					</div>
				</div>
			);
		})}
	</div>
);

/**
 * @description 뉴스 페이지 전체 로딩 컴포넌트. 한국/일본 패션 뉴스 두 섹션의 스켈레톤 UI를 표시
 * @return {TSX.Element} 전체 뉴스 로딩 스켈레톤 UI
 */
export default function Loading() {
	return (
		<div className='min-h-[89.5vh] pt-0 px-8 pb-8'>
			<div className='flex flex-col gap-16'>
				<section>
					<p className='text-2xl font-black text-center text-emerald-500/40 mb-8 tracking-[0.2em] animate-pulse '>
						KOREA FASHION NEWS
					</p>
					<NewsSkeleton />
				</section>

				<hr className='border-emerald-500/10' />

				<section>
					<p className='text-2xl font-black text-center text-emerald-500/40 mb-8 tracking-[0.2em] animate-pulse '>
						JAPAN FASHION NEWS
					</p>
					<NewsSkeleton />
				</section>
			</div>
		</div>
	);
}
