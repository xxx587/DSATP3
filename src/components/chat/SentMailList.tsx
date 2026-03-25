/**
 * @file SentMailList.tsx
 * @description 보낸 메시지 목록 컴포넌트
 * 사용자가 보낸 메일 목록을 표시하는 컴포넌트
 */

import { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import MailItem from './MailItem';
import MailDetailView from './MailDetailView';
import { DmResponseDTO } from '@/types/dm';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 보낸 메시지 목록 컴포넌트 보낸 메일이 없을 경우 안내 메시지를 렌더링
 * @return {TSX.Element} 보낸 메시지 목록 UI
 */
export default function SentMailList() {
	/**
	 * useChat: 보낸 메시지 목록 조회 및 데이터 요청 로직을 처리하기 위한 채팅 커스텀 훅
	 */
	const { sentDms, loading, fetchSentDms } = useChat();

	/**
	 * useState: 목록에서 클릭하여 상세히 보고자 하는 메시지 객체를 상태로 관리하기 위한 훅
	 */
	const [selectedDm, setSelectedDm] = useState<DmResponseDTO | null>(null);

	/**
	 * useLanguage: 현재 선택된 언어에 최적화된 사이드바 텍스트 및 레이블 정보를 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].sentMailListComponent;

	/**
	 * useEffect: 사용자가 보낸 메시지 내역을 컴포넌트 초기화 시점에 서버에서 동기화하기 위한 훅
	 */
	useEffect(() => {
		fetchSentDms();
	}, [fetchSentDms]);

	if (selectedDm) {
		return (
			<MailDetailView
				dmId={selectedDm.dmId}
				type='sent'
				onBack={() => {
					setSelectedDm(null);
					fetchSentDms();
				}}
			/>
		);
	}

	if (loading && sentDms.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center h-full text-gray-400'>
				<p className='text-sm'>{dict.loadingMessage}</p>
			</div>
		);
	}

	if (!sentDms || sentDms.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center h-full text-gray-400'>
				<p className='text-sm'>{dict.notFoundSendMail}</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-1'>
			{sentDms.map((dm) => (
				<MailItem key={dm.dmId} dm={dm} type='sent' onClick={(dm) => setSelectedDm(dm)} />
			))}
		</div>
	);
}
