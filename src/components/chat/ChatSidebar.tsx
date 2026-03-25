/**
 * @file ChatSidebar.tsx
 * @description 채팅(메시지) 사이드바 컴포넌트
 * 화면 좌측에서 슬라이드 인/아웃되는 메시지 사이드바를 제공
 * 받은 메시지, 보낸 메시지, 메시지 쓰기 세 개의 탭으로 구성
 */

'use client';

import { X } from 'lucide-react';
import ReceivedMailList from './ReceivedMailList';
import SentMailList from './SentMailList';
import WriteMailForm from './WriteMailForm';
import ChatSidebarTabs from './ChatSidebarTabs';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description ChatSidebar 컴포넌트의 Props 인터페이스
 * @property {boolean} isOpen - 사이드바가 화면에 표시되고 있는지 여부를 처리하기 위한 상태 값
 * @property {() => void} onClose - 사이드바를 닫기 위한 이벤트 핸들러 함수
 * @property {'received' | 'sent' | 'write'} activeTab - 현재 활성화된 탭 종류를 식별하기 위한 값
 * @property {(tab: 'received' | 'sent' | 'write') => void} onTabChange - 탭 전환 시 호출되어 상태를 변경하기 위한 함수
 */
interface ChatSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	activeTab: 'received' | 'sent' | 'write';
	onTabChange: (tab: 'received' | 'sent' | 'write') => void;
}

/**
 * @description 메시지 사이드바 컴포넌트. 받은 메시지, 보낸 메시지, 메시지 쓰기 탭을 제공
 * @param {ChatSidebarProps} props - 컴포넌트 Props
 * @return {TSX.Element} 사이드바 UI
 */
export default function ChatSidebar({ isOpen, onClose, activeTab, onTabChange }: ChatSidebarProps) {
	/**
	 * useLanguage: 현재 언어 설정에 맞는 번역 사전을 가져와 사이드바의 텍스트를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].chatSidebarComponent;

	return (
		<>
			{/* 백드롭 레이어 */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity animate-fade-in'
					onClick={onClose}
				/>
			)}

			<div
				className={`fixed top-0 left-0 h-full w-[400px] bg-zinc-950/80 backdrop-blur-2xl border-r border-zinc-500/10 z-70 shadow-[20px_0_50px_rgba(0,0,0,0.3)] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				{/* 상단 헤더 영역 */}
				<div className='flex items-center justify-between p-6 border-b border-zinc-500/10 bg-zinc-950/50 relative overflow-hidden'>
					<div className='absolute left-0 top-0 w-1 h-full bg-emerald-500' />
					<div className='flex flex-col gap-0.5'>
						<span className='font-black text-lg text-zinc-100  tracking-tight'>{dict.messageText}</span>
					</div>
					<button
						onClick={onClose}
						className='w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all group'
					>
						<X className='w-5 h-5 transition-transform group-hover:rotate-90' />
					</button>
				</div>

				{/* 탭 네비게이션 영역 */}
				<ChatSidebarTabs activeTab={activeTab} onTabChange={onTabChange} />

				{/* 탭별 콘텐츠 영역 */}
				<div className='flex-1 overflow-y-auto scrollbar-hide bg-linear-to-b from-transparent to-zinc-950/50 p-6'>
					<div className='animate-fade-in'>
						{activeTab === 'received' && <ReceivedMailList />}
						{activeTab === 'sent' && <SentMailList />}
						{activeTab === 'write' && <WriteMailForm />}
					</div>
				</div>
			</div>
		</>
	);
}
