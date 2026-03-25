/**
 * @file Header.tsx
 * @description 헤더 컴포넌트
 * 상단 네비게이션 바로, 로고, 검색, 언어 변경, 채팅 사이드바, 알림, 설정(마이페이지) 버튼을 포함
 * JWT 토큰 유무에 따라 로그인/로그아웃 상태를 동적으로 렌더링
 * 로그인 시 닉네임을 표시하고, 로그아웃 버튼으로 쿠키 삭제 및 리다이렉트 처리
 */

'use client';

import { Settings, MessageCircle } from 'lucide-react';
import LanguageToggle from './LangToggle';
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/cookie';
import { useMounted } from '@/hooks/useMounted';
import Notification from '@/components/notification/Notification';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { useState } from 'react';
import { toast } from 'sonner';
import useRequireAuth from '@/hooks/useRequireAuth';
import HeaderAuth from './HeaderAuth';
import HeaderLogo from './HeaderLogo';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 헤더 컴포넌트. 상단 네비게이션 바를 렌더링
 * @return {TSX.Element} 헤더 네비게이션 UI
 */
export default function Header() {
	/**
	 * useRouter: 페이지 이동(마이페이지 등) 및 화면 갱신을 처리하기 위한 Next.js 라우터 훅
	 */
	const router = useRouter();

	/**
	 * useState: 채팅 사이드바의 열림/닫힘 상태를 제어하기 위한 훅
	 */
	const [isChatOpen, setIsChatOpen] = useState(false);

	/**
	 * useState: 채팅 사이드바 내에서 현재 활성화된 탭(받은함수, 보낸함수 등)을 관리하기 위한 훅
	 */
	const [chatTab, setChatTab] = useState<'received' | 'sent' | 'write'>('received');

	/**
	 * useRequireAuth: 특정 기능 접근 시 사용자 인증 여부를 사전에 체크하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	/**
	 * @description 채팅 사이드바를 특정 탭으로 열기 위한 함수
	 * 사용자의 인증 상태를 확인한 후에 사이드바를 활성화하기 위한 로직을 포함
	 * @param {'received' | 'sent' | 'write'} tab - 처음 열 때 활성화할 탭 (기본값: 'received')
	 */
	const handleOpenChat = (tab: 'received' | 'sent' | 'write' = 'received') => {
		if (checkAuth()) {
			setChatTab(tab);
			setIsChatOpen(true);
		}
	};

	/**
	 * useMounted: 클라이언트 사이드에서만 코드가 실행되도록 마운트 상태를 확인하기 위한 훅 (SSR 하이드레이션 오류 방지)
	 */
	const mounted = useMounted();

	/**
	 * useLanguage: 헤더 내 여러 버튼 및 닉네임 호칭 정보를 현재 언어에 맞게 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].headerComponent;

	/**
	 * @description 마이페이지로 라우팅하는 핸들러
	 */
	const routeMypage = () => {
		router.push('/mypage');
	};

	// mounted가 실행된 이후에만 쿠키 읽기 및 로그인 상태 판별
	const token = mounted ? Cookies.get('access_token') : undefined;
	const isLoggedIn = !!token;
	let nickname: string = '';

	// 토큰이 있으면 디코딩 해서 닉네임 추출
	if (token) {
		try {
			const decoded = jwtDecode<JwtPayload>(token);
			nickname = decoded.nickname;
		} catch (error) {
			console.error('토큰 해독 실패:', error);
		}
	}

	/**
	 * @description 현재 로그인된 사용자의 세션을 종료하고 로그아웃을 처리하기 위한 함수
	 * 브라우저에 저장된 인증 토큰을 삭제하고 사용자에게 알림을 표시한 뒤 페이지를 새로고침하기 위한 로직을 포함
	 */
	const handleLogout = () => {
		Cookies.remove('access_token');
		toast.success(dict.logoutToast);
		router.refresh();
	};

	/**
	 * @description 활성화된 채팅 사이드바를 닫기 위한 핸들러 함수
	 */
	const handleCloseChat = () => {
		setIsChatOpen(false);
	};

	return (
		<header key={token} className='contents'>
			<div className='w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-50'>
				<div className='mx-auto px-4 sm:px-6 h-16 flex justify-between items-center max-w-[1920px] relative'>
					{/* 헤더 좌측 부분 (채팅, 언어토글) */}
					<div className='flex items-center gap-2 sm:gap-4'>
						<button
							className='text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all p-2 rounded-lg'
							onClick={() => handleOpenChat('received')}
							aria-label={dict.openChat}
						>
							<MessageCircle className='w-5 h-5' />
						</button>
						<div className='h-4 w-px bg-zinc-800 hidden sm:block' />
						<ThemeToggle />
						<div className='h-4 w-px bg-zinc-800 hidden sm:block' />
						<LanguageToggle />
					</div>

					{/* 로고 부분 - 중앙 정렬 유지 */}
					<div className='absolute left-1/2 -translate-x-1/2 top-2'>
						<HeaderLogo />
					</div>

					{/* 상단 우측 아이콘 및 메뉴 부분 */}
					<div className='flex items-center gap-1 sm:gap-4'>
						<div className='hidden sm:flex items-center gap-1 mr-2'>
							<Notification onOpenChat={() => handleOpenChat('received')} />
							<button
								className='text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all p-2 rounded-lg'
								onClick={routeMypage}
								aria-label={dict.myPage}
							>
								<Settings className='w-5 h-5' />
							</button>
						</div>

						<div className='flex items-center pl-2 border-l border-zinc-800 ml-1 sm:ml-0'>
							{/* 인증 관련 영역 (로그인/로그아웃/닉네임) */}
							<HeaderAuth isLoggedIn={isLoggedIn} nickname={nickname} onLogout={handleLogout} />
						</div>
					</div>
				</div>
			</div>

			{/* 채팅 사이드바 */}
			<ChatSidebar isOpen={isChatOpen} onClose={handleCloseChat} activeTab={chatTab} onTabChange={setChatTab} />
		</header>
	);
}
