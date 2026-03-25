/**
 * @file PresetCanvasPreview.tsx
 * @description 프리셋의 구성 아이템을 캔버스 형태의 그리드로 미리보는 컴포넌트
 */
'use client';

import type { PresetResponseDto as Preset } from '@/types/preset';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description PresetCanvasPreview 컴포넌트의 Props 인터페이스
 * @property {Preset | null} preset - 캔버스 그리드로 시각화하여 보여줄 대상 프리셋 데이터 객체
 */
type Props = {
	preset: Preset | null;
};

export default function PresetCanvasPreview({ preset }: Props) {
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].presetCanvasPreviewComponent;

	if (!preset) {
		return (
			<div className='flex flex-col gap-5'>
				<p className='text-xl font-extrabold text-zinc-100'>{dict.selectedPresetPreview}</p>
				<div className='h-100 flex items-center justify-center bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-[20px] text-zinc-400 text-center p-10'>
					{dict.selectedPresetPreviewExplain}
				</div>
			</div>
		);
	}

	const top = preset.clothesList.find((item) => item.category?.id === 1);
	const bottom = preset.clothesList.find((item) => item.category?.id === 2);
	const outer = preset.clothesList.find((item) => item.category?.id === 3);
	const shoes = preset.clothesList.find((item) => item.category?.id === 4);
	const accessory = preset.clothesList.find((item) => item.category?.id === 5);

	const renderItem = (
		item:
			| {
					imageUrl: string;
					itemName: string;
					category?: { name: string };
			  }
			| undefined,
		label: string,
		className: string,
	) => (
		<div className={`flex flex-col gap-2 ${className}`}>
			<div className='text-[13px] font-bold text-zinc-300'>{label}</div>
			<div className='aspect-square bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden flex items-center justify-center'>
				{item?.imageUrl ? (
					<img src={encodeURI(item.imageUrl)} alt={item.itemName} className='w-full h-full object-contain' />
				) : (
					<div className='text-zinc-400 text-[12px]'>{dict.none}</div>
				)}
			</div>
		</div>
	);

	return (
		<div className='flex flex-col gap-5'>
			<p className='text-xl font-extrabold text-zinc-100'>{dict.selectedPresetPreview}</p>

			<div className='text-2xl font-black text-zinc-100 pb-3 border-b-2 border-zinc-800'>{preset.title}</div>

			<div className="grid grid-cols-2 [grid-template-areas:'top_outer'_'bottom_accessory'_'shoes_.'] gap-4 bg-zinc-950 p-6 rounded-[20px] max-sm:grid-cols-1 max-sm:[grid-template-areas:'top'_'bottom'_'outer'_'accessory'_'shoes']">
				{renderItem(top, dict.category1, '[grid-area:top]')}
				{renderItem(bottom, dict.category2, '[grid-area:bottom]')}
				{renderItem(outer, dict.category3, '[grid-area:outer]')}
				{renderItem(shoes, dict.category4, '[grid-area:shoes]')}
				{renderItem(accessory, dict.category5, '[grid-area:accessory]')}
			</div>
		</div>
	);
}
