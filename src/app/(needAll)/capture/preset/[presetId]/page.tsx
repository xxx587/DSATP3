'use client';

import { use } from 'react';
import { ClothesResponseDto } from '@/types/closet';
import { usePresetCapture } from '@/hooks/usePresetCapture';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description PresetCapturePage 컴포넌트의 Props 인터페이스
 * @property {Promise<{ presetId: string }>} params - URL 경로로부터 전달받은 프리셋 식별자 정보를 포함하는 프로미스 객체
 */
interface PresetCapturePageProps {
	params: Promise<{ presetId: string }>;
}

/**
 * @description 서버의 Puppeteer가 프리셋 이미지를 생성하기 위해 캡처 타겟으로 사용하는 페이지 컴포넌트
 * @param {PresetCapturePageProps} props - 컴포넌트 Props
 * @return {TSX.Element} 프리셋 캡처 전용 페이지 UI
 */
export default function PresetCapturePage({ params }: PresetCapturePageProps) {
	// params 비동기 처리
	const { presetId } = use(params);

	const { preset, imagesLoaded, handleImageLoad } = usePresetCapture(Number(presetId));
	const { currentLang } = useLanguage();
	const previewDict = dictionaries[currentLang].presetCanvasPreviewComponent;

	const EN_CATEGORIES = {
		category1: 'Top',
		category2: 'Bottom',
		category3: 'Outer',
		category4: 'Shoes',
		category5: 'Accessory',
	};

	// 데이터 로드 전 빈 화면
	if (!preset) return <div className='bg-white h-screen' />;

	// 카테고리별 아이템 분류
	const top = preset.clothesList.find((item) => item.category?.id === 1);
	const bottom = preset.clothesList.find((item) => item.category?.id === 2);
	const outer = preset.clothesList.find((item) => item.category?.id === 3);
	const shoes = preset.clothesList.find((item) => item.category?.id === 4);
	const accessory = preset.clothesList.find((item) => item.category?.id === 5);

	/**
	 * 개별 아이템 박스 렌더링 함수
	 */
	const renderItem = (item: ClothesResponseDto | undefined, label: string, className: string) => (
		<div className={`flex flex-col gap-2 ${className}`}>
			<div className='text-base font-bold text-[#64748b]'>{label}</div>
			<div className='aspect-square bg-white rounded-xl border border-[#e2e8f0] overflow-hidden flex items-center justify-center'>
				{item?.imageUrl ? (
					<div className='relative w-full h-full'>
						<img
							src={encodeURI(item.imageUrl)}
							alt={item.itemName}
							className='w-full h-full object-contain'
							onLoad={handleImageLoad}
							onError={handleImageLoad}
							sizes='200px'
						/>
					</div>
				) : (
					<div className='text-[#cbd5e1] text-[12px]'>{previewDict.none}</div>
				)}
			</div>
		</div>
	);

	return (
		<div
			data-loaded={imagesLoaded} // Puppeteer가 true가 되기를 기다림
			className='w-[800px] bg-white inline-block'
			id='capture-target'
		>
			<div className='bg-white overflow-hidden'>
				<div className="grid grid-cols-2 [grid-template-areas:'top_outer'_'bottom_accessory'_'shoes_.'] gap-4 bg-[#f8fafc] p-6 rounded-[24px]">
					{renderItem(top, EN_CATEGORIES.category1, '[grid-area:top]')}
					{renderItem(outer, EN_CATEGORIES.category3, '[grid-area:outer]')}
					{renderItem(bottom, EN_CATEGORIES.category2, '[grid-area:bottom]')}
					{renderItem(shoes, EN_CATEGORIES.category4, '[grid-area:shoes]')}
					{renderItem(accessory, EN_CATEGORIES.category5, '[grid-area:accessory]')}
				</div>
			</div>
		</div>
	);
}
