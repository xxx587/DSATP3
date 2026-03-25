/**
 * @file TranslatableText.tsx
 * @description 텍스트 번역 기능을 제공하는 컴포넌트
 * 호버 시 번역 버튼을 표시하며, 클릭 시 Google Translate API를 통해 텍스트를 번역
 */

'use client';

import { useState } from 'react';
import { translateText } from '@/lib/translate';
import useRequireAuth from '@/hooks/useRequireAuth';
import { Languages, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description TranslatableText 컴포넌트의 Props 인터페이스
 * @property {string} text - 번역 기능을 적용할 대상 원문 텍스트 데이터
 * @property {string} [className] - 텍스트 요소에 적용할 추가적인 CSS 클래스 명칭 (스타일링용)
 * @property {'p' | 'span'} [as] - 렌더링할 HTML 시맨틱 태그 요소 선택 (기본값: 'p')
 */
interface TranslatableTextProps {
	text: string;
	className?: string;
	as?: 'p' | 'span';
}

/**
 * @description 텍스트 번역 기능을 제공하는 컴포넌트. 호버 시 한->일, 일->한 번역 버튼을 표시
 * @param {TranslatableTextProps} props - 컴포넌트 Props
 * @return {TSX.Element | null} 번역 기능이 포함된 텍스트 UI
 */
const TranslatableText = ({ text, className, as: Component = 'p' }: TranslatableTextProps) => {
	/**
	 * useLanguage: 현재 언어 설정을 확인하여 번역 성공/실패 알림 메시지 등을 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].translateAbleTextComponent;

	/**
	 * useState: Google Translate API를 통해 받아온 번역된 텍스트를 저장하기 위한 훅
	 */
	const [translatedText, setTranslatedText] = useState<string | null>(null);

	/**
	 * useState: 번역 요청 중임을 나타내는 로딩 상태를 관리하기 위한 훅
	 */
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * useState: 현재 화면에 표시되는 텍스트가 번역된 결과인지(원본인지) 토글 상태를 관리하기 위한 훅
	 */
	const [isTranslated, setIsTranslated] = useState(false);

	/**
	 * useRequireAuth: 번역 기능을 익명 사용자가 남용하지 않도록 로그인 여부를 체크하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	const handleTranslate = async (lang: 'ko' | 'ja') => {
		if (isLoading) return;
		if (!checkAuth()) {
			return;
		}

		setIsLoading(true);
		try {
			const result = await translateText(text, lang);
			setTranslatedText(result);
			setIsTranslated(true);
			toast.success(dict.translateSuccess);
		} catch (error) {
			console.error('번역 실패', error);
			toast.error(dict.translateFail);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleBack = () => {
		setIsTranslated(false);
	};

	if (!text) return null;

	return (
		<div className='group relative w-full rounded-md transition-all duration-300'>
			<div
				className={`transition-all duration-500 ${isLoading ? 'blur-[2px] opacity-50' : 'blur-0 opacity-100'}`}
			>
				<Component className={className}>{isTranslated ? translatedText : text}</Component>
			</div>

			{!isTranslated && !isLoading && (
				<div className='absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-6px] group-hover:-translate-y-1.5'>
					<div className='flex items-center gap-1 p-0.5 bg-zinc-900/90 backdrop-blur-md border border-white/10 shadow-xl rounded-full'>
						<button
							onClick={() => handleTranslate('ja')}
							className='flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-zinc-300 hover:bg-teal-600 hover:text-white transition-all whitespace-nowrap'
						>
							<Languages size={10} />
							한→일
						</button>
						<p className='w-px h-2.5 bg-zinc-700' />
						<button
							onClick={() => handleTranslate('ko')}
							className='flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-zinc-300 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap'
						>
							<Languages size={10} />
							日→韓
						</button>
					</div>
				</div>
			)}

			{isLoading && (
				<div className='absolute inset-0 flex items-center justify-center rounded-md bg-zinc-900/10 backdrop-blur-[1px]'></div>
			)}

			{isTranslated && (
				<div className='absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover:translate-y-0'>
					<button
						onClick={toggleBack}
						className='flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 text-zinc-300 rounded-full text-[9px] font-bold hover:bg-zinc-800 hover:text-white border border-white/10 transition-all backdrop-blur-md shadow-xl'
					>
						<RotateCcw size={10} />
						Cancel
					</button>
				</div>
			)}
		</div>
	);
};

export default TranslatableText;
