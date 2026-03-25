/**
 * @file BoardSearch.tsx
 * @description 게시글 검색 컴포넌트
 */

'use client';

import { useState, useEffect, useRef } from 'react';

import { LucideSearch } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description BoardSearch 컴포넌트의 Props 인터페이스
 * @property {(keyword: string) => void} onSearchChange - 사용자가 입력한 검색어를 부모 컴포넌트의 검색 상태로 전달하기 위한 콜백 함수
 */
interface BoardSearchProps {
	onSearchChange: (keyword: string) => void;
}

/**
 * @description 게시글 검색 컴포넌트. 유저의 입력을 실시간으로 반영하여 검색을 수행하며,
 *              불필요한 API 호출을 방지하기 위해 디바운스(500ms)를 적용함.
 * @param {BoardSearchProps} props - 컴포넌트 Props
 * @return {TSX.Element} 검색창 UI
 */
export default function BoardSearch({ onSearchChange }: BoardSearchProps) {
	/**
	 * useState: 사용자가 검색창에 입력 중인 텍스트 값을 상태로 관리하기 위한 훅
	 */
	const [value, setValue] = useState('');

	/**
	 * useRef: 컴포넌트 마운트 여부를 추적하여 초기 렌더링 시에는 검색 실행을 방지하기 위한 참조 훅
	 */
	const isMounted = useRef(false);

	/**
	 * useLanguage: 검색창의 placeholder 텍스트를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].boardSearchComponent;

	/**
	 * useEffect: 입력값이 변경될 때마다 500ms의 디바운스를 적용하여 검색 요청(onSearchChange)을 지연 실행하기 위한 훅
	 */
	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}

		const timer = setTimeout(() => {
			onSearchChange(value);
		}, 500);

		return () => clearTimeout(timer);
	}, [value, onSearchChange]);

	return (
		<div className='flex items-center w-full gap-3 px-4 py-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-2xl focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300 group'>
			<LucideSearch className='w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors' />
			<input
				type='text'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className='w-full bg-transparent border-none text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:ring-0 appearance-none'
				placeholder={dict.searchPlaceholder}
			/>
		</div>
	);
}
