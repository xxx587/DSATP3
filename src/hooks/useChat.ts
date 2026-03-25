/**
 * @file useChat.ts
 * @description DM(메시지) 관리 커스텀 훅
 * 받은 메시지, 보낸 메시지 목록 조회 및 메시지 전송, 로딩 상태 관리를 제공
 */

import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { DmResponseDTO } from '@/types/dm';
import { getReceiveDms, getSentDms, sendDm, getDmDetail } from '@/app/api/dm';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/** @description useChat 훅의 반환 타입 */
interface UseChatReturn {
	receivedDms: DmResponseDTO[];
	sentDms: DmResponseDTO[];
	loading: boolean;
	error: string | null;
	fetchReceivedDms: () => Promise<void>;
	fetchSentDms: () => Promise<void>;
	fetchDmDetail: (dmId: number) => Promise<DmResponseDTO | null>;
	handleSendDm: (receiverNickname: string, content: string) => Promise<boolean>;
}

/**
 * @description DM 관리 커스텀 훅. 받은 메일, 보낸 메일 조회 및 전송 기능을 포함
 * @return {UseChatReturn} DM 관리 관련 상태 및 함수
 */
export function useChat(): UseChatReturn {
	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 받은 메시지, 보낸 메시지의 목록 및 로딩/에러 상태를 저장하기 위해 사용함
	 */
	const [receivedDms, setReceivedDms] = useState<DmResponseDTO[]>([]);
	const [sentDms, setSentDms] = useState<DmResponseDTO[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * useLanguage: 현재 언어 설정 및 다국어 사전을 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].useChat;

	/**
	 * @description 받은 메시지 목록을 서버에서 조회하기 위한 비동기 함수
	 * useCallback: 불필요한 함수 재생성을 방지하고 메모이제이션하기 위한 훅
	 */
	const fetchReceivedDms = useCallback(async () => {
		const token = Cookies.get('access_token');
		if (!token) return;

		try {
			setLoading(true);
			const response = await getReceiveDms();
			setReceivedDms(response);
			setError(null);
		} catch (error) {
			toast.error(dict.receiveMessageLoadError);
			console.error('받은 메시지 조회 실패', error);
			setError(dict.receiveMessageLoadError);
		} finally {
			setLoading(false);
		}
	}, [dict]);

	/**
	 * @description 보낸 메시지 목록을 서버에서 조회하기 위한 비동기 함수
	 * useCallback: 함수 참조를 유지하여 성능을 최적화하기 위한 훅
	 */
	const fetchSentDms = useCallback(async () => {
		const token = Cookies.get('access_token');
		if (!token) return;

		try {
			setLoading(true);
			const response = await getSentDms();
			setSentDms(response);
			setError(null);
		} catch (error) {
			toast.error(dict.sendMessageLoadError);
			console.error('보낸 메시지 조회 실패', error);
			setError(dict.sendMessageLoadError);
		} finally {
			setLoading(false);
		}
	}, [dict]);

	/**
	 * @description 특정 메시지의 상세 내용을 조회하기 위한 비동기 함수
	 * @param {number} dmId - 조회할 메시지의 ID
	 * @returns {Promise<DmResponseDTO | null>} 메시지 상세 정보 또는 실패 시 null
	 * useCallback: API 호출 함수를 메모이제이션하기 위한 훅
	 */
	const fetchDmDetail = useCallback(
		async (dmId: number) => {
			try {
				setLoading(true);
				const response = await getDmDetail(dmId);
				setError(null);
				return response;
			} catch (error) {
				toast.error(dict.detailMessageLoadError);
				console.error('메시지 상세 조회 실패', error);
				setError(dict.detailMessageLoadError);
				return null;
			} finally {
				setLoading(false);
			}
		},
		[dict],
	);

	/**
	 * @description 새로운 메시지를 전송하기 위한 핸들러 함수
	 * @param {string} receiverNickname - 메시지를 받을 사용자의 닉네임
	 * @param {string} content - 전송할 메시지 내용
	 * @returns {Promise<boolean>} 전송 성공 여부
	 * useCallback: 전송 로직이 포함된 함수를 재사용하기 위한 훅
	 */
	const handleSendDm = useCallback(
		async (receiverNickname: string, content: string) => {
			if (!receiverNickname || !content) return false;

			try {
				setLoading(true);
				await sendDm(receiverNickname, content);
				toast.success(dict.sendMessageSuccess);
				setError(null);
				await fetchSentDms();
				return true;
			} catch (error) {
				toast.error(dict.sendMessageFail);
				console.error('메시지 전송 실패', error);
				setError(dict.sendMessageFail);
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[fetchSentDms, dict],
	);

	return {
		receivedDms,
		sentDms,
		loading,
		error,
		fetchReceivedDms,
		fetchSentDms,
		fetchDmDetail,
		handleSendDm,
	};
}

