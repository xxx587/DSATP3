/**
 * @file WriteMailForm.tsx
 * @description 메시지 작성 폼 컴포넌트
 * 받는 사람(최대 10자)과 내용을 입력받아 메시지를 전송하는 폼을 제공
 * 글자 수 카운터와 비활성화 조건(받는 사람/내용 미입력 시) 포함
 */

'use client';

import { useState, ChangeEvent } from 'react';
import { User, Send } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 메시지 작성 폼 컴포넌트. 받는 사람과 내용을 입력받고 보내기 버튼으로 전송
 * @return {TSX.Element} 메시지 작성 폼 UI
 */
export default function WriteMailForm() {
	/**
	 * useState: 메시지를 받을 상대방의 닉네임 입력값을 상태로 관리하기 위한 훅
	 */
	const [receiverNickname, setReceiverNickname] = useState('');

	/**
	 * useState: 작성 중인 메시지 본문의 내용을 상태로 관리하기 위한 훅
	 */
	const [content, setContent] = useState('');

	/**
	 * useChat: 메시지 전송(Send) 기능을 실행하고 전송 중 상태(loading)를 관리하기 위한 커스텀 훅
	 */
	const { handleSendDm, loading } = useChat();

	/**
	 * useLanguage: 다국어 지원을 위해 작성 폼의 placeholder와 버튼 레이블 등을 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].writeMailFormComponent;

	/**
	 * @description 받는 사람의 닉네임 입력 필드가 변경될 때 호출되기 위한 핸들러 함수
	 * 최대 10자까지만 입력을 허용하여 데이터 유효성을 처리하기 위한 로직을 포함
	 * @param {ChangeEvent<HTMLInputElement>} e - input 변경 이벤트 객체
	 */
	const handleReceiverChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length <= 10) {
			setReceiverNickname(e.target.value);
		}
	};

	/**
	 * @description 메시지 본문 내용의 텍스트가 변경될 때 호출되기 위한 핸들러 함수
	 * @param {ChangeEvent<HTMLTextAreaElement>} e - textarea 변경 이벤트 객체
	 */
	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.target.value);
	};

	/**
	 * @description 작성된 메시지를 서버에 전송하기 위한 비동기 핸들러 함수
	 * API 호출 결과에 따라 성공 시 폼을 초기화하고, 실패 시 에러 알림을 처리하기 위한 로직을 포함
	 */
	const handleSubmit = async () => {
		try {
			const success = await handleSendDm(receiverNickname, content);
			if (success) {
				setReceiverNickname('');
				setContent('');
			}
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				const status = error.response.status;
				if (status === 400) {
					toast.error(dict.notFoundNickname);
				} else {
					toast.error(dict.failSendMail);
				}
			}
		}
	};

	return (
		<div className='flex flex-col gap-6 animate-fade-in'>
			<div className='flex flex-col gap-2'>
				<div className='flex justify-between items-end px-1'>
					<label className='text-[10px] font-black text-zinc-500  tracking-widest'>
						{dict.receiverNickname}
					</label>
					<span className='text-[10px] font-black text-zinc-700  tracking-widest'>
						{receiverNickname.length}/10
					</span>
				</div>
				<div className='relative group'>
					<div className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors'>
						<User size={18} strokeWidth={2.5} />
					</div>
					<input
						type='text'
						className='w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none'
						placeholder={dict.receiverNicknamePlaceholder}
						value={receiverNickname}
						onChange={handleReceiverChange}
					/>
				</div>
			</div>

			<div className='flex flex-col gap-2 flex-1'>
				<div className='flex justify-between items-center px-1'>
					<label className='text-[10px] font-black text-zinc-500  tracking-widest'>{dict.content}</label>
				</div>
				<textarea
					className='w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-sm font-medium text-zinc-300 placeholder-zinc-700 h-64 resize-none focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none leading-relaxed'
					placeholder={dict.contentPlaceholder}
					value={content}
					onChange={handleContentChange}
				/>
			</div>

			<button
				onClick={handleSubmit}
				className='group relative w-full h-14 rounded-2xl bg-emerald-500 text-emerald-950 font-black  tracking-[0.2em] overflow-hidden hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/10 disabled:grayscale disabled:opacity-50 disabled:active:scale-100'
				disabled={!receiverNickname.trim() || !content.trim() || loading}
			>
				<span className='relative z-10 flex items-center justify-center gap-2'>
					{loading ? (
						<div className='w-5 h-5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin' />
					) : (
						<>
							<Send size={18} strokeWidth={3} />
							{dict.send}
						</>
					)}
				</span>
			</button>
		</div>
	);
}
