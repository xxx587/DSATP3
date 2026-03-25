/**
 * @file HomeClient.tsx
 * @description 홈 페이지 클라이언트 컴포넌트
 * 서버에서 받은 초기 게시글 데이터를 기반으로 무한 스크롤 게시글 목록을 렌더링
 * 정렬 변경(최신순/좋아요순), 글쓰기 버튼, 스크롤 맨 위로 기능을 포함
 */

'use client';

import OrderbyWrite from '@/components/post/OrderByWrite';
import { useBoards } from '@/hooks/useBoards';
import { BoardListItemDto } from '@/types/board';
import HomePostGrid from './HomePostGrid';
import HomeSkeletonGrid from './HomeSkeletonGrid';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description HomeClient 컴포넌트의 Props 인터페이스
 * @property {BoardListItemDto[]} initialBoards - 서버에서 미리 가져온 초기 게시글 목록
 */
interface HomeClientProps {
	initialBoards: BoardListItemDto[];
}

/**
 * @description 홈 페이지 클라이언트 컴포넌트. useBoards 훅을 사용하여 무한 스크롤과 필터링을 관리하며
 *              UI 영역을 명확히 분리하여 렌더링함.
 * @param {HomeClientProps} props - 컴포넌트 Props
 * @return {TSX.Element} 홈 페이지 메인 UI
 */
export default function HomeClient({ initialBoards }: HomeClientProps) {
	/**
	 * useBoards: 게시글 목록 조회, 무한 스크롤, 정렬 및 키워드 검색 기능을 통합 관리하기 위한 커스텀 훅
	 * 서버에서 전달받은 초기 데이터(initialBoards)를 시작점으로 클라이언트 상태를 유지함
	 */
	const {
		boards,
		loading,
		error,
		hasMore,
		order,
		setOrder: handleSetOrder,
		setKeyword,
		lastElementRef,
		refresh,
		updateBoard,
		removeBoard,
	} = useBoards({
		pageSize: 20,
		initialData: initialBoards,
	});

	/**
	 * @description 게시글 작성 또는 수정이 성료되었을 때 호출되기 위한 성공 콜백 핸들러
	 * 수정된 데이터가 전달되면 해당 게시글을 목록에서 즉시 업데이트하고, 없으면 전체 목록을 서버에서 새로고침하기 위한 로직을 포함
	 * @param {BoardListItemDto} updatedBoard - 수정된 게시글 정보 (선택적)
	 */
	const handleSuccess = (updatedBoard?: BoardListItemDto) => {
		if (updatedBoard) {
			updateBoard(updatedBoard);
		} else {
			refresh();
		}
	};

	/**
	 * useLanguage: 홈 화면의 각종 안내 문구(검색 결과 없음, 로딩 중 등)를 다국어로 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].homeClientComponent;
	const dict1 = dictionaries[currentLang].useBoard;

	return (
		<>
			{/* 상단 정렬 및 검색, 글쓰기 바 */}
			<OrderbyWrite
				currentOrder={order}
				onOrderChange={handleSetOrder}
				onSearchChange={setKeyword}
				onSuccess={() => refresh()}
			/>

			{/* 에러 발생 시 안내 메시지 */}
			{error && <div className='text-center text-red-500 mt-6 py-4 text-3xl'>{dict1.boardLoadError}</div>}

			<div className='mt-6'>
				{/* 실제 게시글 목록 그리드 */}
				<HomePostGrid
					boards={boards}
					lastElementRef={lastElementRef}
					onSuccess={handleSuccess}
					onDelete={removeBoard}
				/>

				{/* 로딩 중일 때 표시할 스켈레톤 그리드 알림 기능 라우팅으로 인해 api재호출이 발생해 별로라서 끔 해결해서 품 */}
				{loading && <HomeSkeletonGrid />}

				{/* 데이터 소진 시 또는 결과 없을 시 안내 문구 */}
				{!hasMore && boards.length > 0 && (
					<div className='text-center text-emerald-500 mt-30 text-lg'>{dict.maxLoadPost}</div>
				)}

				{boards.length === 0 && !loading && !error && (
					<div className='text-center text-red-500 mt-30 text-3xl'>{dict.notFoundPost}</div>
				)}
			</div>
		</>
	);
}
