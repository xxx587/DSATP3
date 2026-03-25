/**
 * @file WriteContent.tsx
 * @description 게시글 작성/수정 모달 컴포넌트
 * 좌측에 이미지 업로드 영역, 우측에 제목(최대 40자)과 내용 입력 영역을 포함
 * boardId가 있으면 수정 모드, 없으면 새 글 작성 모드로 동작
 * FormData 형태로 이미지와 텍스트를 함께 서버에 전송
 */

'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { BoardListItemDto } from '@/types/board';
import WriteContentHeader from './WriteContentHeader';
import WriteContentImageArea from './WriteContentImageArea';
import WriteContentFormArea from './WriteContentFormArea';
import { useWriteBoard } from '@/hooks/useWriteBoard';
import { useMounted } from '@/hooks/useMounted';

/**
 * @description WriteContent 컴포넌트의 Props 인터페이스
 */
/**
 * @description WriteContent 컴포넌트의 Props 인터페이스
 * @property {() => void} onClose - 모달 창을 닫기 위한 이벤트 핸들러 함수
 * @property {(data?: BoardListItemDto) => void} onSuccess - 작성 또는 수정 작업이 성공적으로 완료되었을 때 호출되기 위한 콜백 함수
 * @property {string} initialCaption - 수정 모드 시 폼에 미리 채워넣을 초기 본문 내용
 * @property {string | null} initialImage - 수정 모드 시 미리보기 영역에 표시할 초기 이미지 URL
 * @property {number | null} initialPresetId - 게시글과 연동된 초기 코디 프리셋의 고유 식별자 ID
 * @property {number} boardId - 게시글 수정 시 대상이 되는 게시글의 고유 식별자 ID (이 값이 없으면 신규 작성 모드)
 */
interface WriteContentProps {
	onClose?: () => void;
	onSuccess?: (data?: BoardListItemDto) => void;
	initialCaption?: string;
	initialImage?: string | null;
	initialPresetId?: number | null;
	boardId?: number;
}

/**
 * @description 게시글 작성/수정 모달 컴포넌트. 상위 모달 로직을 관리하며
 *              UI 영역은 Header, ImageArea, FormArea로 분리하여 렌더링
 * @param {WriteContentProps} props - 컴포넌트 Props
 * @return {TSX.Element} 게시글 작성/수정 모달 UI
 */
const WriteContent = ({
	onClose,
	onSuccess,
	initialCaption = '',
	initialImage = null,
	initialPresetId = null,
	boardId,
}: WriteContentProps) => {
	/**
	 * useWriteBoard: 게시물 제목, 내용, 이미지 미리보기, 프리셋 선택 및 서버 전송 로직을 통합 관리하기 위한 커스텀 훅
	 */
	const {
		title,
		setTitle,
		caption,
		setCaption,
		preview,
		fileInRef,
		onFileSelect,
		mode,
		setMode,
		presets,
		selectedPresetId,
		onPresetSelect,
		isCapturing,
		isSubmitting,
		handleSubmit,
	} = useWriteBoard({ initialCaption, onClose, onSuccess, boardId, initialPresetId, initialImage });

	/**
	 * useMounted: 클라이언드 사이드 렌더링 환경을 확인하여 포털(Portal) 사용 시 하이드레이션 오류를 방지하기 위한 체크 훅
	 */
	const mounted = useMounted();
	if (!mounted) return null;

	return createPortal(
		<div className='fixed inset-0 bg-zinc-950 z-70 flex flex-col animate-fade-in'>
			{/* 배경 장식 */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] -z-10 rounded-full' />
			<div className='absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] -z-10 rounded-full' />

			{/* 헤더 영역 */}
			<WriteContentHeader
				isSubmitting={isSubmitting}
				hasPreview={!!preview}
				title={title}
				caption={caption}
				onClose={onClose || (() => {})}
				onSubmit={handleSubmit}
				isEdit={!!boardId}
			/>

			<div className='flex flex-1 overflow-hidden max-w-480 mx-auto w-full'>
				{/* 좌측 이미지 업로드/미리보기 영역 */}
				<WriteContentImageArea
					preview={preview}
					fileInputRef={fileInRef}
					onFileSelect={onFileSelect}
					mode={mode}
					setMode={setMode}
					presets={presets}
					selectedPresetId={selectedPresetId}
					onPresetSelect={onPresetSelect}
					isCapturing={isCapturing}
				/>

				{/* 우측 텍스트 입력 영역 */}
				<WriteContentFormArea
					title={title}
					setTitle={setTitle}
					caption={caption}
					setCaption={setCaption}
					isSubmitting={isSubmitting}
					maxTitle={40}
				/>
			</div>
		</div>,
		document.body,
	);
};

export default WriteContent;
