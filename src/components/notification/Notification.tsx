/**
 * @file Notification.tsx
 * @description 알림(Notification) 드롭다운 컴포넌트
 * 헤더의 벨 아이콘을 클릭하면 알림 목록을 드롭다운 형태로 표시
 * 읽지 않은 알림에 빨간 점 표시, 개별/전체 읽음 처리, 개별/전체 삭제 기능을 제공
 * 드롭다운 외부 클릭 시 자동으로 닫히며, 로그인 상태에서만 사용 가능
 */

'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useMounted } from '@/hooks/useMounted';
import useRequireAuth from '@/hooks/useRequireAuth';
import { NotificationDto } from '@/types/notification';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';

interface NotificationProps {
	onOpenChat: () => void;
}

/**
 * @description 알림 드롭다운 컴포넌트. 헤더의 벨 아이콘을 클릭하면 알림 목록을 표시
 * @param {NotificationProps} props - 컴포넌트 Props
 * @return {TSX.Element} 알림 벨 아이콘 및 드롭다운 목록 UI
 */
const Notification = ({ onOpenChat }: NotificationProps) => {
	/**
	 * useNotifications: 새로운 알림 상태 확인, 개별/전체 읽음 및 삭제 등 알림 기능을 관리하기 위한 커스텀 훅
	 */
	const {
		notifications,
		isOpen,
		hasUnread,
		toggleOpen,
		close,
		markAllAsRead,
		markAsRead,
		removeNotification,
		removeAllNotifications,
	} = useNotifications();

	/**
	 * useRef: 알림 드롭다운 영역 외부 클릭 시 창을 닫기 위해 DOM 요소에 직접 접근하는 훅
	 */
	const dropdownRef = useRef<HTMLDivElement>(null);

	/**
	 * useMounted: 서버 사이드 렌더링 시 발생할 수 있는 클라이언트 상태와의 불일치를 방지하기 위한 마운트 체크 훅
	 */
	const mounted = useMounted();

	/**
	 * useRequireAuth: 비로그인 사용자가 알림 기능을 이용하려 할 때 인증 확인 절차를 수행하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	/**
	 * useRouter: 특정 알림 클릭 시 해당 게시글 혹은 채팅 화면으로 페이지를 이동시키기 위한 훅
	 */
	const router = useRouter();

	/**
	 * usePathname: 현재 경로 정보를 참조하여 댓글 등 세부 위치로 이동할 때 쿼리 스트링을 조합하기 위한 훅
	 */
	const pathname = usePathname();

	/**
	 * useEffect: 알림창이 열려 있을 때 외부 클릭 여부를 감지하여 자동으로 창을 닫아주기 위한 생명주기 훅
	 */
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				close();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, close]);

	/**
	 * @description 알림 벨 아이콘 클릭 시 호출되기 위한 핸들러 함수
	 * 로그인 여부를 먼저 확인한 뒤 알림 드롭다운의 열림/닫힘 상태를 전환하기 위한 로직을 포함
	 */
	const handleBellClick = () => {
		if (checkAuth()) {
			toggleOpen();
		}
	};

	/**
	 * @description 개별 알림 항목을 클릭했을 때 호출되기 위한 핸들러 함수
	 * 해당 알림을 읽음 처리하고, 알림 타입(댓글, 좋아요, DM 등)에 따라 적절한 페이지로 이동시키기 위한 로직을 포함
	 * @param {NotificationDto} noti - 클릭한 알림 객체 데이터
	 */
	const handleNotificationClick = (noti: NotificationDto) => {
		markAsRead(noti.notificationId);
		if (noti.type === 'COMMENT' && noti.boardId) {
			close();
			router.push(`${pathname}?commentBoardId=${noti.boardId}&commentId=${noti.commentId}`, { scroll: false });
		} else if (noti.type === 'LIKE' && noti.boardId) {
			close();
			router.push(`${pathname}?boardId=${noti.boardId}`, { scroll: false });
		} else if (noti.type === 'DM') {
			close();
			onOpenChat();
		}
	};

	if (!mounted) {
		return (
			<button className='text-zinc-500 hover:text-emerald-500 transition-all relative p-2 rounded-xl hover:bg-emerald-500/10'>
				<Bell className='w-5 h-5' />
			</button>
		);
	}

	return (
		<div className='relative' ref={dropdownRef}>
			<button
				onClick={handleBellClick}
				className={`transition-all relative p-2 rounded-xl hover:bg-emerald-500/10 group ${isOpen ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 hover:text-emerald-500'}`}
			>
				<Bell
					className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:rotate-12'}`}
				/>
				{hasUnread && (
					<span className='absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-950'></span>
				)}
			</button>

			{isOpen && (
				<div className='absolute right-0 mt-3 w-[360px] bg-zinc-950 border border-zinc-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden z-50 animate-fade-in'>
					<NotificationHeader
						hasNotifications={notifications.length > 0}
						onMarkAllAsRead={markAllAsRead}
						onRemoveAllNotifications={removeAllNotifications}
					/>

					<div className='max-h-[480px] overflow-y-auto scrollbar-hide bg-zinc-950'>
						<NotificationList
							notifications={notifications}
							onNotificationClick={handleNotificationClick}
							onRemoveNotification={removeNotification}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Notification;
