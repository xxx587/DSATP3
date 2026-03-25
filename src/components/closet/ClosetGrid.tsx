/**
 * @file ClosetGrid.tsx
 * @description 사용자의 옷장 아이템들을 그리드 형태로 나열하여 보여주는 컴포넌트
 * 관리 모드(수정/삭제)와 선택 모드(프리셋 생성용)를 지원함
 */

'use client';

import type { ClothesResponseDto } from '@/types/closet';
import ClosetItemCard from './ClosetItemCard';

/**
 * @description ClosetGrid 컴포넌트의 Props 인터페이스
 * @property {ClothesResponseDto[]} items - 표시할 옷 아이템 배열
 * @property {'manage' | 'select'} mode - 동작 모드 (관리용 또는 선택용)
 * @property {number[]} selectedIds - 선택 모드에서 현재 선택된 아이템의 ID 목록
 * @property {(id: number) => void} onEdit - 수정 버튼 클릭 시 콜백
 * @property {(id: number) => void} onDelete - 삭제 버튼 클릭 시 콜백
 * @property {(item: ClothesResponseDto) => void} onSelect - 아이템 선택 시 콜백
 */
/**
 * @description ClosetGrid 컴포넌트의 Props 인터페이스
 * @property {ClothesResponseDto[]} items - 그리드 레이아웃에 배치할 전체 옷 아이템 데이터 배열
 * @property {'manage' | 'select'} [mode] - 카드의 표시 형태 및 기능을 결정하는 모드 ('manage': 관리용, 'select': 프리셋 조합용)
 * @property {number[]} [selectedIds] - 선택 모드 시 현재 활성화된 아이템들의 ID 목록으로 체크 상태 표시를 처리하기 위함
 * @property {(id: number) => void} [onEdit] - 개별 아이템의 정보 수정을 요청하기 위해 호출될 이벤트 콜백 함수
 * @property {(id: number) => void} [onDelete] - 특정 아이템을 옷장에서 완전히 제거하기 위해 호출될 이벤트 콜백 함수
 * @property {(item: ClothesResponseDto) => void} [onSelect] - 프리셋 조합을 위해 특정 아이템을 선택했을 때 정보를 전달하기 위한 콜백 함수
 */
type Props = {
	items: ClothesResponseDto[];
	mode?: 'manage' | 'select';
	selectedIds?: number[];
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
	onSelect?: (item: ClothesResponseDto) => void;
};

/**
 * @description 옷장 아이템 목록을 그리드 레이아웃으로 렌더링하는 컴포넌트
 * @param {Props} props - 컴포넌트 Props
 * @return {TSX.Element} 옷장 그리드 UI
 */
export default function ClosetGrid({ items, mode = 'manage', selectedIds = [], onEdit, onDelete, onSelect }: Props) {
	return (
		<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
			{items.map((it) => (
				<ClosetItemCard
					key={it.id}
					item={it}
					mode={mode}
					selected={selectedIds.includes(it.id)}
					onEdit={onEdit}
					onDelete={onDelete}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
}
