/**
 * @file MailDetailView.tsx
 * @description 메시지 상세 보기 컴포넌트
 * 받은 메시지, 보낸 메시지의 전체 내용을 확인
 */

import { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { DmResponseDTO } from '@/types/dm';
import MailDetailHeader from './MailDetailHeader';
import MailDetailContent from './MailDetailContent';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description MailDetailView 컴포넌트의 Props 인터페이스
 * @property {number} dmId - 상세 내용을 조회할 메시지의 고유 식별자 ID
 * @property {'received' | 'sent'} type - 해당 메시지가 '받은 메시지'인지 '보낸 메시지'인지 구분하기 위한 타입 값
 * @property {() => void} onBack - 상세 보기 화면을 닫고 이전 목록으로 돌아가기 위한 이벤트 핸들러 함수
 */
interface MailDetailViewProps {
	dmId: number;
	type: 'received' | 'sent';
	onBack: () => void;
}

/**
 * @description 특정 메시지의 상세 정보를 서버에서 불러와 화면에 출력하기 위한 컴포넌트
 * @param {MailDetailViewProps} props - 컴포넌트 Props
 * @return {TSX.Element} 쪽지 상세 보기 전체 레이아웃 UI
 */
export default function MailDetailView({ dmId, type, onBack }: MailDetailViewProps) {
	/**
	 * useChat: 특정 메시지의 일련번호(ID)를 기반으로 상세 정보를 가져오는 기능을 이용하기 위한 커스텀 훅
	 */
	const { fetchDmDetail, loading } = useChat();

	/**
	 * useState: 서버에서 받아온 상세 메시지 객체 데이터를 컴포넌트 내에 보관하기 위한 훅
	 */
	const [dm, setDm] = useState<DmResponseDTO | null>(null);

	/**
	 * useLanguage: 로딩 상태나 에러 발생 시 사용자에게 보여줄 안내 문구를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].mailDetailViewComponent;

	/**
	 * useEffect: dmId가 변경될 때마다 해당 메시지의 상세 내용을 다시 불러와 화면을 갱신하기 위한 훅
	 */
	useEffect(() => {
		const loadDetail = async () => {
			const detail = await fetchDmDetail(dmId);
			if (detail) {
				setDm(detail);
			}
		};
		loadDetail();
	}, [dmId, fetchDmDetail]);

	if (loading || !dm) {
		return (
			<div className='flex flex-col items-center justify-center h-full text-zinc-500'>
				<p className='text-sm'>{loading ? dict.loadingMessage : dict.messageNotFound}</p>
			</div>
		);
	}

	const targetName = type === 'received' ? dm.senderNickname : dm.receiverNickname;
	const date = new Date(dm.createdAt);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;

	return (
		<div className='flex flex-col h-full rounded-2xl bg-background border border-border shadow-sm overflow-hidden'>
			<MailDetailHeader type={type} onBack={onBack} />
			<MailDetailContent dm={dm} targetName={targetName} formattedDate={formattedDate} />
		</div>
	);
}
