/**
 * @file NotificationHeader.tsx
 * @description 알림 드롭다운의 헤더 영역 컴포넌트
 * 알림 제목과 모두 읽음, 읽은 알림 삭제 버튼을 포함
 */

import { CheckCheck, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description NotificationHeader 컴포넌트의 Props 인터페이스
 * @property {boolean} hasNotifications - 현재 표시할 알림 데이터가 하나 이상 존재하는지 여부 (버튼 노출 제어용)
 * @property {() => void} onMarkAllAsRead - 리스트의 모든 미확인 알림을 읽음 상태로 일괄 변경하기 위한 핸들러 함수
 * @property {() => void} onRemoveAllNotifications - 읽은 모든 알림을 목록에서 한꺼번에 제거하기 위한 핸들러 함수
 */
interface NotificationHeaderProps {
	hasNotifications: boolean;
	onMarkAllAsRead: () => void;
	onRemoveAllNotifications: () => void;
}

/**
 * @description 알림 드롭다운 상단 영역. 알림 개수가 0보다 크면 관리 버튼들을 표시
 * @param {NotificationHeaderProps} props - 컴포넌트 Props
 * @return {TSX.Element} 알림 헤더 UI
 */
const NotificationHeader = ({
	hasNotifications,
	onMarkAllAsRead,
	onRemoveAllNotifications,
}: NotificationHeaderProps) => {
	/**
	 * useLanguage: 알림 제목 및 '모두 읽음' 버튼 툴팁 등을 현재 언어 설정에 맞춰 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].notificationHeaderComponent;

	return (
		<div className='flex items-center justify-between p-5 border-b border-zinc-500/10 bg-zinc-950/50 relative overflow-hidden'>
			<div className='absolute left-0 top-0 w-1 h-full bg-emerald-500' />
			<div className='flex flex-col gap-0.5'>
				<span className='font-black text-2xl  tracking-[0.2em] text-zinc-100'>
					{dict.notificationText}
				</span>
			</div>
			{hasNotifications && (
				<div className='flex items-center gap-2'>
					<button
						onClick={onMarkAllAsRead}
						className='w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all duration-300'
						title={dict.readAll}
					>
						<CheckCheck size={16} strokeWidth={3} />
					</button>
					<button
						onClick={onRemoveAllNotifications}
						className='w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300'
						title={dict.readNotificationDelete}
					>
						<Trash2 size={16} strokeWidth={3} />
					</button>
				</div>
			)}
		</div>
	);
};

export default NotificationHeader;
