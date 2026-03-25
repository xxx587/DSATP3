/**
 * @file layout.tsx
 * @description Next.js 루트 레이아웃 컴포넌트
 * 전체 애플리케이션의 기본 HTML 구조, 글꼴 설정, 레이아웃(헤더/사이드바/메인)을 정의
 * LanguageProvider로 다국어 지원을 감싸고, Header, Sidebar, Category 컴포넌트를 포함
 */

import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { DialogProvider } from '@/context/DialogContext';
import { ThemeProvider } from '@/context/ThemeProvider';
import GlobalBoardModal from '@/components/post/GlobalCommentModal';
import ScrollControl from '@/components/layout/ScrollControl';
import { Suspense } from 'react';

// 1. 한국어 폰트 설정
const notoSansKr = Noto_Sans_KR({
	display: 'swap',
	variable: '--font-noto-kr',
	preload: false, // 한/일 폰트는 용량이 커서 false로 설정해 동적 다운로드 유도
});

// 2. 일본어 폰트 설정
const notoSansJp = Noto_Sans_JP({
	display: 'swap',
	variable: '--font-noto-jp',
	preload: false,
});

export const metadata: Metadata = {
	title: { default: 'OTTAKU', template: 'OTTAKU' },
	description: 'OTTAKU',
};

/**
 * @description RootLayout 컴포넌트의 Props 인터페이스
 * @property {React.ReactNode} children - 레이아웃 내부에서 렌더링될 자식 페이지 요소
 */
interface RootLayoutProps {
	children: React.ReactNode;
}

/**
 * @description 루트 레이아웃 컴포넌트. 모든 페이지의 공통 구조를 정의하기 위한 컴포넌트
 * @param {RootLayoutProps} props - 컴포넌트 props
 * @return {TSX.Element} 전체 레이아웃 구조를 처리하기 위한 요소
 */
export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang='ko' suppressHydrationWarning>
			<body className={`${notoSansKr.variable} ${notoSansJp.variable} antialiased`}>
				<ThemeProvider attribute='data-theme' defaultTheme='dark' enableSystem={false}>
					<LanguageProvider>
						<DialogProvider>
							{children}
							<Suspense fallback={null}>
								<GlobalBoardModal />
							</Suspense>
							<ScrollControl />
							<Toaster />
						</DialogProvider>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
