/**
 * @file Category.tsx
 * @description 카테고리 네비게이션 컴포넌트
 */

'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 메인 페이지 상단에서 게시글, 뉴스, 옷장 등으로 이동하기 위한 카테고리 네비게이션 컴포넌트
 * @return {TSX.Element} 카테고리 네비게이션 UI
 */
const Category = () => {
	/**
	 * useLanguage: 메인 페이지 상단 네비게이션의 카테고리 명칭을 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].categoryComponent;
	// 링크 스타일
	const linkClass =
		'relative inline-block transition-all duration-300 hover:scale-110 text-zinc-400 hover:text-emerald-400 font-black  tracking-widest after:absolute after:left-1/2 after:bottom-[-4px] after:w-0 after:h-[3px] after:bg-emerald-500 after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full';

	return (
		<section className='flex flex-col w-full'>
			<nav className='flex items-center justify-center gap-30 py-4 px-10 text-2xl mb-6'>
				<Link href='/' className={linkClass}>
					{dict.board}
				</Link>
				<Link href='/news' className={linkClass}>
					{dict.news}
				</Link>
				<Link href='/closet' className={linkClass}>
					{dict.clothes}
				</Link>
				<Link href='/preset' className={linkClass}>
					{dict.preset}
				</Link>
			</nav>
		</section>
	);
};

export default Category;
