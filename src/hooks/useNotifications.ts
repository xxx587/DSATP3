/**
 * @file useNotifications.ts
 * @description 알림(Notification) 관리 커스텀 훅
 * 서버로부터 사용자의 알림 목록을 가져오고, 읽음 처리 및 삭제 기능을 제공
 */

import { useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { NotificationDto } from '@/types/notification';
import { deleteAllReadNotifications, deleteNotification, getNotifications, markRead } from '@/app/api/notification';
import { toast } from 'sonner';

/** @description useNotifications 훅의 반환 타입 */
interface UseNotificationsReturn {
	notifications: NotificationDto[];
	isOpen: boolean;
	loading: boolean;
	hasUnread: boolean;
	toggleOpen: () => void;
	close: () => void;
	markAllAsRead: () => Promise<void>;
	markAsRead: (id: number) => Promise<void>;
	removeNotification: (id: number) => Promise<void>;
	removeAllNotifications: () => Promise<void>;
}

/**
 * @description 알림 관리 커스텀 훅. 알림 목록 조회, 읽음 처리, 삭제, 드롭다운 상태 관리 포함
 * @return {UseNotificationsReturn} 알림 관리 관련 상태 및 함수
 */
export function useNotifications(): UseNotificationsReturn {
	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 알림 목록, 드롭다운 열림 상태 및 로딩 상태를 저장하기 위해 사용함
	 */
	const [notifications, setNotifications] = useState<NotificationDto[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	/**
	 * @description 서버로부터 사용자의 알림 내역을 조회하기 위한 비동기 함수
	 * useCallback: API 호출 로직을 메모이제이션하여 불필요한 함수 재생성을 방지하기 위한 훅
	 */
	const fetchNotifications = useCallback(async () => {
		const token = Cookies.get('access_token');
		if (!token) return;

		try {
			setLoading(true);
			const response = await getNotifications();
			setNotifications(response);
		} catch (error) {
			toast.error('알림을 불러오지 못했습니다.');
			console.error('알림 조회 실패', error);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * useEffect: 컴포넌트 마운트 시 초기 알림 데이터를 로드하기 위한 훅
	 */
	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	/**
	 * toggleOpen: 알림 드롭다운의 표시 여부를 반전시키기 위한 핸들러 함수
	 * useCallback: 동일한 함수 참조를 유지하여 리렌더링 성능을 최적화하기 위한 훅
	 */
	const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

	/**
	 * close: 알림 드롭다운을 닫기 위한 핸들러 함수
	 * useCallback: 함수를 메모이제이션하여 자식 컴포넌트에 안정적인 props를 전달하기 위한 훅
	 */
	const close = useCallback(() => setIsOpen(false), []);

	/**
	 * @description 특정 알림을 읽음 처리하기 위한 비동기 함수
	 * @param {number} id - 읽음 처리할 알림의 ID
	 * useCallback: 특정 ID 기반의 업데이트 로직을 포함하여 함수를 재사용하기 위한 훅
	 */
	const markAsRead = useCallback(
		async (id: number) => {
			const target = notifications.find((n) => n.notificationId === id);
			if (!target || target.isRead) return;

			try {
				await markRead(id);
				setNotifications((prev) =>
					prev.map((noti) => (noti.notificationId === id ? { ...noti, isRead: true } : noti)),
				);
			} catch (error) {
				toast.error('알림 읽음 처리에 실패했습니다.');
				console.error('알림 읽음 처리 실패', error);
			}
		},
		[notifications],
	);

	/**
	 * @description 읽지 않은 모든 알림을 일괄적으로 읽음 처리하기 위한 비동기 함수
	 * useCallback: 대량의 상태 업데이트 로직을 포함한 함수를 메모이제이션하기 위한 훅
	 */
	const markAllAsRead = useCallback(async () => {
		const unreadNotis = notifications.filter((n) => !n.isRead);
		if (unreadNotis.length === 0) return;

		try {
			await Promise.all(unreadNotis.map((noti) => markRead(noti.notificationId)));
			setNotifications((prev) => prev.map((noti) => ({ ...noti, isRead: true })));
		} catch (error) {
			toast.error('전체 알림 읽음 처리에 실패했습니다.');
			console.error('전체 알림 읽음 처리 실패', error);
		}
	}, [notifications]);

	/**
	 * @description 서버에서 단일 알림을 삭제하고 로컬 상태를 동기화하기 위한 비동기 함수
	 * @param {number} id - 삭제할 알림의 ID
	 * useCallback: 삭제 요청 로직을 효율적으로 관리하기 위한 훅
	 */
	const removeNotification = useCallback(async (id: number) => {
		try {
			await deleteNotification(id);
			setNotifications((prev) => prev.filter((noti) => noti.notificationId !== id));
		} catch (error) {
			toast.error('알림 삭제에 실패했습니다.');
			console.error('알림 삭제 실패', error);
		}
	}, []);

	/**
	 * @description 이미 읽은 모든 알림을 서버 및 상태에서 일괄적으로 제거하기 위한 비동기 함수
	 * useCallback: 유지관리 효율을 위해 삭제 로직을 메모이제이션하는 훅
	 */
	const removeAllNotifications = useCallback(async () => {
		try {
			await deleteAllReadNotifications();
			setNotifications((prev) => prev.filter((noti) => !noti.isRead));
		} catch (error) {
			toast.error('읽은 알림 전체 삭제에 실패했습니다.');
			console.error('읽은 알림 전체 삭제 실패', error);
		}
	}, []);

	const hasUnread = notifications.some((noti) => !noti.isRead);

	return {
		notifications,
		isOpen,
		loading,
		hasUnread,
		toggleOpen,
		close,
		markAllAsRead,
		markAsRead,
		removeNotification,
		removeAllNotifications,
	};
}

