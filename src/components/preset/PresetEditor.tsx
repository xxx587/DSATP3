'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { getMyClothes as getClosetItems } from '@/app/api/closet';
import { api } from '@/lib/axios';
import { getPresetDetail, updatePreset, getMyPresets, deletePreset, createPreset } from '@/app/api/preset';
import type { PresetResponseDto } from '@/types/preset';
import type { ClothesResponseDto } from '@/types/closet';
import { toast } from 'sonner';
import { useDialog } from '@/context/DialogContext';
import { useLanguage } from '@/context/LanguageContext';
import { ko } from '@/types/languague/ko';
import { ja } from '@/types/languague/ja';
import { dictionaries } from '@/types/languague';

const SEASON_MAP: Record<string, keyof typeof ko.closetPageComponent> = {
	봄: 'spring',
	여름: 'summer',
	가을: 'autumn',
	겨울: 'winter',
};

interface ClosetItem {
	clothesId: number;
	itemName: string;
	imageUrl: string;
	category: {
		categoryId: number;
		name: string;
	};
	season: string;
}

type SelectedMap = {
	1?: ClosetItem;
	2?: ClosetItem;
	3?: ClosetItem;
	4?: ClosetItem;
	5?: ClosetItem;
};

// Moved CATEGORY_LABEL logic inside component to use translations

const SEASONS = ['봄', '여름', '가을', '겨울'] as const;
type Season = (typeof SEASONS)[number];

/**
 * @description PresetEditor 컴포넌트의 Props 인터페이스
 * @property {'create' | 'edit'} mode - 에디터의 동작 모드 ('create': 신규 생성, 'edit': 기존 프리셋 수정)
 * @property {number} [presetId] - 수정 모드일 때 서버에서 기존 프리셋 정보를 조회하기 위한 고유 식별자 ID
 */
type PresetEditorProps = {
	mode: 'create' | 'edit';
	presetId?: number;
};

