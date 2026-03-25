'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';

/**
 * @description 다크/화이트 모드 토글 버튼 컴포넌트
 */
export default function ThemeToggle() {
	/**
	 * useTheme: next-themes 라이브러리를 사용하여 다크/라이트 테마 상태를 전역적으로 관리 및 변경하기 위한 훅
	 */
	const { theme, setTheme } = useTheme();

	/**
	 * useMounted: 하이드레이션 불일치를 피하기 위해 브라우저 환경에서만 테마 스위치를 렌더링하기 위한 마운트 체크 훅
	 */
	const mounted = useMounted();

	// SSR hydration mismatch 방지
	if (!mounted) return <div className='w-9 h-9' />;

	const isDark = theme === 'dark';

	const handleToggle = () => {
		// 다른 요소 transition 차단 → body만 자연스럽게 전환
		document.documentElement.classList.add('no-transition');
		setTheme(isDark ? 'light' : 'dark');
		requestAnimationFrame(() => {
			document.documentElement.classList.remove('no-transition');
		});
	};

	return (
		<button
			onClick={handleToggle}
			className='text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all p-2 rounded-lg'
			aria-label={isDark ? '화이트 모드로 전환' : '다크 모드로 전환'}
		>
			{isDark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
		</button>
	);
}
