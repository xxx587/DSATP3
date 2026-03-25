'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getMyPresets, deletePreset } from '@/app/api/preset';
import type { PresetResponseDto } from '@/types/preset';
import PresetSelectorList from '@/components/preset/PresetSelectorList';
import PresetCanvasPreview from '@/components/preset/PresetCanvasPreview';
// import '../preset.css';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 내 코디 프리셋 목록을 확인하고 관리하기 위한 페이지 컴포넌트
 * 저장된 프리셋 목록을 표시하고, 선택된 프리셋의 상세 미리보기 및 편집/삭제 기능을 처리하기 위한 기능을 포함
 * @return {TSX.Element} 프리셋 관리 페이지 UI 구조
 */
export default function MyPresetsPage() {
	const router = useRouter();
	const [presets, setPresets] = useState<PresetResponseDto[]>([]);
	const [selectedPreset, setSelectedPreset] = useState<PresetResponseDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].myPresetComponent;

	/**
	 * @description 서버에서 내 프리셋 목록을 가져오기 위한 비동기 함수
	 * @param {boolean} isInitial - 초기 로딩 여부 (첫 로딩 시 첫 번째 프리셋을 자동으로 선택하기 위한 용도)
	 */
	const fetchPresets = useCallback(
		async (isInitial = false) => {
			try {
				setIsLoading(true);
				const response = await getMyPresets();
				setPresets(response);
				if (response.length > 0 && isInitial) {
					setSelectedPreset(response[0]);
				} else if (response.length === 0) {
					setSelectedPreset(null);
				}
			} catch (error) {
				console.error(error);
				toast.error(dict.loadError);
			} finally {
				setIsLoading(false);
			}
		},
		[dict.loadError],
	);

	useEffect(() => {
		fetchPresets(true);
	}, [fetchPresets]);

	/**
	 * @description 특정 프리셋을 삭제하기 위한 비동기 함수
	 * 사용자의 확인을 받은 후 API를 호출하여 프리셋을 삭제하고 로컬 상태를 갱신하기 위한 로직을 포함
	 * @param {number} id - 삭제할 프리셋의 고유 ID
	 */
	const handleDelete = async (id: number) => {
		if (!confirm(dict.deleteConfirm)) return;

		try {
			const response = await deletePreset(id);
			toast.success(dict.deleteSuccess);

			setPresets((prev) => {
				const updated = prev.filter((p) => p.presetId !== id);
				if (selectedPreset?.presetId === id) {
					setSelectedPreset(updated.length > 0 ? updated[0] : null);
				}
				return updated;
			});
		} catch (error) {
			console.error(error);
			toast.error(dict.deleteError);
		}
	};

	return (
		<div className='max-w-[1400px] mx-auto py-8 px-5 pb-[60px]'>
			<div className='bg-zinc-900 border border-zinc-800 rounded-[20px] p-5 mb-[14px]'>
				<div className='flex justify-between items-start gap-4 flex-wrap'>
					<div>
						<div className='text-2xl font-extrabold leading-[1.3]'>{dict.title}</div>
						<p className='text-zinc-400 text-[15px] mt-1'>{dict.desc}</p>
					</div>
					<div className='flex items-center gap-2.5 flex-wrap'>
						<button
							className='h-[46px] px-4.5 rounded-xl font-bold border-none cursor-pointer transition-all duration-200 bg-emerald-500 text-black hover:opacity-[0.92]'
							onClick={() => router.push('/preset/add')}
						>
							{dict.addNew}
						</button>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-[minmax(0,1.22fr)_minmax(360px,0.78fr)] gap-6 items-start max-[1100px]:grid-cols-1 overflow-hidden'>
				<div className='bg-zinc-900 border border-zinc-800 rounded-[20px] p-5 h-fit z-20'>
					{isLoading ? (
						<div className='py-20 text-center text-zinc-400 font-semibold'>{dict.loading}</div>
					) : (
						<PresetSelectorList
							presets={presets}
							selectedPresetId={selectedPreset?.presetId}
							onSelect={setSelectedPreset}
						/>
					)}
				</div>

				<div className='bg-zinc-900 border border-zinc-800 rounded-[20px] p-5 sticky top-6 max-[1100px]:static'>
					<PresetCanvasPreview preset={selectedPreset} />

					{selectedPreset && (
						<div className='mt-5 flex justify-end gap-2'>
							<button
								className='h-[46px] px-4.5 rounded-xl font-bold cursor-pointer transition-all duration-200 bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700'
								onClick={() => router.push(`/preset/edit/${selectedPreset.presetId}`)}
							>
								{dict.edit}
							</button>
							<button
								className='h-[46px] px-4.5 rounded-xl font-bold cursor-pointer transition-all duration-200 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
								onClick={() => handleDelete(selectedPreset.presetId)}
							>
								{dict.delete}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
