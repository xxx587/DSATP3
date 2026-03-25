/**
 * @file page.tsx
 * @description 패션 뉴스 페이지 (서버 컴포넌트)
 * 한국(KR)과 일본(JP)의 패션 뉴스 RSS 피드를 서버에서 병렬로 가져와 렌더링
 * revalidate를 통해 1시간 간격으로 ISR 적용
 */

export const dynamic = 'force-dynamic';

import News from '@/components/widget/News';
import { getKrNews, getJpNews } from '@/lib/news';

/** @description ISR 재검증 간격 (1시간) */
export const revalidate = 3600;

/**
 * @description 패션 뉴스 페이지 컴포넌트. 한국/일본 패션 뉴스를 서버에서 병렬 fetch하여 그리드 레이아웃으로 렌더링
 * @return {Promise<TSX.Element>} 한국/일본 패션 뉴스 섹션이 포함된 페이지
 */
export default async function FashionNewsPage() {
	const [krNews, jpNews] = await Promise.all([getKrNews(), getJpNews()]);

	return (
		<div className='min-h-[89.5vh] pt-0 px-8 pb-8'>
			<div className='flex flex-col gap-16'>
				<section>
					<p className='text-2xl font-black text-center text-emerald-500 mb-8 tracking-[0.2em] '>
						KOREA FASHION NEWS
					</p>
					<News items={krNews} />
				</section>
				<hr className='border-emerald-500/10' />
				<section>
					<p className='text-2xl font-black text-center text-emerald-500 mb-8 tracking-[0.2em] '>
						JAPAN FASHION NEWS
					</p>
					<News items={jpNews} />
				</section>
			</div>
		</div>
	);
}
