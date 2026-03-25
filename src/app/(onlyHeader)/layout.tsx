/**
 * @file layout.tsx
 * @description 사이드바 없이 헤더만 포함된 페이지 레이아웃을 처리하기 위한 파일
 */
import Header from '@/components/layout/Header';

/**
 * @description OnlyHeaderLayout 컴포넌트의 Props 인터페이스
 * @property {React.ReactNode} children - 레이아웃 본문에 렌더링될 자식 페이지 요소
 */
interface OnlyHeaderLayoutProps {
	children: React.ReactNode;
}

/**
 * @description 로그인, 회원가입 등 전체 화면을 사용하는 페이지를 위한 레이아웃 컴포넌트
 * @param {OnlyHeaderLayoutProps} props - 컴포넌트 props
 * @return {TSX.Element} 헤더가 포함된 레이아웃 구조를 처리하기 위한 요소
 */
export default function OnlyHeaderLayout({ children }: OnlyHeaderLayoutProps) {
	return (
		<div className='h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden'>
			<div className='z-50 shadow-md flex-none'>
				<Header />
			</div>
			<main
				id='scrollTop'
				className='flex-1 p-4 overflow-y-auto bg-zinc-950 text-zinc-100 scrollbar-hide scroll-smooth relative'
			>
				{children}
			</main>
		</div>
	);
}