export default function PresetEditor({ mode, presetId }: PresetEditorProps) {
	/**
	 * useLanguage: 프리셋 에디터 내의 각종 UI 텍스트(카테고리, 시즌, 버튼 등)를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();

	/**
	 * useDialog: 프리셋 삭제 전 사용자에게 확인 창을 띄우기 위한 커스텀 다이얼로그 훅
	 */
	const { confirm } = useDialog();
	const t = currentLang === 'ko' ? ko.presetEditorComponent : ja.presetEditorComponent;

	/**
	 * useRouter: 프리셋 저장 또는 삭제 후 다른 페이지로 이동하기 위한 훅
	 */
	const router = useRouter();

	/**
	 * useState: 현재 유저의 옷장에 저장된 아이템 목록을 관리하기 위한 훅
	 */
	const [items, setItems] = useState<ClosetItem[]>([]);

	/**
	 * useState: 각 카테고리(상의, 하의 등)별로 선택된 아이템을 매핑하여 관리하기 위한 훅
	 */
	const [selected, setSelected] = useState<SelectedMap>({});

	/**
	 * useState: 프리셋의 제목 입력을 관리하기 위한 훅
	 */
	const [title, setTitle] = useState('');

	/**
	 * useState: 드래그 앤 드롭 시 현재 드래그 중인 아이템의 ID를 추적하기 위한 훅
	 */
	const [draggingId, setDraggingId] = useState<number | null>(null);

	/**
	 * useState: 유저가 기존에 저장한 프리셋 목록을 관리하기 위한 훅
	 */
	const [presets, setPresets] = useState<PresetResponseDto[]>([]);

	/**
	 * useState: 데이터 로딩 상태를 관리하기 위한 훅
	 */
	const [loading, setLoading] = useState(true);

	/**
	 * useMemo: 현재 다국어 설정(t)이 변경될 때만 카테고리 레이블 객체를 재생성하도록 최적화하기 위한 훅
	 */
	const categoryLabel = useMemo(
		() => ({
			1: t.category1,
			2: t.category2,
			3: t.category3,
			4: t.category4,
			5: t.category5,
		}),
		[t],
	);

	/**
	 * useState: 옷장 아이템 목록에서 현재 필터링된 카테고리 ID를 관리하기 위한 훅
	 */
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

	/**
	 * useState: 봄, 여름, 가을, 겨울 각 시즌별 필터 활성화 상태를 관리하기 위한 훅
	 */
	const [seasonFilter, setSeasonFilter] = useState<Record<Season, boolean>>({
		봄: false,
		여름: false,
		가을: false,
		겨울: false,
	});

	/**
	 * useEffect: 컴포넌트 마운트 시 옷장 아이템과 프리셋 목록을 서버에서 호출(fetchData)하기 위한 생명주기 훅
	 * 수정 모드 인 경우(mode === 'edit') 기존 프리셋 상세 정보도 함께 불러옴
	 */
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [clothesData, presetsData] = await Promise.all([getClosetItems(), getMyPresets()]);

				const closetItems: ClosetItem[] = clothesData.map((item: ClothesResponseDto) => ({
					...item,
					clothesId: item.id,
					category: {
						categoryId: item.category.id,
						name: item.category.name,
					},
				}));
				setItems(closetItems);
				setPresets(presetsData);

				if (mode === 'edit' && presetId) {
					const preset = await getPresetDetail(presetId);
					setTitle(preset.title ?? '');

					const selectedMap: SelectedMap = {};

					preset.clothesList.forEach((cloth) => {
						const matched = closetItems.find((item) => item.clothesId === cloth.id);
						const categoryId = cloth.category?.id as keyof SelectedMap | undefined;

						if (matched && categoryId) {
							selectedMap[categoryId] = matched;
						}
					});

					setSelected(selectedMap);
				}
			} catch (error) {
				console.error(error);
				toast.error(mode === 'edit' ? t.loadError : t.closetLoadError);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [mode, presetId, t.closetLoadError, t.loadError]);

	const selectedIds = Object.values(selected)
		.filter(Boolean)
		.map((item) => item!.clothesId);

	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			const matchCategory = selectedCategoryId == null || item.category?.categoryId === selectedCategoryId;

			const selectedSeasons = Object.entries(seasonFilter)
				.filter(([, checked]) => checked)
				.map(([season]) => season);

			const matchSeason = selectedSeasons.length === 0 || (item.season && selectedSeasons.includes(item.season));

			return matchCategory && matchSeason;
		});
	}, [items, selectedCategoryId, seasonFilter]);

	const toggleSeason = (season: Season) => {
		setSeasonFilter((prev) => ({
			...prev,
			[season]: !prev[season],
		}));
	};

	const handleSelect = (item: ClosetItem) => {
		const categoryId = item.category?.categoryId as keyof SelectedMap;
		if (!categoryId) return;

		setSelected((prev) => ({
			...prev,
			[categoryId]: prev[categoryId]?.clothesId === item.clothesId ? undefined : item,
		}));
	};

	const handleDropToSlot = (categoryId: keyof SelectedMap) => {
		if (!draggingId) return;

		const draggedItem = items.find((item) => item.clothesId === draggingId);
		if (!draggedItem) return;

		if (draggedItem.category?.categoryId !== categoryId) {
			toast.error(
				`${categoryLabel[categoryId as 1 | 2 | 3 | 4 | 5]}${t.categoryOnlyAllowed1}${categoryLabel[categoryId as 1 | 2 | 3 | 4 | 5]}${t.categoryOnlyAllowed2}`,
			);
			return;
		}

		setSelected((prev) => ({
			...prev,
			[categoryId]: draggedItem,
		}));

		setDraggingId(null);
	};

	const clearSlot = (categoryId: keyof SelectedMap) => {
		setSelected((prev) => ({
			...prev,
			[categoryId]: undefined,
		}));
	};

	const onPresetDelete = async (id: number) => {
		if (!(await confirm(t.deleteConfirm))) return;
		try {
			await deletePreset(id);
			setPresets((prev) => prev.filter((p) => p.presetId !== id));
		} catch (error) {
			console.error(error);
			toast.error(t.deleteFail);
		}
	};

	const onPresetEdit = (id: number) => {
		router.push(`/preset/edit/${id}`);
	};

	const handleSave = async () => {
		if (!selected[1] || !selected[2]) {
			toast.info(t.requiredTopBottom);
			return;
		}

		try {
			const clothesIds = Object.values(selected)
				.filter(Boolean)
				.map((item) => item!.clothesId);

			const requestBody = {
				title: title.trim() || t.defaultTitle,
				description: mode === 'edit' ? t.editPresetMode : t.save,
				clothesIds,
			};

			if (mode === 'edit' && presetId) {
				await updatePreset(presetId, requestBody);
				toast.success(t.editSuccess);
			} else {
				await createPreset(requestBody);
				toast.success(t.saveSuccess);
			}

			router.push('/preset');
		} catch (error) {
			console.error(error);
			toast.error(mode === 'edit' ? t.editFail : t.saveFail);
		}
	};

	const renderSlot = (categoryId: keyof SelectedMap) => {
		const item = selected[categoryId];
		const label = categoryLabel[categoryId as 1 | 2 | 3 | 4 | 5];

		return (
			<div
				className={`group/slot border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30 p-5 min-h-[300px] transition-all duration-500 relative overflow-hidden ${
					item
						? 'border-solid border-emerald-500/30 bg-zinc-900/50 shadow-2xl shadow-emerald-500/5'
						: 'hover:border-zinc-700 hover:bg-zinc-900/40'
				}`}
				onDragOver={(e) => e.preventDefault()}
				onDrop={() => handleDropToSlot(categoryId)}
			>
				{item && (
					<div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl -z-10 rounded-full' />
				)}

				<div className='flex items-center justify-between mb-4 relative z-10'>
					<span className='text-sm font-black text-zinc-500  tracking-widest'>{label}</span>
					{item ? (
						<button
							type='button'
							className='w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90'
							onClick={() => clearSlot(categoryId)}
						>
							<X size={16} strokeWidth={3} />
						</button>
					) : null}
				</div>

				{item ? (
					<div className='flex flex-col gap-4 relative z-10'>
						<div className='w-full aspect-3/4 rounded-2xl overflow-hidden bg-zinc-950 shadow-xl border border-zinc-800/50'>
							{item.imageUrl ? (
								<img
									src={encodeURI(item.imageUrl)}
									alt={item.itemName ?? label}
									className='w-full h-full object-cover transition-transform duration-700'
								/>
							) : null}
						</div>

						<div className='flex flex-col'>
							<div className='text-lg font-black text-zinc-100 tracking-tight leading-tight mb-1'>
								{item.itemName ?? t.noName}
							</div>
							<div className='flex items-center gap-2'>
								<span className='text-sm font-bold text-emerald-500/70 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10 '>
									{item.category?.categoryId
										? (t[
												`category${item.category.categoryId as 1 | 2 | 3 | 4 | 5}` as keyof typeof t
											] as string)
										: (item.category?.name ?? '')}
								</span>
								{item.season && (
									<span className='text-sm font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-800/50 '>
										{
											dictionaries[currentLang].closetPageComponent[
												SEASON_MAP[item.season as Season]
											]
										}
									</span>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className='h-[200px] flex items-center justify-center text-center text-zinc-600 bg-zinc-950/50 rounded-2xl text-[13px] font-bold leading-relaxed border border-zinc-800/30'>
						{t.dragToAddPrefix}
						<br />
						{t.dragToAddSuffix}
					</div>
				)}
			</div>
		);
	};

	if (loading) {
		return (
			<div className='w-full bg-zinc-950 min-h-screen'>
				<div className='p-5'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 mb-8'>
						<div className='h-32 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800/50' />
						<div className='h-32 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800/50' />
						<div className='h-32 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800/50' />
					</div>
					<div className='h-40 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800/50 mb-8' />
					<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
						<div className='lg:col-span-3 grid grid-cols-4 gap-6'>
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className='aspect-3/4 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800/50'
								/>
							))}
						</div>
						<div className='h-96 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800/50' />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='w-full bg-zinc-950 min-h-screen'>
			<div className='p-5'>
				<div className='flex gap-8 mt-4 overflow-hidden'>
					<aside className='bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 w-80 shrink-0 shadow-2xl h-fit z-20'>
						<div className='mb-8'>
							<p className='text-sm font-black text-zinc-500 tracking-[0.2em] mb-4'>{t.category}</p>
							<div className='flex flex-col gap-2'>
								<label
									className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedCategoryId === null ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-400 hover:border-zinc-700'}`}
								>
									<input
										type='radio'
										name='cat'
										className='hidden'
										checked={selectedCategoryId == null}
										onChange={() => setSelectedCategoryId(null)}
									/>
									<span className='text-sm font-black'>{t.viewAll}</span>
								</label>

								{[1, 2, 3, 4, 5].map((id) => (
									<label
										key={id}
										className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedCategoryId === id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-400 hover:border-zinc-700'}`}
									>
										<input
											type='radio'
											name='cat'
											className='hidden'
											checked={selectedCategoryId === id}
											onChange={() => setSelectedCategoryId(id)}
										/>
										<span className='text-sm font-black'>
											{categoryLabel[id as 1 | 2 | 3 | 4 | 5]}
										</span>
									</label>
								))}
							</div>
						</div>

						<div className='mb-8'>
							<p className='text-sm font-black text-zinc-500  tracking-[0.2em] mb-4'>{t.season}</p>
							<div className='grid grid-cols-2 gap-2'>
								{SEASONS.map((s) => (
									<label
										key={s}
										className={`flex items-center justify-center py-2.5 rounded-xl cursor-pointer transition-all duration-300 border text-sm font-bold ${seasonFilter[s] ? 'bg-emerald-500 text-emerald-950 border-emerald-500' : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-500 hover:border-zinc-700'}`}
									>
										<input
											type='checkbox'
											className='hidden'
											checked={seasonFilter[s]}
											onChange={() => toggleSeason(s)}
										/>
										{dictionaries[currentLang].closetPageComponent[SEASON_MAP[s]]}
									</label>
								))}
							</div>
						</div>

						<div>
							<p className='text-sm font-black text-zinc-500  tracking-[0.2em] mb-4'>{t.savedPresets}</p>
							{presets.length === 0 ? (
								<div className='text-sm font-bold text-zinc-600 bg-zinc-950/30 p-4 rounded-2xl border border-dashed border-zinc-800/50 text-center leading-relaxed'>
									{t.noSavedPresets}
								</div>
							) : (
								<div className='flex flex-col gap-3'>
									{presets.map((preset) => (
										<div
											key={preset.presetId}
											className='group border border-zinc-800/50 rounded-2xl p-4 bg-zinc-950/50 hover:border-emerald-500/30 transition-all duration-300'
										>
											<div className='font-black text-sm text-zinc-200 mb-3 group-hover:text-emerald-400 transition-colors'>
												{preset.title}
											</div>

											<div className='flex gap-1.5 mb-3'>
												{preset.clothesList?.slice(0, 4).map((cloth) => (
													<div
														key={cloth.id}
														className='w-10 h-10 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800/50'
													>
														{cloth.imageUrl ? (
															<img
																src={encodeURI(cloth.imageUrl)}
																alt=''
																className='w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity'
															/>
														) : (
															<div className='w-full h-full flex items-center justify-center text-zinc-700 text-[10px] font-black'>
																-
															</div>
														)}
													</div>
												))}
											</div>

											<div className='flex justify-end gap-3'>
												<button
													type='button'
													className='text-xs font-black tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors '
													onClick={() => onPresetEdit(preset.presetId)}
												>
													{t.edit}
												</button>
												<button
													type='button'
													className='text-xs font-black tracking-widest text-zinc-500 hover:text-red-400 transition-colors '
													onClick={() => onPresetDelete(preset.presetId)}
												>
													{t.delete}
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</aside>

					<main className='flex-1'>
						<div className='bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-6 shadow-2xl mb-8 relative overflow-hidden group'>
							<div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -z-10 rounded-full group-hover:bg-emerald-500/10 transition-colors duration-700' />

							<div className='flex justify-between items-center gap-4 flex-wrap relative z-10'>
								<div>
									<p className='text-3xl font-black text-zinc-100 tracking-tight mb-1'>
										{mode === 'edit' ? t.editPresetMode : t.makePresetMode}
									</p>
									<p className='text-sm text-zinc-500 font-medium'>{t.makePresetDesc}</p>
								</div>

								<div className='flex items-center gap-3 flex-wrap max-sm:w-full'>
									<div className='relative group/input'>
										<input
											value={title}
											onChange={(e) => setTitle(e.target.value.slice(0, 20))}
											maxLength={20}
											placeholder={t.titlePlaceholder}
											className='w-[280px] h-[52px] px-5 pr-14 rounded-2xl border border-zinc-800 bg-zinc-950/50 text-[15px] font-bold outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-zinc-100 placeholder-zinc-600 max-sm:w-full'
										/>
										<div className='absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-500 pointer-events-none'>
											{title.length}/20
										</div>
									</div>
									<button
										className='h-[52px] px-8 rounded-2xl bg-emerald-500 text-emerald-950 font-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/10'
										onClick={handleSave}
									>
										{mode === 'edit' ? t.saveEdit : t.save}
									</button>
									<button
										className='h-[52px] px-6 rounded-2xl bg-zinc-800 text-zinc-100 font-bold border border-zinc-700/50 hover:bg-zinc-700 transition-all'
										onClick={() => router.push('/closet')}
									>
										{t.goBack}
									</button>
								</div>
							</div>
						</div>

						<div className='grid grid-cols-[minmax(0,1.22fr)_minmax(360px,0.78fr)] gap-6 items-start max-[1300px]:grid-cols-1'>
							<div className='bg-zinc-900 border border-zinc-800 rounded-[20px] p-5'>
								<p className='mb-6 text-[22px] font-extrabold'>{t.myClothesList}</p>

								<div className='grid grid-cols-4 gap-5 max-[1440px]:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1'>
									{filteredItems.map((item) => {
										const isSelected = selectedIds.includes(item.clothesId);

										return (
											<div
												key={item.clothesId}
												className={`group border rounded-3xl bg-zinc-950 overflow-hidden transition-all duration-500 shadow-2xl relative ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-zinc-800/50 hover:border-emerald-500/30'}`}
												draggable
												onDragStart={() => setDraggingId(item.clothesId)}
												onDragEnd={() => setDraggingId(null)}
											>
												<div className='w-full aspect-3/4 bg-zinc-900 overflow-hidden relative'>
													{item.imageUrl ? (
														<img
															src={encodeURI(item.imageUrl)}
															alt={item.itemName ?? t.noName}
															className='w-full h-full object-cover transition-transform duration-700'
														/>
													) : (
														<div className='h-full flex items-center justify-center text-zinc-600 text-xs font-bold  tracking-widest'>
															No Image
														</div>
													)}
													<div className='absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
												</div>

												<div className='p-4 relative'>
													<div className='text-base font-black text-zinc-100 truncate mb-2 tracking-tight'>
														{item.itemName ?? t.noName}
													</div>
													<div className='flex gap-2 flex-wrap mb-4'>
														<span className='text-sm font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800/50  tracking-tighter'>
															{item.category?.categoryId
																? (t[
																		`category${item.category.categoryId as 1 | 2 | 3 | 4 | 5}` as keyof typeof t
																	] as string)
																: (item.category?.name ?? t.selectCategory)}
														</span>
														{item.season ? (
															<span className='text-sm font-bold text-emerald-500/70 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10  tracking-tighter'>
																{
																	dictionaries[currentLang].closetPageComponent[
																		SEASON_MAP[item.season as Season]
																	]
																}
															</span>
														) : null}
													</div>

													<button
														type='button'
														className={`w-full h-10 rounded-xl font-black text-sm tracking-tight transition-all duration-300 ${isSelected ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'bg-zinc-900 text-zinc-100 hover:bg-emerald-500 hover:text-emerald-950 border border-zinc-800 group-hover:border-emerald-500/30'}`}
														onClick={() => handleSelect(item)}
													>
														{isSelected ? t.selected : t.select}
													</button>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							<div className='bg-zinc-900 border border-zinc-800 rounded-[20px] p-5 sticky top-6 max-[1300px]:static'>
								<p className='mb-[14px] text-[22px] font-extrabold'>{t.viewPreset}</p>

								<div className="grid grid-cols-2 gap-[14px] [grid-template-areas:'topLeft_topRight'_'middleLeft_middleRight'_'bottomLeft_.'] max-md:grid-cols-1 max-md:[grid-template-areas:'topLeft'_'topRight'_'middleLeft'_'middleRight'_'bottomLeft']">
									<div className='[grid-area:topLeft]'>{renderSlot(1)}</div>
									<div className='[grid-area:topRight]'>{renderSlot(3)}</div>
									<div className='[grid-area:middleLeft]'>{renderSlot(2)}</div>
									<div className='[grid-area:middleRight]'>{renderSlot(5)}</div>
									<div className='[grid-area:bottomLeft]'>{renderSlot(4)}</div>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
