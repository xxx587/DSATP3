/**
 * @file ChatSidebarTabs.tsx
 * @description 채팅 사이드바의 탭 네비게이션 컴포넌트
 */

import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description ChatSidebarTabs 컴포넌트의 Props 인터페이스
 * @property {'received' | 'sent' | 'write'} activeTab - 현재 활성화된 탭의 종류를 구분하기 위한 값
 * @property {(tab: 'received' | 'sent' | 'write') => void} onTabChange - 사용자가 탭을 클릭했을 때 활성화된 탭 상태를 변경하기 위한 콜러 함수
 */
interface ChatSidebarTabsProps {
	activeTab: 'received' | 'sent' | 'write';
	onTabChange: (tab: 'received' | 'sent' | 'write') => void;
}

/**
 * @description 채팅 사이드바의 상단 탭. 받은 메시지, 보낸 메시지, 메시지 쓰기 탭을 렌더링
 * @param {ChatSidebarTabsProps} props - 컴포넌트 Props
 * @return {TSX.Element} 탭 네비게이션 UI
 */
const ChatSidebarTabs = ({ activeTab, onTabChange }: ChatSidebarTabsProps) => {
	/**
	 * useLanguage: 현재 언어 설정을 확인하여 각 탭의 이름을 해당 언어로 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].chatSidebarTabsComponent;

	const tabs = [
		{ id: 'received', label: dict.receivedMessages },
		{ id: 'sent', label: dict.sentMessage },
		{ id: 'write', label: dict.writeMessage },
	] as const;

	return (
		<div className='flex bg-zinc-950/50 border-b border-zinc-500/10 p-2 gap-1'>
			{tabs.map((tab) => (
				<button
					key={tab.id}
					className={`flex-1 py-2.5 px-2 rounded-xl text-[11px] font-black  tracking-wider transition-all duration-300 ${
						activeTab === tab.id
							? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
							: 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
					}`}
					onClick={() => onTabChange(tab.id)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};

export default ChatSidebarTabs;
