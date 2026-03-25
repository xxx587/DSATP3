/**
 * @file ReceivedMailList.tsx
 * @description 받은 메시지 목록 컴포넌트
 * 사용자가 받은 메일 목록을 표시하는 컴포넌트
 */

import { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import MailItem from './MailItem';
import MailDetailView from './MailDetailView';
import { DmResponseDTO } from '@/types/dm';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 받은 메시지 목록 컴포넌트. 받은 메일이 없을 경우 안내 메시지를 렌더링
 * @return {TSX.Element} 받은 메시지 목록 UI
 */
export default function ReceivedMailList() {
	/**
	 * useChat: 받은 메시지 목록 조회 및 데이터 패칭 기능을 수행하는 채팅 관련 커스텀 훅
	 */
	const { receivedDms, loading, fetchReceivedDms } = useChat();

	/**
	 * useState: 사용자가 목록에서 선택한 특정 메시지의 상세 정보를 관리하기 위한 훅
	 */
	const [selectedDm, setSelectedDm] = useState<DmResponseDTO | null>(null);

	/**
	 * useLanguage: 현재 설정된 언어에 맞는 안내 메시지(로딩중, 내역 없음 등)를 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].receivedMailListComponent;

	/**
	 * useEffect: 컴포넌트 마운트 시점에 받은 메시지 목록을 서버로부터 가져오기 위한 생명주기 훅
	 */
	useEffect(() => {
		fetchReceivedDms();
	}, [fetchReceivedDms]);

	if (selectedDm) {
		return (
			<MailDetailView
				dmId={selectedDm.dmId}
				type='received'
				onBack={() => {
					setSelectedDm(null);
					fetchReceivedDms();
				}}
			/>
		);
	}

	if (loading && receivedDms.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center h-full text-gray-400'>
				<p className='text-sm'>{dict.loadingMessage}</p>
			</div>
		);
	}

	if (!receivedDms || receivedDms.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center h-full text-gray-400'>
				<p className='text-sm'>{dict.notFoundReceivedMail}</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-full overflow-y-auto'>
			{receivedDms.map((dm) => (
				<MailItem key={dm.dmId} dm={dm} type='received' onClick={(dm) => setSelectedDm(dm)} />
			))}
		</div>
	);
}
