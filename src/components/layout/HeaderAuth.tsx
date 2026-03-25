/**
 * @file HeaderAuth.tsx
 * @description 헤더 내 사용자 인증 관련 UI 컴포넌트
 * 로그인/로그아웃 상태에 따른 링크와 사용자 닉네임, 로그아웃 버튼을 표시
 */

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description HeaderAuth 컴포넌트의 Props 인터페이스
 * @property {boolean} isLoggedIn - 사용자의 현재 로그인 여부를 판별하기 위한 상태 값
 * @property {string} nickname - 로그인한 사용자의 닉네임을 화면에 표시하기 위한 문자열 데이터
 * @property {() => void} onLogout - 로그아웃 버튼 클릭 시 세션을 종료하기 위한 콜백 함수
 */
interface HeaderAuthProps {
	isLoggedIn: boolean;
	nickname: string;
	onLogout: () => void;
}

/**
 * @description 헤더의 우측 인증 영역. 로그인 상태이면 닉네임과 로그아웃 버튼, 비로그인 상태이면 로그인과 회원가입 링크를 표시
 * @param {HeaderAuthProps} props - 컴포넌트 Props
 * @return {TSX.Element} 인증 관련 UI
 */
const HeaderAuth = ({ isLoggedIn, nickname, onLogout }: HeaderAuthProps) => {
	/**
	 * useLanguage: 로그인/로그아웃 버튼 텍스트와 사용자 호칭(님 등)을 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].headerAuthComponent;

	return (
		<div className='flex items-center ml-4 gap-1 sm:gap-4'>
			{!isLoggedIn ? (
				<div className='flex items-center gap-1 sm:gap-2'>
					<Link
						href='/login'
						className='text-xs sm:text-sm font-medium text-zinc-400 hover:text-emerald-500 px-2 py-1.5 rounded-md hover:bg-emerald-500/10 transition-all'
					>
						{dict.login}
					</Link>
					<div className='h-4 w-px bg-zinc-800' />
					<Link
						href='/register'
						className='text-xs sm:text-sm font-medium text-emerald-500 hover:text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all'
					>
						{dict.register}
					</Link>
				</div>
			) : (
				<div className='flex items-center gap-3'>
					<div className='flex flex-col items-end'>
						<p className='text-xs sm:text-sm font-bold text-emerald-500 leading-tight'>
							{nickname}
							<span className='text-zinc-400 font-normal ml-0.5'>{dict.honorifics}</span>
						</p>
					</div>
					<div className='h-4 w-px bg-zinc-800'></div>
					<button
						onClick={onLogout}
						className='text-xs sm:text-sm font-medium text-zinc-400 hover:text-emerald-500 px-2 py-1.5 rounded-md hover:bg-emerald-500/10 transition-all'
					>
						{dict.logout}
					</button>
				</div>
			)}
		</div>
	);
};

export default HeaderAuth;
