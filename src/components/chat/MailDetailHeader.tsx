/**
 * @file MailDetailHeader.tsx
 * @description 메시지 상세 보기의 헤더 영역 컴포넌트
 */

import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description MailDetailHeader 컴포넌트의 Props 인터페이스
 * @property {'received' | 'sent'} type - 메시지 함의 종류(받은 쪽지/보낸 쪽지)를 구분하기 위한 타입 값
 * @property {() => void} onBack - 상세 보기 화면을 닫고 목록으로 돌아가기 위한 이벤트 핸들러 함수
 */
interface MailDetailHeaderProps {
	type: 'received' | 'sent';
	onBack: () => void;
}

/**
 * @description 메시지 상세 보기 상단 헤더. 뒤로가기 버튼과 메시지 타입을 표시
 * @param {MailDetailHeaderProps} props - 컴포넌트 Props
 * @return {TSX.Element} 상세 보기 헤더 UI
 */
const MailDetailHeader = ({ type, onBack }: MailDetailHeaderProps) => {
	/**
	 * useLanguage: 현재 언어 설정을 확인하여 '받은 메시지' 또는 '보낸 메시지' 타이틀을 해당 언어로 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].mailDetailHeaderComponent;
	return (
		<div className='flex items-center gap-3 p-4 border-b border-border bg-card/50 backdrop-blur-sm'>
			<button
				onClick={onBack}
				className='p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground rounded-full transition-all duration-200'
			>
				<ArrowLeft className='w-5 h-5' />
			</button>
			<p className='font-bold text-foreground text-lg tracking-tight'>
				{type === 'received' ? dict.receivedMessages : dict.sentMessage}
			</p>
		</div>
	);
};

export default MailDetailHeader;
