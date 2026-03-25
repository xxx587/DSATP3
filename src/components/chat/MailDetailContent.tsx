/**
 * @file MailDetailContent.tsx
 * @description 메시지 상세 내용 표시 컴포넌트
 */

import { Clock } from 'lucide-react';
import { DmResponseDTO } from '@/types/dm';

/**
 * @description MailDetailContent 컴포넌트의 Props 인터페이스
 * @property {DmResponseDTO} dm - 표시할 메시지의 상세 데이터 객체 (본문 내용 등 포함)
 * @property {string} targetName - 메시지를 주고받는 상대방의 닉네임
 * @property {string} formattedDate - 화면에 출력하기 위해 포맷팅된 메시지 송수신 일시 문자열
 */
interface MailDetailContentProps {
	dm: DmResponseDTO;
	targetName: string;
	formattedDate: string;
}

import TranslatableText from '../post/TranslatableText';

/**
 * @description 메시지 상세 정보를 보여줌
 * @param {MailDetailContentProps} props - 컴포넌트 Props
 * @return {TSX.Element} 상세 내용 UI
 */
const MailDetailContent = ({ dm, targetName, formattedDate }: MailDetailContentProps) => {
	return (
		<div className='p-4 flex flex-col gap-6 overflow-y-auto flex-1'>
			<div className='flex justify-between items-start'>
				<div className='flex items-center gap-3'>
					<div className='flex flex-col'>
						<span className='font-bold text-foreground text-sm tracking-tight'>{targetName}</span>
						<span className='text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 font-medium'>
							<Clock className='w-2.5 h-2.5' />
							{formattedDate}
						</span>
					</div>
				</div>
			</div>

			<div className='bg-muted/30 p-5 rounded-2xl flex-1 shadow-inner border border-border/50'>
				<TranslatableText
					text={dm.content}
					className='text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium'
				/>
			</div>
		</div>
	);
};

export default MailDetailContent;
