/**
 * @file PostImage.tsx
 * @description 게시글 이미지 표시 컴포넌트
 * 게시글의 이미지를 400x400 픽셀 크기로 렌더링
 * 이미지가 없는 경우 빈 회색 배경을 표시
 */

'use client';

import Image from 'next/image';

/**
 * @description PostImage 컴포넌트의 Props 인터페이스
 * @property {string} src - 게시글 본체에 렌더링할 원본 이미지의 소스 경로(URL)
 */
interface PostImageProps {
	src: string;
}

/**
 * @description 게시글 이미지 표시 컴포넌트. 이미지 URL이 있으면 400x400 크기로 렌더링하고,
 *              URL이 없으면 빈 회색 배경을 표시
 * @param {PostImageProps} props - 컴포넌트 Props
 * @return {TSX.Element} 게시글 이미지 UI
 */
const PostImage = ({ src }: PostImageProps) => {
	if (!src) {
		return <div className='w-full bg-gray-100 py-4'></div>;
	}

	return (
		<div className='w-full bg-gray-100 flex items-center justify-center overflow-hidden py-4 h-100'>
			<Image
				src={encodeURI(src)} //한글 공백 알아먹을 수 없으니 프론트단에서 인코딩
				alt='게시글 이미지'
				width={400}
				height={400}
				quality={100}
				className='object-contain rounded-sm w-full h-auto'
				placeholder='empty'
			/>
		</div>
	);
};

export default PostImage;
