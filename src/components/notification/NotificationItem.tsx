/**
 * @file NotificationItem.tsx
 * @description 알림 드롭다운 내 개별 알림 항목 컴포넌트
 */

import { X, MessageCircle, Heart, Mail } from 'lucide-react';
import { NotificationDto } from '@/types/notification';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description NotificationItem 컴포넌트의 Props 인터페이스
 * @property {NotificationDto} noti - 표시할 개별 알림 정보를 담고 있는 데이터 객체
 * @property {() => void} onClick - 알림 내용을 확인하기 위해 해당 항목을 클릭했을 때 실행될 핸들러 함수
 * @property {(e: React.MouseEvent) => void} onRemove - 해당 알림을 목록에서 삭제하기 위한 이벤트 핸들러 함수
 */
interface NotificationItemProps {
	noti: NotificationDto;
	onClick: () => void;
	onRemove: (e: React.MouseEvent) => void;
}

/**
 * @description 개별 알림 항목 UI. 알림 타입에 따른 메시지 렌더링, 읽음 상태 표시, 삭제 버튼
 * @param {NotificationItemProps} props - 컴포넌트 Props
 * @return {TSX.Element} 알림 항목 UI
 */
const NotificationItem = ({ noti, onClick, onRemove }: NotificationItemProps) => {
	const dateObj = new Date(noti.createdAt);
	const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
	/**
	 * useLanguage: 알림 타입별로 다르게 구성되는 메시지 본문을 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].notificationItemComponent;

	const getIcon = () => {
		if (noti.type === 'COMMENT')
			return (
				<div className='w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500'>
					<MessageCircle size={14} strokeWidth={3} />
				</div>
			);
		if (noti.type === 'LIKE')
			return (
				<div className='w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500'>
					<Heart size={14} strokeWidth={3} />
				</div>
			);
		return (
			<div className='w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500'>
				<Mail size={14} strokeWidth={3} />
			</div>
		);
	};

	const renderContent = () => {
		const highlightClass = 'font-black text-zinc-100';
		if (noti.type === 'COMMENT' && noti.boardId) {
			return (
				<div className='text-[13px] leading-relaxed text-zinc-400'>
					<span className={highlightClass}>{noti.senderNickname}</span>
					{dict.who}
					<span className='text-emerald-500 font-bold'>{dict.writtenComment}</span>
					{dict.commentLast}
				</div>
			);
		} else if (noti.type === 'LIKE' && noti.boardId) {
			return (
				<div className='text-[13px] leading-relaxed text-zinc-400'>
					<span className={highlightClass}>{noti.senderNickname}</span>
					{dict.board} <span className='text-rose-500 font-bold'>{dict.likedBoard}</span>
					{dict.likeBoardLast}
				</div>
			);
		} else if (noti.type === 'DM') {
			return (
				<div className='text-[13px] leading-relaxed text-zinc-400'>
					<span className={highlightClass}>{noti.senderNickname}</span>
					{dict.who}
					<span className='text-sky-500 font-bold'>{dict.receivedMessage}</span>
					{dict.send}
				</div>
			);
		}
		return null;
	};

	return (
		<li
			className={`px-5 py-4 cursor-pointer transition-all duration-300 group
				${!noti.isRead ? 'bg-emerald-500/5' : 'hover:bg-zinc-900/50'}`}
			onClick={onClick}
		>
			<div className='flex gap-4 items-start'>
				<div className='shrink-0 mt-0.5 relative'>
					{getIcon()}
					{!noti.isRead && (
						<div className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950' />
					)}
				</div>

				<div className='flex-1 min-w-0'>
					<div className='flex justify-between items-start gap-2'>
						{renderContent()}
						<button
							onClick={onRemove}
							className='shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100'
						>
							<X size={14} strokeWidth={3} />
						</button>
					</div>
					<div className='mt-2 flex items-center gap-2'>
						<span className='text-[10px] font-black text-zinc-600  tracking-widest'>{formattedDate}</span>
						{!noti.isRead && (
							<span className='text-[9px] font-black py-0.5 px-1.5 rounded bg-emerald-500 text-emerald-950  tracking-tighter'>
								{dict.newLabel}
							</span>
						)}
					</div>
				</div>
			</div>
		</li>
	);
};

export default NotificationItem;
