'use client';

import { ArrowUp, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * @file ScrollControl.tsx
 * @description 스크롤 진행률 표시 및 최상단 이동 기능을 통합한 컴포넌트
 * @param {string} targetId - 스크롤 이벤트를 감시할 컨테이너 ID (기본값: 'scrollTop')
 */
/**
 * @description ScrollControl 컴포넌트의 Props 인터페이스
 * @property {string} [targetId] - 스크롤 진행률을 계산하고 최상단으로 이동할 타겟 DOM 요소의 ID (기본값: 'scrollTop')
 */
interface ScrollControlProps {
	targetId?: string;
}

export default function ScrollControl({ targetId = 'scrollTop' }: ScrollControlProps) {
	/**
	 * useState: 페이지의 전체 높이 대비 현재 스크롤 위치를 백분율(%)로 관리하기 위한 훅
	 */
	const [progress, setProgress] = useState(0);

	/**
	 * useState: 일정 깊이 이상 스크롤했을 때만 '최상단 이동' 버튼을 보여주기 위해 가시성 상태를 관리하는 훅
	 */
	const [showTopButton, setShowTopButton] = useState(false);

	/**
	 * useState: 현재 화면이나 컨테이너가 스크롤이 가능한 상태인지 여부를 판별하여 버튼 렌더링 여부를 결정하는 훅
	 */
	const [isScrollable, setIsScrollable] = useState(false);

	/**
	 * usePathname: 페이지 주소가 바뀔 때마다 스크롤 위치와 진행률을 초기화하거나 재계산하기 위해 주소를 참조하는 훅
	 */
	const pathname = usePathname();

	/**
	 * useEffect: 스크롤 이벤트 리스너를 등록하여 실시간으로 스크롤 위치를 감지하고 상태를 업데이트하기 위한 생명주기 훅
	 */
	useEffect(() => {
		const container = document.getElementById(targetId);
		if (!container) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const scrollableHeight = scrollHeight - clientHeight;

			if (scrollableHeight <= 0) {
				setProgress(0);
				setShowTopButton(false);
				setIsScrollable(false);
				return;
			}

			setIsScrollable(true);
			const scrollPercent = (scrollTop / scrollableHeight) * 100;
			setProgress(Math.round(scrollPercent));
			setShowTopButton(true);
		};

		// 초기 실행 및 이벤트 리스너 등록
		const timeoutId = setTimeout(handleScroll, 100);

		container.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);

		return () => {
			clearTimeout(timeoutId);
			container.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	}, [targetId, pathname]);

	const handleScrollToTop = () => {
		const container = document.getElementById(targetId);
		container?.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (!isScrollable) return null;

	return (
		<div className='fixed bottom-8 right-8 z-50 animate-fade-in-up pointer-events-none'>
			{showTopButton && (
				<button
					type='button'
					onClick={handleScrollToTop}
					className='pointer-events-auto group relative w-14 h-14 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/50 text-zinc-100 rounded-2xl shadow-2xl hover:border-emerald-500/30 hover:bg-emerald-500 hover:text-emerald-950 hover:scale-110 active:scale-95 transition-all cursor-pointer'
					aria-label='Scroll to top'
				>
					<div className='flex flex-col items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-50'>
						<ChevronUp size={15} className='text-emerald-500 animate-bounce mb-0.5' />
						<span className='text-[13px] font-black tracking-tighter leading-none'>{progress}%</span>
					</div>
					<div className='absolute inset-0 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300'>
						<ArrowUp
							size={22}
							className='group-hover:-translate-y-1 transition-transform duration-300'
							strokeWidth={3}
						/>
					</div>
				</button>
			)}
		</div>
	);
}
