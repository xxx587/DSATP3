/**
 * @file NotificationList.tsx
 * @description 알림 목록을 렌더링하는 컴포넌트
 */
import { NotificationDto } from '@/types/notification';
import NotificationItem from './NotificationItem';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
import { Bell } from 'lucide-react';

/**
 * @description NotificationList 컴포넌트의 Props 인터페이스
 * @property {NotificationDto[]} notifications - 화면에 나열할 전체 알림 데이터 객체 배열
 * @property {(noti: NotificationDto) => void} onNotificationClick - 특정 알림 항목을 클릭하여 해당 게시글이나 서비스로 이동하기 위한 핸들러 함수
 * @property {(id: number) => void} onRemoveNotification - 특정 알림을 목록에서 개별적으로 삭제하기 위한 콜백 함수
 */
interface NotificationListProps {
	notifications: NotificationDto[];
	onNotificationClick: (noti: NotificationDto) => void;
	onRemoveNotification: (id: number) => void;
}

/**
 * @description 알림 목록을 순회하며 개별 NotificationItem을 렌더링. 목록이 비어있으면 안내 문구 표시
 * @param {NotificationListProps} props - 컴포넌트 Props
 * @return {TSX.Element} 알림 목록 UI
 */
const NotificationList = ({ notifications, onNotificationClick, onRemoveNotification }: NotificationListProps) => {
	/**
	 * useLanguage: 알림이 하나도 없을 때 보여줄 안내 문구를 현재 언어로 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].notificationListComponent;

	if (notifications.length === 0) {
		return (
			<div className='p-12 flex flex-col items-center justify-center gap-4 animate-scale-in'>
				<div className='w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center text-zinc-700 shadow-inner'>
					<Bell className='opacity-20' size={32} strokeWidth={1} />
				</div>
				<p className='text-[11px] font-black  tracking-[0.2em] text-zinc-600 text-center'>
					{dict.notFoundNotification}
				</p>
			</div>
		);
	}

	return (
		<ul className='divide-y divide-zinc-500/5'>
			{notifications.map((noti) => (
				<NotificationItem
					key={noti.notificationId}
					noti={noti}
					onClick={() => onNotificationClick(noti)}
					onRemove={(e) => {
						e.stopPropagation();
						onRemoveNotification(noti.notificationId);
					}}
				/>
			))}
		</ul>
	);
};

export default NotificationList;
