/**
 * @file layout.tsx
 * @description 헤더, 사이드바, 카테고리 위젯이 모두 포함된 페이지 레이아웃을 처리하기 위한 파일
 */

export const dynamic = 'force-dynamic';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Category from '@/components/widget/Category';

/**
 * @description NeedAllLayout 컴포넌트의 Props 인터페이스
 * @property {React.ReactNode} children - 레이아웃 본문 영역에 렌더링될 자식 요소
 */
interface NeedAllLayoutProps {
	children: React.ReactNode;
}

/**
 * @description 헤더와 사이드바를 포함한 공통 화면 구성을 정의하기 위한 레이아웃 컴포넌트
 * @param {NeedAllLayoutProps} props - 컴포넌트 props
 * @return {TSX.Element} 전체적인 대시보드 형태의 레이아웃 구조를 처리하기 위한 요소
 */
export default function NeedAllLayout({ children }: NeedAllLayoutProps) {
	return (
		<div className='h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden'>
			{/* 상단 헤더 영역 */}
			<div className='z-50 flex-none sticky top-0'>
				<Header />
			</div>

			<div className='flex flex-1 overflow-hidden w-full max-w-[1920px] mx-auto'>
				{/* 사이드바 영역 */}
				<aside className='h-full flex-none overflow-y-auto w-64 hidden lg:block border-r border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm scrollbar-hide'>
					<Sidebar />
				</aside>

				{/* 메인 콘텐츠 영역 */}
				<main id='scrollTop' className='flex-1 p-6 overflow-y-auto bg-zinc-950 scroll-smooth'>
					<Category />
					<div className='max-w-[1800px] mx-auto min-h-full space-y-2'>
						<div className='pb-12'>{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}
