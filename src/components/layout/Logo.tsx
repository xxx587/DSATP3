/**
 * @file Logo.tsx
 * @description 로고 이미지 컴포넌트
 * Next.js Image 컴포넌트를 사용하여 /logo.png 이미지를 최적화된 형태로 렌더링
 * fill={true} 속성으로 부모 요소 크기에 맞게 반응형 렌더링
 */

'use client';

import Image from 'next/image';

/**
 * @description 로고 이미지 컴포넌트. Next.js Image를 사용하여 /logo.png를
 *              부모 요소 크기에 맞춰 fill 모드로 반응형 렌더링
 * @return {TSX.Element} 로고 이미지 UI
 */
const Logo = () => {
	return <Image src='/logo.png' fill={true} alt='logo' sizes='max-width: 75px' quality={100} priority />;
};

export default Logo;
