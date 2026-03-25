/**
 * @file OrderByWrite.tsx
 * @description 게시글 정렬 및 글쓰기 버튼 컴포넌트
 * 게시글 목록 상단에 위치하며 '최신순'/'좋아요순' 정렬 옵션과 '글쓰기' 버튼을 제공
 * 글쓰기 버튼 클릭 시 로그인 상태를 확인하고, WriteContent 작성 모달을 표시
 */

'use client';

import { useState, useCallback } from 'react';
import { PencilLine } from 'lucide-react';
import WriteContent from './WriteContent';
import useRequireAuth from '@/hooks/useRequireAuth';
import BoardSearch from './BoardSearch';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description OrderbyWrite 컴포넌트의 Props 인터페이스
 * @property {'recent' | 'like'} currentOrder - 현재 게시글 목록에 적용된 정렬 방식 상태 값
 * @property {(order: 'recent' | 'like') => void} onOrderChange - 정렬 탭 클릭 시 부모의 정렬 상태를 변경하기 위한 콜백 함수
 * @property {(keyword: string) => void} onSearchChange - 검색어 입력 시 검색 필터를 적용하기 위한 콜백 함수
 * @property {() => void} [onSuccess] - 게시글 작성 완료 후 목록을 새로고침하거나 UI를 갱신하기 위한 성공 콜백 함수
 */
interface OrderByWriteProps {
	currentOrder: 'recent' | 'like';
	onOrderChange: (order: 'recent' | 'like') => void;
	onSearchChange: (keyword: string) => void;
	onSuccess?: () => void;
}

/**
 * @description 게시글 정렬 및 글쓰기 버튼 컴포넌트. 최신순/좋아요순 정렬 옵션과 글쓰기 버튼을 제공
 *              글쓰기 버튼 클릭 시 로그인 상태를 확인한 후 WriteContent 작성 모달 열기
 * @param {OrderByWriteProps} props - 컴포넌트 Props
 * @return {TSX.Element} 정렬 옵션 및 글쓰기 버튼 UI
 */
const OrderbyWrite = ({ currentOrder, onOrderChange, onSearchChange, onSuccess }: OrderByWriteProps) => {
	/**
	 * useState: 게시글 작성 모달(WriteContent)의 오픈 상태를 관리하기 위한 훅
	 */
	const [isModalOpen, setIsModalOpen] = useState(false);

	/**
	 * useRequireAuth: 글쓰기 시도 시 사용자의 로그인 상태를 확인하여 인증되지 않은 경우 로그인 페이지로 유도하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	/**
	 * useLanguage: 정렬 기준(최신순, 좋아요순) 및 글쓰기 버튼의 텍스트를 다국어로 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].orderByWriteComponent;

	/**
	 * @description 글쓰기 모달 열기 핸들러. 로그인 상태를 확인한 후 모달을 열
	 * @return {void}
	 */
	const handleOpenModal = useCallback(() => {
		if (checkAuth()) {
			setIsModalOpen(true);
		}
	}, [checkAuth]);

	/**
	 * @description 글쓰기 모달 닫기 핸들러
	 * @return {void}
	 */
	const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

	return (
		<>
			<section className='flex items-center justify-between w-full mb-8 bg-zinc-900/30 p-2 rounded-3xl border border-zinc-800/50 backdrop-blur-sm'>
				<div className='flex-1 w-auto'>
					<BoardSearch onSearchChange={onSearchChange} />
				</div>

				<div className='flex items-center justify-end gap-6 px-4'>
					<div className='flex items-center gap-4 bg-zinc-950/50 px-4 py-2 rounded-2xl border border-zinc-800/50'>
						<span
							className={`cursor-pointer transition-all duration-300 text-sm font-bold tracking-tight ${currentOrder === 'recent' ? 'text-emerald-500 underline underline-offset-8 decoration-2' : 'text-zinc-500 hover:text-zinc-300'}`}
							onClick={() => onOrderChange('recent')}
						>
							{dict.recent}
						</span>
						<div className='w-px h-3 bg-zinc-800' />
						<span
							className={`cursor-pointer transition-all duration-300 text-sm font-bold tracking-tight ${currentOrder === 'like' ? 'text-emerald-500 underline underline-offset-8 decoration-2' : 'text-zinc-500 hover:text-zinc-300'}`}
							onClick={() => onOrderChange('like')}
						>
							{dict.like}
						</span>
					</div>

					<button
						onClick={handleOpenModal}
						className='flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/10'
					>
						<PencilLine className='w-5 h-5' />
						{dict.write}
					</button>
				</div>
			</section>

			{isModalOpen && <WriteContent onClose={handleCloseModal} onSuccess={onSuccess} />}
		</>
	);
};

export default OrderbyWrite;
