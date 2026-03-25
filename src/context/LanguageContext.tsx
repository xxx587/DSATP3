/**
 * @file LanguageContext.tsx
 * @description 전역 언어 상태 관리 컨텍스트
 * 한국어(ko)/일본어(ja) 전환을 위한 Context와 Provider를 제공
 * useLanguage 커스텀 훅으로 컴포넌트에서 쉽게 언어 상태에 접근 가능
 */

'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

/** @description 지원 언어 타입 ('ko': 한국어, 'ja': 일본어) */
type Lang = 'ko' | 'ja';

/**
 * @description LanguageContext의 값 타입 인터페이스
 * @property {Lang} currentLang - 현재 선택된 언어
 * @property {() => void} toggleLang - 언어 전환 함수
 */
interface LanguageContextType {
	currentLang: Lang;
	toggleLang: () => void;
}

/** @description LanguageContext 생성 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * @description 언어 컨텍스트 Provider 컴포넌트. 자식 컴포넌트에 현재 언어 상태와
 *              언어 전환 함수를 제공. 기본 언어는 한국어('ko')
 * @param {{ children: ReactNode }} props - 자식 컴포넌트
 * @return {TSX.Element} Provider 래퍼
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	/**
	 * useState: 현재 전역 언어 설정('ko' | 'ja')을 관리하기 위한 훅
	 */
	const [currentLang, setCurrentLang] = useState<Lang>('ko');

	/**
	 * useEffect: 언어 설정이 변경될 때마다 HTML 태그의 lang 속성을 동기화하기 위한 생명주기 훅
	 */
	useEffect(() => {
		document.documentElement.lang = currentLang;
	}, [currentLang]);

	/**
	 * @description 언어 전환 함수. 한국어(ko) <-> 일본어(ja) 간 토글
	 * @return {void}
	 */
	const toggleLang = () => {
		setCurrentLang((prev) => (prev === 'ko' ? 'ja' : 'ko'));
	};

	return <LanguageContext.Provider value={{ currentLang, toggleLang }}>{children}</LanguageContext.Provider>;
};

/**
 * @description 언어 컨텍스트 커스텀 훅. LanguageProvider 하위에서
 *              현재 언어(currentLang)와 언어 전환 함수(toggleLang)를 반환
 *              Provider 외부에서 호출 시 에러를 throw
 * @return {LanguageContextType} 현재 언어 상태 및 전환 함수
 */
export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('에러 발생');
	}
	return context;
};
