/**
 * @file PresetPreviewCard.tsx
 * @description 프리셋 정보를 요약하여 카드로 보여주는 컴포넌트
 */
'use client';

import type { PresetResponseDto as Preset } from '@/types/preset';
import { useLanguage } from '@/context/LanguageContext';
import { ko } from '@/types/languague/ko';
import { ja } from '@/types/languague/ja';

/**
 * @description PresetPreviewCard 컴포넌트의 Props 인터페이스
 * @property {Preset} preset - 카드에 표시할 프리셋의 요약 정보 데이터 객체
 * @property {() => void} [onClick] - 카드 전체를 클릭했을 때 상세 보기 등으로 이동하기 위한 이벤트 핸들러 함수
 * @property {(presetId: number) => void} [onDelete] - 프리셋 삭제 버튼 클릭 시 해당 아이템을 제거하기 위한 콜백 함수
 */
type Props = {
	preset: Preset;
	onClick?: () => void;
	onDelete?: (presetId: number) => void;
};

export default function PresetPreviewCard({ preset, onClick, onDelete }: Props) {
	const { currentLang } = useLanguage();
	const t = currentLang === 'ko' ? ko.presetPreviewCardComponent : ja.presetPreviewCardComponent;

	return (
		<div className='bg-zinc-900/40 rounded-[18px] overflow-hidden transition-all duration-300 p-4 cursor-pointer flex flex-col gap-3'>
			<button type='button' className='border-none bg-none p-0 w-full text-left cursor-pointer' onClick={onClick}>
				<div className='text-[18px] font-extrabold mb-3 text-zinc-100'>{preset.title}</div>

				<div className='flex gap-2 mb-2'>
					{preset.clothesList.slice(0, 5).map((cloth) => (
						<div
							key={cloth.id}
							className='w-[60px] h-[60px] rounded-lg bg-zinc-800 overflow-hidden border border-zinc-700'
						>
							{cloth.imageUrl ? (
								<img
									src={encodeURI(cloth.imageUrl)}
									alt={cloth.itemName}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-[10px] text-zinc-400 text-center'>
									{t.noImage}
								</div>
							)}
						</div>
					))}
				</div>
			</button>

			{onDelete && (
				<div className='flex justify-between px-2.5 py-2'>
					<button
						type='button'
						className='border-none bg-transparent text-[13px] font-bold cursor-pointer text-zinc-400 hover:underline'
						onClick={() => onDelete(preset.presetId)}
					>
						{t.delete}
					</button>
				</div>
			)}
		</div>
	);
}
