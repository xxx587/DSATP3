'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getMyClothes, deleteClothes } from '@/app/api/closet';
import { getCategories } from '@/app/api/category';
import { getMyPresets, deletePreset } from '@/app/api/preset';
import type { ClothesResponseDto, CategoryDto } from '@/types/closet';
import type { PresetResponseDto } from '@/types/preset';
import type { WeatherData } from '@/types/weather';
import ClosetGrid from '@/components/closet/ClosetGrid';
import { toast } from 'sonner';
import { Search, SquarePen, Plus, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
import { ClosetPageComponentLang } from '@/types/languague/lang';

// 로컬 타입 및 상수 정의
export type Season = '봄' | '여름' | '가을' | '겨울';
export const SEASONS_KEYS: (keyof Pick<ClosetPageComponentLang, 'spring' | 'summer' | 'autumn' | 'winter'>)[] = [
	'spring',
	'summer',
	'autumn',
	'winter',
];
const SEASON_MAP: Record<Season, keyof ClosetPageComponentLang> = {
	봄: 'spring',
	여름: 'summer',
	가을: 'autumn',
	겨울: 'winter',
};

/**
 * @description 현재 기온에 따른 코디 추천 규칙을 결정하기 위한 함수
 * 기온 구간별로 적절한 레이블, 설명, 대상 계절 및 카테고리를 처리하기 위한 로직을 포함
 * @param {number} temp - 현재 기온 수치
 * @param {ClosetPageComponentLang} dict - 다국어 사전 데이터
 * @return {object} 추천 규칙 객체 (레이블, 설명, 계절 리스트, 카테고리 리스트)
 */
const getRecommendationRule = (temp: number, dict: ClosetPageComponentLang) => {
	if (temp <= 4)
		return {
			label: dict.veryCold,
			description: dict.veryColdDesc,
			targetSeasons: ['겨울'],
			categories: ['아우터', '상의', '하의', '신발'],
		};
	if (temp <= 11)
		return {
			label: dict.chilly,
			description: dict.chillyDesc,
			targetSeasons: ['가을', '겨울'],
			categories: ['아우터', '상의', '하의', '신발'],
		};
	if (temp <= 19)
		return {
			label: dict.cool,
			description: dict.coolDesc,
			targetSeasons: ['봄', '가을'],
			categories: ['상의', '하의', '신발'],
		};
	if (temp <= 27)
		return {
			label: dict.warm,
			description: dict.warmDesc,
			targetSeasons: ['여름', '봄'],
			categories: ['상의', '하의', '신발'],
		};
	return {
		label: dict.veryHot,
		description: dict.veryHotDesc,
		targetSeasons: ['여름'],
		categories: ['상의', '하의', '신발'],
	};
};

/**
 * @description 전체 아이템 목록에서 현재 날씨에 적합한 아이템을 선정하기 위한 함수
 * 설정된 규칙에 따라 각 카테고리별로 가장 적합한 아이템을 추출하여 처리하기 위한 로직을 포함
 * @param {ClothesResponseDto[]} items - 전체 옷장 아이템 목록
 * @param {number} temp - 현재 기온
 * @param {ClosetPageComponentLang} dict - 다국어 사전 데이터
 * @return {object} 적용된 규칙과 선정된 아이템 목록을 포함한 객체
 */
const pickRecommendedItems = (items: ClothesResponseDto[], temp: number, dict: ClosetPageComponentLang) => {
	const rule = getRecommendationRule(temp, dict);

	const selected = rule.categories
		.map((categoryName) => {
			const seasonFirst = items.find(
				(item) =>
					item.category?.name === categoryName &&
					item.season != null &&
					rule.targetSeasons.includes(item.season as Season),
			);

			const fallback = items.find((item) => item.category?.name === categoryName);
			return seasonFirst ?? fallback ?? null;
		})
		.filter((item): item is ClothesResponseDto => item != null);

	return { rule, selected };
};

/**
 * @description 옷장 관리 페이지 컴포넌트. 사용자의 옷 아이템 및 프리셋을 필터링하고 관리하기 위한 전체 기능을 처리하기 위한 컴포넌트
 * @return {TSX.Element} 옷장 관리 UI 구조
 */
export default function ClosetPage() {
	const router = useRouter();
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].closetPageComponent;

	const [categories, setCategories] = useState<CategoryDto[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
	const [q, setQ] = useState('');
	const [items, setItems] = useState<ClothesResponseDto[]>([]);
	const [presets, setPresets] = useState<PresetResponseDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [weatherLoading, setWeatherLoading] = useState(true);

	const [seasonFilter, setSeasonFilter] = useState<Record<Season, boolean>>({
		봄: false,
		여름: false,
		가을: false,
		겨울: false,
	});

	useEffect(() => {
		/**
		 * @description 초기 화면 렌더링 시 필요한 옷, 카테고리, 프리셋 데이터를 서버에서 한꺼번에 가져오기 위한 비동기 함수
		 * API 응답을 기다린 후 각각의 상태 값에 할당하여 UI를 업데이트하기 위한 로직을 포함
		 */
		const fetchData = async () => {
			try {
				const [clothesData, categoriesData, presetsData] = await Promise.all([
					getMyClothes(),
					getCategories(),
					getMyPresets(),
				]);
				setItems(clothesData);
				setCategories(categoriesData);
				setPresets(presetsData);
			} catch (error) {
				console.error(error);
				toast.error(dict.dataLoadError);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [dict]);

	useEffect(() => {
		/**
		 * @description 사용자의 현재 위치 기반 날씨 정보를 가져오기 위한 비동기 함수
		 * 서버 API를 호출하여 기온 및 날씨 상태를 받아와 추천 시스템에 활용하기 위한 로직을 포함
		 */
		const fetchWeather = async () => {
			try {
				const { data } = await axios.get<WeatherData>('/api/weather');
				if (!data || typeof data.main?.temp !== 'number') return;
				setWeather(data);
			} catch (error) {
				console.error(error);
			} finally {
				setWeatherLoading(false);
			}
		};

		fetchWeather();
	}, []);

	const selectedSeasons = useMemo(
		() => (Object.keys(SEASON_MAP) as Season[]).filter((s: Season) => seasonFilter[s]),
		[seasonFilter],
	);

	const filteredItems = useMemo(() => {
		const qq = q.trim().toLowerCase();

		return items.filter((it) => {
			const matchCategory = selectedCategoryId == null || it.category?.id === selectedCategoryId;
			const matchQuery =
				qq.length === 0 ||
				(it.itemName ?? dict.item).toLowerCase().includes(qq) ||
				(it.category?.name ?? '').toLowerCase().includes(qq);
			const matchSeason =
				selectedSeasons.length === 0 || (it.season != null && selectedSeasons.includes(it.season as Season));

			return matchCategory && matchQuery && matchSeason;
		});
	}, [items, q, selectedCategoryId, selectedSeasons, dict]);

	const recommendation = useMemo(() => {
		if (!weather) return null;
		return pickRecommendedItems(items, weather.main.temp, dict);
	}, [items, weather, dict]);

	/**
	 * @description 특정 계절 필터를 토글하여 검색 조건에 반영하기 위한 함수
	 * @param {Season} s - 토글할 계절 명칭 (봄, 여름, 가을, 겨울)
	 */
	const toggleSeason = (s: Season) => {
		setSeasonFilter((prev) => ({ ...prev, [s]: !prev[s] }));
	};

	/**
	 * @description 특정 옷 아이템의 정보를 수정하기 위해 수정 페이지로 이동하기 위한 함수
	 * @param {number} id - 수정할 아이템의 고유 ID
	 */
	const onEdit = (id: number) => {
		router.push(`/closet/edit/${id}`);
	};

	/**
	 * @description 특정 옷 아이템을 영구적으로 삭제하기 위한 비동기 함수
	 * 사용자 확인 후 API를 호출하고 로컬 상태를 동기화하여 화면을 갱신하기 위한 로직을 포함
	 * @param {number} id - 삭제할 아이템의 고유 ID
	 */
	const onDelete = async (id: number) => {
		const ok = confirm(dict.deleteConfirm);
		if (!ok) return;

		try {
			await deleteClothes(id);
			setItems((prev) => prev.filter((item) => item.id !== id));
		} catch (error) {
			console.error(error);
			toast.error(dict.deleteError);
		}
	};

	/**
	 * @description 기존 프리셋을 삭제하기 위한 비동기 함수
	 * 사용자 확인 절차를 거쳐 API 요청을 처리하고, 성공 시 목록에서 제거하기 위한 로직을 포함
	 * @param {number} presetId - 삭제할 프리셋의 고유 ID
	 */
	const onPresetDelete = async (presetId: number) => {
		if (!confirm(dict.presetDeleteConfirm)) return;

		try {
			await deletePreset(presetId);
			setPresets((prev) => prev.filter((p) => p.presetId !== presetId));
		} catch (error) {
			console.error(error);
			toast.error(dict.presetDeleteFail);
		}
	};

	/**
	 * @description 기존 프리셋을 수정하기 위해 프리셋 편집 페이지로 이동하기 위한 함수
	 * @param {number} presetId - 수정할 프리셋의 고유 ID
	 */
	const onPresetEdit = (presetId: number) => {
		router.push(`/preset/edit/${presetId}`);
	};

	return (
		<div className='w-full bg-zinc-950 min-h-screen'>
			<div className='p-5'>
				<div className='flex gap-8 mt-4 overflow-hidden'>
					<aside className='bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 w-80 shrink-0 shadow-2xl h-fit z-20'>
						<div className='mb-8'>
							<p className='text-sm font-black text-zinc-500  tracking-[0.2em] mb-4'>{dict.category}</p>
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
									<span className='text-sm font-black'>{dict.viewAll}</span>
								</label>

								{categories.map((c) => (
									<label
										key={c.id}
										className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedCategoryId === c.id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-400 hover:border-zinc-700'}`}
									>
										<input
											type='radio'
											name='cat'
											className='hidden'
											checked={selectedCategoryId === c.id}
											onChange={() => setSelectedCategoryId(c.id)}
										/>
										<span className='text-sm font-black'>
											{dictionaries[currentLang].presetClothesCommonDict[
												`category${c.id as 1 | 2 | 3 | 4 | 5}` as keyof (typeof dictionaries)[typeof currentLang]['presetClothesCommonDict']
											] ?? c.name}
										</span>
									</label>
								))}
							</div>
						</div>

						<div className='mb-8'>
							<p className='text-sm font-black text-zinc-500  tracking-[0.2em] mb-4'>{dict.season}</p>
							<div className='grid grid-cols-2 gap-2'>
								{(Object.keys(SEASON_MAP) as Season[]).map((s) => (
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
										{dict[SEASON_MAP[s]]}
									</label>
								))}
							</div>
						</div>

						<div>
							<p className='text-sm font-black text-zinc-500  tracking-[0.2em] mb-4'>
								{dict.savedPresets}
							</p>
							{presets.length === 0 ? (
								<div className='text-sm font-bold text-zinc-600 bg-zinc-950/30 p-4 rounded-2xl border border-dashed border-zinc-800/50 text-center leading-relaxed'>
									{dict.noPresets}
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
													className='text-[10px] font-black tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors '
													onClick={() => onPresetEdit(preset.presetId)}
												>
													{dict.edit}
												</button>
												<button
													type='button'
													className='text-[10px] font-black tracking-widest text-zinc-500 hover:text-red-400 transition-colors '
													onClick={() => onPresetDelete(preset.presetId)}
												>
													{dict.delete}
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</aside>

					<main className='flex-1'>
						<div className='bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden group'>
							<div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -z-10 rounded-full group-hover:bg-emerald-500/10 transition-colors duration-700' />

							<div className='relative z-10'>
								<p className='text-3xl font-black text-zinc-100 tracking-tight mb-2'>{dict.myCloset}</p>
								<p className='text-zinc-500 font-medium mb-8'>{dict.closetDesc}</p>

								<div className='flex justify-between items-center gap-4 flex-wrap'>
									<div className='relative flex-1'>
										<input
											value={q}
											onChange={(e) => setQ(e.target.value)}
											placeholder={dict.searchPlaceholder}
											className='w-full h-12 pl-12 pr-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-bold text-zinc-100 placeholder-zinc-600'
										/>
										<Search
											className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500'
											strokeWidth={3}
										/>
									</div>

									<div className='flex gap-3'>
										<Link
											href='/preset/add'
											className='flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-800 text-zinc-100 font-bold border border-zinc-700/50 hover:bg-zinc-700 transition-all text-sm shadow-lg'
										>
											<SquarePen size={18} strokeWidth={2.5} />
											{dict.addPreset}
										</Link>
										<Link
											href='/closet/add'
											className='flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 text-sm'
										>
											<Plus size={18} strokeWidth={3} />
											{dict.addCloth}
										</Link>
									</div>
								</div>
							</div>
						</div>

						<section className='bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden group'>
							<div className='absolute inset-0 bg-linear-to-br from-indigo-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

							<div className='flex justify-between items-start mb-6 relative z-10'>
								<div>
									<p className='text-lg font-black text-zinc-100 mb-1 tracking-tight flex items-center gap-2'>
										<span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
										{dict.todayRecommendation}
									</p>
									{weatherLoading ? (
										<div className='h-4 w-48 bg-zinc-800 animate-pulse rounded-md mt-2' />
									) : weather ? (
										<p className='text-sm font-bold text-zinc-500  tracking-wider'>
											{weather.name} {Math.round(weather.main.temp)}°C ·{' '}
											{recommendation?.rule.label}
										</p>
									) : (
										<p className='text-sm font-bold text-red-500/70'>{dict.weatherLoadError}</p>
									)}
								</div>
								{recommendation ? (
									<div className='bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full border border-emerald-500/20 text-sm font-black tracking-widest'>
										{recommendation.rule.description}
									</div>
								) : null}
							</div>

							<div className='relative z-10'>
								{recommendation && recommendation.selected.length > 0 ? (
									<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
										{recommendation.selected.map((item) => (
											<div
												key={`recommend-${item.id}`}
												className='group/item border border-zinc-800/50 rounded-2xl overflow-hidden bg-zinc-950/50 hover:border-emerald-500/30 transition-all duration-300'
											>
												<div className='bg-zinc-900 overflow-hidden flex items-center justify-center aspect-3/4 relative'>
													{item.imageUrl ? (
														<img
															className='w-full h-full object-cover opacity-100'
															src={encodeURI(item.imageUrl)}
															alt={item.itemName ?? dict.recommendedCloth}
														/>
													) : (
														<div className='text-[10px] font-black text-zinc-700 '>
															No Image
														</div>
													)}
													<div className='absolute inset-0 bg-linear-to-t from-zinc-950/50 to-transparent' />
												</div>
												<div className='p-2.5 bg-zinc-950/50'>
													<div className='font-bold text-base mb-1.5 truncate text-zinc-200 tracking-tight'>
														{item.itemName ?? dict.item}
													</div>
													<div className='flex gap-1 flex-wrap'>
														<span className='text-sm font-black bg-zinc-800/80 border border-zinc-700/50 text-zinc-500 px-1.5 py-0.5 rounded '>
															{item.category?.id
																? dictionaries[currentLang].presetClothesCommonDict[
																		`category${item.category.id as 1 | 2 | 3 | 4 | 5}` as keyof (typeof dictionaries)[typeof currentLang]['presetClothesCommonDict']
																	]
																: (item.category?.name ?? 'CAT')}
														</span>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									!weatherLoading && (
										<div className='text-sm font-bold text-zinc-600 bg-zinc-950/30 p-8 rounded-2xl border border-dashed border-zinc-800/50 text-center'>
											{dict.noRecommendation}
										</div>
									)
								)}
							</div>
						</section>

						{loading ? (
							<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
								{Array.from({ length: 8 }).map((_, i) => (
									<div
										key={i}
										className='h-72 rounded-3xl bg-zinc-900 border border-zinc-800/50 animate-pulse'
									/>
								))}
							</div>
						) : filteredItems.length === 0 ? (
							<div className='h-64 flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800/50 rounded-3xl text-zinc-600 font-bold'>
								<MessageSquare className='w-12 h-12 mb-4 opacity-20' />
								{dict.noMatchingCloth}
							</div>
						) : (
							<ClosetGrid items={filteredItems} mode='manage' onEdit={onEdit} onDelete={onDelete} />
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
