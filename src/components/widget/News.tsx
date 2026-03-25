/**
 * @file News.tsx
 * @description 패션 뉴스 그리드 컴포넌트
 * RSS 피드에서 가져온 뉴스 아이템을 그리드 레이아웃으로 표시
 * 첫 번째 아이템은 2x2 크기로 강조 표시, 나머지는 1x1 크기로 표시
 * 각 카드에 이미지, 제목, 출처, 경과 시간을 오버레이로 표시
 */

import Image from 'next/image';

/**
 * @description RSS 뉴스 아이템 데이터 인터페이스
 * @property {string} title - 뉴스 제목
 * @property {string} link - 뉴스 원문 링크 URL
 * @property {string} pubDate - 발행 날짜 문자열
 * @property {string} [image] - 뉴스 썸네일 이미지 URL (선택적)
 * @property {string} source - 뉴스 출처명
 */
export interface RssItem {
	title: string;
	link: string;
	pubDate: string;
	image?: string;
	source: string;
}

/**
 * @description News 컴포넌트의 Props 인터페이스
 * @property {RssItem[]} items - 표시할 뉴스 아이템 배열
 */
interface NewsProps {
	items: RssItem[];
}

/**
 * @description 주어진 날짜 문자열로부터 현재까지의 경과 시간을 계산하여
 *              상대적 시간 문자열로 반환.
 * @param {string} dateString - 날짜 문자열 (Date 객체로 파싱 가능한 형식)
 * @return {string} 경과 시간 문자열 (e.g., '5m', '3h', '2d')
 */
function getTimeAgo(dateString: string) {
	const now = new Date();
	const past = new Date(dateString);
	const diffMs = now.getTime() - past.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 60) return `${diffMins}m`;
	if (diffHours < 24) return `${diffHours}h`;
	return `${diffDays}d`;
}

/**
 * @description RSS 피드로부터 가져온 패션 뉴스 아이템들을 그리드 레이아웃으로 출력하기 위한 컴포넌트
 * @param {NewsProps} props - 컴포넌트 Props
 * @return {TSX.Element} 뉴스 그리드 UI
 */
export default function News({ items }: NewsProps) {
	if (!items || items.length === 0) {
		return <p className='text-gray-500 text-center py-10'>뉴스를 불러오지 못했습니다.</p>;
	}

	return (
		<div className='relative'>
			{/* 배경 장식 */}
			<div className='absolute -left-20 top-0 w-96 h-96 bg-emerald-500/2 blur-[100px] -z-10' />

			<div className='grid! grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 auto-rows-[280px]'>
				{items.map((item, index) => {
					const isFeatured = index === 0;

					return (
						<a
							key={index}
							href={item.link}
							target='_blank'
							rel='noopener noreferrer'
							className={`
              relative block overflow-hidden rounded-[32px] group bg-zinc-900 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 shadow-2xl
              ${isFeatured ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}
            `}
						>
							{item.image && (
								<Image
									src={encodeURI(item.image)}
									alt={item.title}
									fill
									sizes='(max-width: 768px) 100vw, 50vw'
									className='object-cover transition-transform duration-500'
								/>
							)}

							<div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />

							<div className='absolute bottom-0 left-0 p-5 w-full flex flex-col justify-end'>
								<p
									className={`
                  text-white font-bold leading-snug mb-2
                  ${isFeatured ? 'text-xl md:text-2xl line-clamp-3' : 'text-sm md:text-base line-clamp-2'}
                `}
								>
									{item.title}
								</p>
								<div
									className={`flex items-center gap-2 text-zinc-400 font-bold  tracking-widest ${isFeatured ? 'text-[11px]' : 'text-[9px]'}`}
								>
									<span className='bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-500/20'>
										{item.source}
									</span>
									<span>•</span>
									<span>{getTimeAgo(item.pubDate)}</span>
								</div>
							</div>
						</a>
					);
				})}
			</div>
		</div>
	);
}
