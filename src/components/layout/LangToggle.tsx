/**
 * @file LangToggle.tsx
 * @description 언어 변경 토글 컴포넌트
 * 한국어(KO)와 일본어(JA) 간 언어를 전환하는 스위치 UI를 제공
 * LanguageContext의 currentLang/toggleLang을 사용하여 전역 언어 상태를 관리
 * 현재 언어에 해당하는 국기 아이콘을 스위치 내부에 표시
 */

'use client';

import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 한국어(KO)/일본어(JA) 언어 전환 토글 스위치
 *              LanguageContext의 currentLang/toggleLang을 사용하여 전역 언어 상태를 변경
 *              현재 선택된 언어의 국기 아이콘을 스위치 내부에 표시
 * @return {TSX.Element} 언어 변경 토글 스위치 UI
 */
const LanguageToggle = () => {
	// Context의 현재 언어와 변경 함수
	const { currentLang, toggleLang } = useLanguage();
	const dict = dictionaries[currentLang].langToggleComponent;

	return (
		<button
			onClick={toggleLang}
			className='flex items-center gap-2 pl-3 pr-1 py-1 bg-emerald-500 rounded-full cursor-pointer hover:bg-emerald-400 transition-colors duration-300 focus:outline-none'
			aria-label='언어 변경'
		>
			<span className='text-emerald-950 text-sm font-medium'>{dict.changeLanguage}</span>

			{/* 스위치 UI */}
			<div className='relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border-2 border-transparent bg-zinc-700 transition-colors duration-300 ease-in-out'>
				{/* 바닥의 고정 텍스트*/}
				<span className='absolute flex w-full justify-between px-2 text-xs font-bold text-zinc-400 pointer-events-none'>
					<span>KO</span>
					<span>JA</span>
				</span>

				{/* 스위치 */}
				<span
					className={`lang-toggle-thumb pointer-events-none relative h-6 w-6 transform rounded-full bg-zinc-100 shadow ring-0 transition duration-300 ease-in-out flex items-center justify-center ${
						currentLang === 'ja' ? 'translate-x-8' : 'translate-x-0'
					}`}
				>
					{/* 원 안의 텍스트 */}
					<span className='flex items-center justify-center h-full w-full'>
						<ReactCountryFlag
							countryCode={currentLang === 'ko' ? 'KR' : 'JP'}
							svg
							style={{ width: '1.2em', height: '1.2em' }}
						/>
					</span>
				</span>
			</div>
		</button>
	);
};

export default LanguageToggle;
