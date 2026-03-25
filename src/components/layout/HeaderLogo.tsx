/**
 * @file HeaderLogo.tsx
 * @description 헤더 중앙 로고 컴포넌트
 */

import Link from 'next/link';
import Logo from './Logo';

/**
 * @description 헤더 중앙 로고
 * @return {TSX.Element} 로고 UI
 */
const HeaderLogo = () => {
	return (
		<div className='absolute left-1/2 transform -translate-x-1/2'>
			<Link href='/'>
				<div className='relative w-19 h-13 items-center justify-center cursor-pointer'>
					<Logo />
				</div>
			</Link>
		</div>
	);
};

export default HeaderLogo;
