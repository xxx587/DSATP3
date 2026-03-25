'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getClothesDetail as getClosetItem, updateClothes as updateClosetItem } from '@/app/api/closet';
import { getCategories } from '@/app/api/category';
import type { CategoryDto } from '@/types/closet';
import { toast } from 'sonner';
import { Upload, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
import { ClosetPageComponentLang } from '@/types/languague/lang';

// 로컬 타입 및 상수 정의
export type Season = '봄' | '여름' | '가을' | '겨울';
const SEASON_MAP: Record<Season, keyof ClosetPageComponentLang> = {
	봄: 'spring',
	여름: 'summer',
	가을: 'autumn',
	겨울: 'winter',
};
const SEASONS: Season[] = ['봄', '여름', '가을', '겨울'];

export default function ClosetEditPage() {
	const router = useRouter();
	const params = useParams();
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].closetFormComponent;
	const mainDict = dictionaries[currentLang].closetPageComponent;
	const clothesId = Number(params.id);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [itemName, setItemName] = useState('');
	const [categoryId, setCategoryId] = useState<number | ''>('');
	const [season, setSeason] = useState<Season | ''>('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [existingImageUrl, setExistingImageUrl] = useState('');
	const [isDragging, setIsDragging] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<CategoryDto[]>([]);

	const previewUrl = useMemo(() => {
		if (imageFile) return URL.createObjectURL(imageFile);
		return existingImageUrl;
	}, [imageFile, existingImageUrl]);

	useEffect(() => {
		const initData = async () => {
			try {
				const [item, categoriesData] = await Promise.all([getClosetItem(clothesId), getCategories()]);
				setCategories(categoriesData);

				setItemName(item.itemName ?? '');
				setCategoryId(item.category?.id ?? '');
				setSeason((item.season as Season) ?? '');
				setExistingImageUrl(item.imageUrl ?? '');
			} catch (error) {
				console.error(error);
				toast.error(dict.loadError);
				router.push('/closet');
			} finally {
				setLoading(false);
			}
		};

		if (!Number.isNaN(clothesId)) {
			initData();
		}
	}, [clothesId, router, dict]);

	const handleFileChange = (file: File | null) => {
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			toast.error(dict.imageOnlyError);
			return;
		}

		setImageFile(file);
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0] ?? null;
		handleFileChange(file);
	};

	const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const onDragLeave = () => setIsDragging(false);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!itemName.trim()) {
			toast.info(dict.itemNamePlaceholder);
			return;
		}

		if (!imageFile && !existingImageUrl) {
			toast.info(dict.allFieldsRequired);
			return;
		}

		if (!categoryId) {
			toast.info(dict.categorySelect);
			return;
		}

		if (!season) {
			toast.info(dict.seasonSelect);
			return;
		}

		setSubmitting(true);

		const formData = new FormData();
		formData.append('itemName', itemName.trim());
		formData.append('season', season);
		formData.append('categoryId', categoryId.toString());
		if (imageFile) {
			formData.append('image', imageFile);
		}

		try {
			const response = await updateClosetItem(clothesId, formData);
			toast.success(dict.editSuccess);
			router.push('/closet');
		} catch (error) {
			console.error(error);
			toast.error(dict.editError);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return <div className='max-w-[760px] mx-auto py-8 px-5'>{dict.loading}</div>;
	}

	return (
		<div className='min-h-screen bg-zinc-950 pt-24 pb-20 px-5'>
			<div className='max-w-2xl mx-auto'>
				<div className='bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group'>
					{/* 배경 장식 */}
					<div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -z-10 rounded-full group-hover:bg-emerald-500/10 transition-colors duration-700' />

					<div className='relative z-10'>
						<div className='mb-10'>
							<p className='text-3xl font-black text-zinc-100 tracking-tight mb-2'>{dict.editTitle}</p>
							<p className='text-zinc-500 font-medium'>{dict.editDesc}</p>
						</div>

						<form onSubmit={onSubmit} className='space-y-8'>
							<div className='space-y-6'>
								<div className='space-y-2.5'>
									<label className='text-base font-black text-zinc-500  tracking-widest pl-1'>
										{dict.itemName}
									</label>
									<input
										className='w-full h-14 px-5 rounded-2xl bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-[15px] font-bold text-zinc-100 placeholder-zinc-700 mt-3'
										value={itemName}
										onChange={(e) => setItemName(e.target.value)}
										placeholder={dict.itemNamePlaceholder}
									/>
								</div>

								<div className='space-y-2.5'>
									<label className='text-base font-black text-zinc-500  tracking-widest pl-1'>
										{dict.imageEdit}
									</label>
									<div
										className={`group/drop relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-500 mt-3 ${
											isDragging
												? 'border-emerald-500 bg-emerald-500/5 scale-[0.99]'
												: 'border-zinc-800 bg-zinc-950/30 hover:border-zinc-700 hover:bg-zinc-900/30'
										}`}
										onDragOver={onDragOver}
										onDragLeave={onDragLeave}
										onDrop={onDrop}
									>
										<input
											ref={fileInputRef}
											type='file'
											accept='image/*'
											className='hidden'
											onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
										/>

										<div className='flex flex-col items-center gap-4'>
											<div
												className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isDragging ? 'bg-emerald-500 text-emerald-950 rotate-180' : 'bg-zinc-900 text-zinc-500 group-drop:text-emerald-500 group-hover/drop:bg-emerald-500/10'}`}
											>
												<Upload size={28} strokeWidth={2.5} />
											</div>
											<div>
												<div className='text-[15px] font-black text-zinc-200 mb-1'>
													{dict.imageGuide}
												</div>
												<p className='text-sm font-bold text-zinc-500  tracking-tight'>
													{dict.imageSizeGuide}
												</p>
											</div>
											<button
												type='button'
												className='h-11 px-6 rounded-xl bg-zinc-800 text-zinc-100 font-bold hover:bg-zinc-700 transition-all text-sm'
												onClick={() => fileInputRef.current?.click()}
											>
												{dict.selectFile}
											</button>
										</div>
									</div>

									{previewUrl && (
										<div className='mt-6 animate-fade-in'>
											<div className='relative aspect-3/4 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl'>
												<img
													src={encodeURI(previewUrl)}
													alt={dict.preview}
													className='w-full h-full object-cover'
												/>
												<div className='absolute inset-0 bg-linear-to-t from-zinc-950/60 to-transparent' />
												<div className='absolute bottom-4 left-6'>
													<span className='px-3 py-1 bg-emerald-500 text-emerald-950 text-sm font-black  tracking-widest rounded-full shadow-lg'>
														{dict.preview}
													</span>
												</div>
											</div>
										</div>
									)}
								</div>

								<div className='grid grid-cols-2 gap-6'>
									<div className='space-y-2.5'>
										<label className='text-base font-black text-zinc-500  tracking-widest pl-1'>
											{dict.category}
										</label>
										<div className='relative mt-3'>
											<select
												className='w-full h-14 px-5 rounded-2xl bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 outline-none transition-all text-[15px] font-bold text-zinc-100 appearance-none'
												value={categoryId}
												onChange={(e) => {
													const value = e.target.value;
													setCategoryId(value === '' ? '' : Number(value));
												}}
											>
												<option value=''>{dict.categorySelect}</option>
												{categories.map((c) => (
													<option key={c.id} value={c.id}>
														{dictionaries[currentLang].presetClothesCommonDict[
															`category${c.id as 1 | 2 | 3 | 4 | 5}` as keyof (typeof dictionaries)[typeof currentLang]['presetClothesCommonDict']
														] ?? c.name}
													</option>
												))}
											</select>
											<div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500'>
												<ChevronDown size={16} strokeWidth={3} />
											</div>
										</div>
									</div>

									<div className='space-y-2.5'>
										<label className='text-base font-black text-zinc-500  tracking-widest pl-1'>
											{dict.season}
										</label>
										<div className='relative mt-3'>
											<select
												className='w-full h-14 px-5 rounded-2xl bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 outline-none transition-all text-[15px] font-bold text-zinc-100 appearance-none'
												value={season}
												onChange={(e) => setSeason(e.target.value as Season | '')}
											>
												<option value=''>{dict.seasonSelect}</option>
												{SEASONS.map((s) => (
													<option key={s} value={s}>
														{mainDict[SEASON_MAP[s]]}
													</option>
												))}
											</select>
											<div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500'>
												<ChevronDown size={16} strokeWidth={3} />
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='flex gap-4 pt-4'>
								<button
									type='button'
									className='flex-1 h-14 rounded-2xl bg-zinc-800 text-zinc-100 font-bold border border-zinc-700/50 hover:bg-zinc-700 transition-all shadow-lg active:scale-95'
									onClick={() => router.push('/closet')}
								>
									{dict.cancel}
								</button>
								<button
									type='submit'
									className='flex-2 h-14 rounded-2xl bg-emerald-500 text-emerald-950 font-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:hover:scale-100'
									disabled={submitting}
								>
									{submitting ? dict.submittingEdit : dict.submitEdit}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
