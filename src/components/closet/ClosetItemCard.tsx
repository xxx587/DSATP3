/**
 * @file ClosetItemCard.tsx
 * @description 옷장 내 개별 의류 아이템을 카드로 표시하는 컴포넌트
 * 아이템 이미지, 이름, 카테고리, 계절 정보를 보여주며 수정/삭제/선택 기능을 제공
 */

'use client';

import type { ClothesResponseDto } from '@/types/closet';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
import { ClosetPageComponentLang } from '@/types/languague/lang';

type Season = '봄' | '여름' | '가을' | '겨울';
const SEASON_MAP: Record<Season, keyof ClosetPageComponentLang> = {
	봄: 'spring',
	여름: 'summer',
	가을: 'autumn',
	겨울: 'winter',
};

/**
 * @description ClosetItemCard 컴포넌트의 Props 인터페이스
 * @property {ClothesResponseDto} item - 카드에 상세 정보를 표시할 대상 옷 아이템 원본 데이터 객체
 * @property {'manage' | 'select'} [mode] - 카드가 동작할 컨텍스트 모드 ('manage': 관리 및 메뉴 노출, 'select': 단순 선택 및 체크 표시)
 * @property {boolean} [selected] - 선택 모드 시 해당 아이템이 현재 체크되었는지 여부를 시각적으로 처리하기 위한 상태 값
 * @property {(id: number) => void} [onEdit] - 아이템 수정 기능을 트리거하기 위해 부모의 핸들러를 호출하기 위한 함수
 * @property {(id: number) => void} [onDelete] - 아이템 삭제 기능을 트리거하기 위해 부모의 핸들러를 호출하기 위한 함수
 * @property {(item: ClothesResponseDto) => void} [onSelect] - 아이템 선택 시 해당 객체 정보를 부모 상태로 전달하기 위한 콜백 함수
 */
type Props = {
	item: ClothesResponseDto;
	mode?: 'manage' | 'select';
	selected?: boolean;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
	onSelect?: (item: ClothesResponseDto) => void;
};

/**
 * @description 단일 의류 아이템 정보를 카드 형태로 렌더링하는 컴포넌트
 * @param {Props} props - 아이템 데이터 및 각 액션 핸들러
 * @return {TSX.Element} 의류 아이템 카드 UI
 */
export default function ClosetItemCard({ item, mode = 'manage', selected = false, onEdit, onDelete, onSelect }: Props) {
	/**
	 * useLanguage: 현재 언어 설정에 맞게 계절 명칭이나 버튼 텍스트를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].closetItemCardComponent;
	const mainDict = dictionaries[currentLang].closetPageComponent;

	const localizedSeason = item.season ? mainDict[SEASON_MAP[item.season as Season]] : null;
	return (
		<div
			className={`group border rounded-[32px] overflow-hidden transition-all duration-500 bg-zinc-950 shadow-2xl relative ${
				selected
					? 'border-emerald-500 ring-4 ring-emerald-500/10'
					: 'border-zinc-800/50 hover:border-emerald-500/30'
			}`}
		>
			<div className='relative w-full aspect-3/4 bg-zinc-900 flex items-center justify-center overflow-hidden'>
				{item.imageUrl ? (
					<img
						src={encodeURI(item.imageUrl)}
						alt={item.itemName ?? dict.item}
						className='w-full h-full object-cover opacity-100'
						onError={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
				) : (
					<div className='text-[10px] font-black text-zinc-600  tracking-widest'>{dict.noImage}</div>
				)}
				<div className='absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300' />
			</div>

			<div className='p-4 relative'>
				<div className='font-black text-zinc-100 text-base leading-tight mb-3 truncate tracking-tight group-hover:text-emerald-400 transition-colors'>
					{item.itemName ?? dict.noName}
				</div>
				<div className='flex gap-1.5 flex-wrap mb-4'>
					<span className='text-sm font-black bg-zinc-900 px-2 py-0.5 rounded-md text-zinc-500 border border-zinc-800  tracking-tighter'>
						{item.category?.id
							? dictionaries[currentLang].presetClothesCommonDict[
									`category${item.category.id as 1 | 2 | 3 | 4 | 5}` as keyof (typeof dictionaries)[typeof currentLang]['presetClothesCommonDict']
								]
							: (item.category?.name ?? 'CAT')}
					</span>
					{item.season && (
						<span className='text-sm font-black bg-emerald-500/5 px-2 py-0.5 rounded-md text-emerald-500/70 border border-emerald-500/10  tracking-tighter'>
							{localizedSeason}
						</span>
					)}
				</div>

				{/* 관리 모드 */}
				{mode === 'manage' && (
					<div className='flex justify-between items-center gap-3'>
						<button
							className='flex-1 py-2 text-sm font-black text-zinc-500 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/30 rounded-xl transition-all  tracking-widest'
							onClick={() => onEdit?.(item.id)}
						>
							{dict.edit}
						</button>
						<button
							className='flex-1 py-2 text-sm font-black text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 rounded-xl transition-all  tracking-widest'
							onClick={() => onDelete?.(item.id)}
						>
							{dict.delete}
						</button>
					</div>
				)}

				{/* 선택 모드 (프리셋용) */}
				{mode === 'select' && (
					<button
						className={`w-full py-2.5 text-[11px] font-black rounded-xl transition-all  tracking-widest ${
							selected
								? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20'
								: 'bg-zinc-900 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/30'
						}`}
						onClick={() => onSelect?.(item)}
					>
						{selected ? dict.selected : dict.select}
					</button>
				)}
			</div>
		</div>
	);
}
