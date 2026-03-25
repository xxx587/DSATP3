'use client';

import { useState, useEffect, useRef } from 'react';
import { getPresetDetail } from '@/app/api/preset';
import { PresetResponseDto } from '@/types/preset';
import { toast } from 'sonner';

/**
 * @file usePresetCapture.ts
 * @description 프리셋 상세 정보와 이미지 로딩 상태를 관리하기 위한 커스텀 훅
 * 특정 프리셋의 데이터를 서버에서 조회하고, 포함된 모든 이미지의 로딩 완료 시점을 추적하여 캡처 준비 상태를 관리함
 */

/**
 * @description 프리셋 상세 정보 및 이미지 로딩 상태를 관리하는 훅
 * @param {number} id - 프리셋 ID
 * @returns {object} { preset, imagesLoaded, handleImageLoad } - 프리셋 데이터, 이미지 로드 완료 메시지, 이미지 로드 핸들러
 */
export const usePresetCapture = (id: number) => {
	/**
	 * useState: 컴포넌트의 상태를 관리하기 위한 훅으로, 프리셋 상세 정보와 이미지들의 로딩 완료 여부를 저장하기 위해 사용함
	 */
	const [preset, setPreset] = useState<PresetResponseDto | null>(null);
	const [imagesLoaded, setImagesLoaded] = useState(false);

	/**
	 * useRef: 리렌더링과 관계없이 유지되어야 하는 값(현재 로딩 중인 이미지 수)을 관리하기 위한 훅
	 */
	const loadingCountRef = useRef(0);

	/**
	 * useEffect: 프리셋 ID 변경 시 해당 프리셋의 상세 정보를 서버에서 가져오기 위한 훅
	 */
	useEffect(() => {
		const fetchPreset = async () => {
			if (!id) return;
			try {
				const data = await getPresetDetail(id);
				setPreset(data);
				console.log(data);

				// 실제 이미지가 있는 아이템들의 개수 파악
				const count = data.clothesList.filter((item) => item.imageUrl).length;

				if (count === 0) {
					toast.info('옷 이미지가 없습니다.');
					setImagesLoaded(true);
				} else {
					console.log(count);
					loadingCountRef.current = count;
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchPreset();
	}, [id]);

	/**
	 * @description 각 이미지가 로드될 때마다 호출되어 전체 이미지 로딩 완료 여부를 확인하기 위한 핸들러 함수
	 */
	const handleImageLoad = () => {
		loadingCountRef.current -= 1;
		if (loadingCountRef.current <= 0) {
			setImagesLoaded(true);
		}
	};

	return {
		preset,
		imagesLoaded,
		handleImageLoad,
	};
};

