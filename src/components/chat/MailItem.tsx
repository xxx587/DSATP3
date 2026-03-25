/**
 * @file MailItem.tsx
 * @description 단일 메시지 아이템 컴포넌트
 * 받은 메시지 또는 보낸 메시지를 리스트 형태로 표시할 때 사용
 */

import { DmResponseDTO } from '@/types/dm';
import { Clock, Check, User } from 'lucide-react';

/**
 * @description MailItem 컴포넌트의 Props 인터페이스
 * @property {DmResponseDTO} dm - 표시할 메시지(DM) 정보 객체
 * @property {'received' | 'sent'} type - 해당 메시지가 받은 것인지 보낸 것인지 구분하기 위한 타입 값
 * @property {(dm: DmResponseDTO) => void} onClick - 메시지 클릭 시 상세 내용을 보기 위한 콜백 함수
 */
interface MailItemProps {
	dm: DmResponseDTO;
	type: 'received' | 'sent';
	onClick?: (dm: DmResponseDTO) => void;
}

/**
 * @description 메시지 목록 내 개별 아이템 컴포넌트
 * @param {MailItemProps} props - 컴포넌트 Props
 * @return {TSX.Element}
 */
export default function MailItem({ dm, type, onClick }: MailItemProps) {
	const targetName = type === 'received' ? dm.senderNickname : dm.receiverNickname;

	const date = new Date(dm.createdAt);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;

	return (
		<div
			onClick={() => onClick && onClick(dm)}
			className={`group relative p-4 mb-3 rounded-2xl border border-transparent transition-all duration-300 cursor-pointer overflow-hidden
				${type === 'received' && !dm.read ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900'}`}
		>
			<div className='absolute right-0 top-0 w-32 h-32 bg-emerald-500/2 blur-2xl -z-10 group-hover:bg-emerald-500/5 transition-colors' />

			<div className='flex gap-4 items-start'>
				<div className='shrink-0 w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors shadow-inner'>
					<User size={18} strokeWidth={2.5} />
				</div>

				<div className='flex-1 min-w-0'>
					<div className='flex justify-between items-center mb-1'>
						<div className='flex items-center gap-2 min-w-0'>
							<span className='text-[10px] font-black text-zinc-600  tracking-widest shrink-0'>
								{type === 'received' ? 'From' : 'To'}
							</span>
							<span className='font-black text-sm text-zinc-100 truncate'>{targetName}</span>
							{type === 'received' && !dm.read && (
								<span className='px-1.5 py-0.5 rounded bg-emerald-500 text-emerald-950 text-[9px] font-black  tracking-tighter'>
									New
								</span>
							)}
						</div>
						{type === 'sent' && (
							<div
								className={`p-1 rounded-lg ${dm.read ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-600 bg-zinc-800/50'}`}
							>
								<Check size={12} strokeWidth={3} />
							</div>
						)}
					</div>

					<p className='text-sm text-zinc-400 font-medium line-clamp-2 leading-relaxed mb-3'>{dm.content}</p>

					<div className='flex items-center gap-2 text-[10px] font-black text-zinc-600  tracking-widest'>
						<Clock size={12} />
						<span>{formattedDate}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
