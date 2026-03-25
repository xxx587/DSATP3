'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { getMyPresets } from '@/app/api/preset';
import { boardWrite, boardUpdate } from '@/app/api/board';
import { BoardListItemDto } from '@/types/board';
import { PresetResponseDto } from '@/types/preset';
import useRequireAuth from '@/hooks/useRequireAuth';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

interface UseWriteBoardProps {
	initialCaption: string;
	onClose?: () => void;
	onSuccess?: (data?: BoardListItemDto) => void;
	boardId?: number;
	initialPresetId?: number | null;
	initialImage?: string | null;
}

/**
 * @file useWriteBoard.ts
 * @description 게시글 작성 및 수정의 모든 비즈니스 로직을 담당하는 커스텀 훅
 * 제목, 내용, 이미지 파일, 프리셋 선택 등의 상태 관리와 서버 업로드 기능을 제공함
 */

export const useWriteBoard = ({
	initialCaption,
	onClose,
	onSuccess,
	boardId,
	initialPresetId,
	initialImage,
}: UseWriteBoardProps) => {
	/**
	 * useRouter: Next.js의 라우팅 기능을 제어하여 게시글 작성 후 페이지를 갱신하기 위한 훅
	 */
	const router = useRouter();

	/**
	 * useRequireAuth: 게시글 작성 전 사용자의 로그인 여부를 확인하기 위한 커스텀 훅
	 */
	const checkAuth = useRequireAuth();

	/**
	 * useLanguage: 현재 언어 설정을 가져와 다국어 사전에 접근하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].useBoard;

	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 게시글 제목, 내용, 이미지 파일, 프리셋 목록, 로딩 상태 등을 저장함
	 */
	const [title, setTitle] = useState('');
	const [caption, setCaption] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(initialImage || null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [mode, setMode] = useState<'image' | 'preset'>(initialPresetId ? 'preset' : 'image');
	const [presets, setPresets] = useState<PresetResponseDto[]>([]);
	const [selectedPresetId, setSelectedPresetId] = useState<number | null>(initialPresetId || null);
	const [isCapturing, setIsCapturing] = useState(false);

	/**
	 * useRef: DOM 요소에 접근하거나 리렌더링과 무관한 값(Blob URL 등)을 유지하기 위한 훅
	 */
	const fileInputRef = useRef<HTMLInputElement>(null);
	const blobUrlRef = useRef<string | null>(null);

	/**
	 * useEffect: 컴포넌트 언마운트 시 생성된 Blob URL을 해제하여 메모리 누수를 방지하기 위한 훅
	 */
	useEffect(() => {
		return () => {
			if (blobUrlRef.current) {
				URL.revokeObjectURL(blobUrlRef.current);
			}
		};
	}, []);

	/**
	 * useEffect: 초기 캡션 데이터를 파싱하여 게시글 제목과 상세 내용으로 분리해 상태를 초기화하기 위한 훅
	 */
	useEffect(() => {
		if (!initialCaption) {
			setTitle('');
			setCaption('');
			return;
		}
		const normalized = initialCaption.replace(/\r\n/g, '\n');
		const splitIndex = normalized.indexOf('\n');
		if (splitIndex >= 0) {
			setTitle(normalized.slice(0, splitIndex));
			setCaption(normalized.slice(splitIndex + 1));
		} else {
			setTitle(normalized);
			setCaption('');
		}
	}, [initialCaption]);

	/**
	 * useEffect: 사용자의 프리셋 목록을 서버에서 조회하여 선택 옵션으로 제공하기 위한 훅
	 */
	useEffect(() => {
		const fetchPresets = async () => {
			try {
				const response = await getMyPresets();
				setPresets(response);
			} catch (error) {
				toast.error(dict.presetLoadError);
				console.error(error);
			}
		};
		fetchPresets();
	}, [dict.presetLoadError]);

	/**
	 * @description 사용자가 커버 이미지를 직접 선택했을 때 미리보기를 생성하고 상태를 업데이트하기 위한 함수
	 * @param {React.ChangeEvent<HTMLInputElement>} e - 파일 입력 변경 이벤트
	 * useCallback: 동일한 파일 선택 로직을 재사용하여 성능을 최적화하기 위한 훅
	 */
	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFile = e.target.files?.[0];
			if (selectedFile) {
				if (!selectedFile.type.startsWith('image/')) {
					toast.error(dict.imageOnlyError);
					e.target.value = '';
					return;
				}
				setFile(selectedFile);
				if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
				const newUrl = URL.createObjectURL(selectedFile);
				blobUrlRef.current = newUrl;
				setPreview(newUrl);
				setSelectedPresetId(null);
			}
			e.target.value = '';
		},
		[dict],
	);

	/**
	 * @description 선택한 프리셋을 기반으로 서버에 캡처를 요청하고 결과 이미지를 게시글 이미지로 설정하기 위한 비동기 함수
	 * @param {PresetResponseDto} preset - 선택된 프리셋 상세 정보
	 * useCallback: 프리셋 캡처 및 이미지 처리 로직을 메모이제이션하기 위한 훅
	 */
	const handlePresetSelect = useCallback(
		async (preset: PresetResponseDto) => {
			setSelectedPresetId(preset.presetId);
			setFile(null);
			setIsCapturing(true);
			setPreview(null);

			try {
				const response = await axios.get('/api/capture/preset', {
					params: { presetId: preset.presetId },
					responseType: 'blob',
				});
				console.log(response);

				const blob = response.data;
				const capturedFile = new File([blob], `preset_${preset.presetId}.png`, { type: 'image/png' });

				setFile(capturedFile);

				const newUrl = URL.createObjectURL(blob);
				if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
				blobUrlRef.current = newUrl;
				setPreview(newUrl);
			} catch (error) {
				console.error(error);
				toast.error(dict.presetCaptureFail);
				if (preset.clothesList.length > 0 && preset.clothesList[0].imageUrl) {
					setPreview(preset.clothesList[0].imageUrl);
				}
			} finally {
				setIsCapturing(false);
				setMode('image');
			}
		},
		[blobUrlRef, dict.presetCaptureFail],
	);

	/**
	 * @description 작성된 게시글 데이터를 서버에 전송(신규 작성 또는 수정)하기 위한 비동기 함수
	 * useCallback: 긴 제출 로직과 폼 데이터 구성 작업을 메모이제이션하여 성능을 향상시키기 위한 훅
	 */
	const handleSubmit = useCallback(async () => {
		if (!checkAuth()) return;

		if (!title.trim()) {
			toast.warning(dict.titleRequired);
			return;
		}
		if (!caption.trim()) {
			toast.warning(dict.contentRequired);
			return;
		}
		if (!preview) {
			toast.warning(dict.imageRequired);
			return;
		}

		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const mergedContent =
				title.trim() && caption.trim() ? `${title.trim()}\n${caption.trim()}` : title.trim() || caption.trim();

			const form = new FormData();
			form.append('content', mergedContent);
			if (file) {
				form.append('image', file);
			}
			if (selectedPresetId !== null) {
				console.log(selectedPresetId);
				form.append('presetId', selectedPresetId.toString());
			}

			console.log('전송 데이터:', Object.fromEntries(form));

			if (boardId) {
				const updatedPost = await boardUpdate(boardId, form);
				toast.success(dict.editSuccess);
				if (onSuccess) onSuccess(updatedPost);
			} else {
				await boardWrite(form);
				toast.success(dict.writeSuccess);
				if (onSuccess) onSuccess();
			}
			router.refresh();
			if (onClose) onClose();
		} catch (error) {
			console.error(error);
			toast.error(dict.uploadFail);
		} finally {
			setIsSubmitting(false);
		}
	}, [caption, file, isSubmitting, onClose, onSuccess, boardId, title, preview, checkAuth, router, selectedPresetId, dict]);

	return {
		title,
		setTitle,
		caption,
		setCaption,
		preview,
		setPreview,
		fileInRef: fileInputRef,
		onFileSelect: handleFileSelect,
		mode,
		setMode,
		presets,
		selectedPresetId,
		onPresetSelect: handlePresetSelect,
		isCapturing,
		isSubmitting,
		handleSubmit,
	};
};

