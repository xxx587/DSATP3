/**
 * @file PresetSelectorList.tsx
 * @description 저장된 프리셋 목록을 나열하고 선택할 수 있게 하는 리스트 컴포넌트
 */
'use client';

import type { PresetResponseDto as Preset } from '@/types/preset';
import PresetPreviewCard from '@/components/preset/PresetPreviewCard';
import { useLanguage } from '@/context/LanguageContext';
import { ko } from '@/types/languague/ko';
import { ja } from '@/types/languague/ja';

/**
 * @description PresetSelectorList 컴포넌트의 Props 인터페이스
 * @property {Preset[]} presets - 목록에 나열할 가용한 전체 프리셋 객체 배열
 * @property {number | null} [selectedPresetId] - 상위 컨텍스트에서 현재 활성화된 특정 프리셋의 고유 ID 값
 * @property {(preset: Preset) => void} onSelect - 목록 내의 프리셋 아이템을 클릭하여 선택했을 때 호출되기 위한 콜백 함수
 */
type Props = {
	presets: Preset[];
	selectedPresetId?: number | null;
	onSelect: (preset: Preset) => void;
};

export default function PresetSelectorList({ presets, selectedPresetId, onSelect }: Props) {
	const { currentLang } = useLanguage();
	const t = currentLang === 'ko' ? ko.presetSelectorListComponent : ja.presetSelectorListComponent;

	if (presets.length === 0) {
		return <div className='flex justify-center text-2xl items-center h-full text-red-500'>{t.noSavedPresets}</div>;
	}

	return (
		<div className='flex flex-col gap-5'>
			<p className='text-2xl font-extrabold leading-[1.3]'>{t.savedPresets}</p>

			<div className='grid grid-rows-1 gap-3'>
				{presets.map((preset) => (
					<div
						key={preset.presetId}
						className={`group rounded-[18px] overflow-hidden transition-all duration-300 bg-zinc-950 shadow-2xl relative border-2 ${selectedPresetId === preset.presetId ? 'border-emerald-500/40 shadow-emerald-500/10' : 'border-zinc-800/50 hover:border-emerald-500/30'}`}
					>
						<PresetPreviewCard preset={preset} onClick={() => onSelect(preset)} />
					</div>
				))}
			</div>
		</div>
	);
}
