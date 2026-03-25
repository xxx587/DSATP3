/**
 * @file WriteContentImageArea.tsx
 * @description 게시글 작성/수정 모달의 이미지 업로드 영역 컴포넌트
 */

import Image from 'next/image';
import { Image as ImageIcon, Shirt } from 'lucide-react';
import { RefObject } from 'react';
import { PresetResponseDto } from '@/types/preset';
import PresetSelectorList from '@/components/preset/PresetSelectorList';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description WriteContentImageArea 컴포넌트의 Props 인터페이스
 * @property {string | null} preview - 업로드할 원본 이미지 또는 프리셋 캡처본의 실시간 미리보기 URL 데이터
 * @property {RefObject<HTMLInputElement | null>} fileInputRef - 숨겨진 파일 선택(input[type=file]) 요소를 제어하기 위한 DOM 참조 객체
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onFileSelect - 사용자가 로컬 파일을 선택했을 때 미리보기 생성 및 상태 갱신을 수행하기 위한 핸들러 함수
 * @property {'image' | 'preset'} mode - 현재 선택된 업로드 방식 모드 ('image': 직접 업로드, 'preset': 프리셋 캡처)
 * @property {(mode: 'image' | 'preset') => void} setMode - 업로드 방식 탭을 전환하기 위한 상태 변경 핸들러 함수
 * @property {PresetResponseDto[]} presets - 프리셋 모드에서 선택 가능한 유저의 코디 프리셋 목록 배열
 * @property {number | null} selectedPresetId - 목록에서 현재 선택된 프리셋의 고유 식별자 ID
 * @property {(preset: PresetResponseDto) => void} onPresetSelect - 프리셋 아이템 선택 시 해당 정보를 상위 상태에 반영하기 위한 콜백 함수
 * @property {boolean} isCapturing - 프리셋 캔버스를 이미지 파일로 변환(HTML-to-Image) 중인지 여부를 판별하기 위한 상태 플래그
 */
interface WriteContentImageAreaProps {
	preview: string | null;
	fileInputRef: RefObject<HTMLInputElement | null>;
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
	mode: 'image' | 'preset';
	setMode: (mode: 'image' | 'preset') => void;
	presets: PresetResponseDto[];
	selectedPresetId: number | null;
	onPresetSelect: (preset: PresetResponseDto) => void;
	isCapturing: boolean;
}

/**
 * @description 좌측 이미지 영역. 상단 탭을 통해 이미지 직접 선택 또는 프리셋 선택 가능
 *              이미지 모드에서는 미리보기 또는 업로드 버튼을 표시
 * @param {WriteContentImageAreaProps} props - 컴포넌트 Props
 * @return {TSX.Element} 이미지 업로드 영역 UI
 */
const WriteContentImageArea = ({
	preview,
	fileInputRef,
	onFileSelect,
	mode,
	setMode,
	presets,
	selectedPresetId,
	onPresetSelect,
	isCapturing,
}: WriteContentImageAreaProps) => {
	/**
	 * useLanguage: 이미지 선택 안내 문구 및 프리셋 캡처 상태 메시지를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].writeContentImageAreaComponent;
	return (
		<div className='w-3/5 relative flex flex-col bg-zinc-950 border-r border-zinc-800/50 text-zinc-100'>
			{/* 상단 탭 선택 영역 */}
			<div className='flex border-b border-zinc-800/50 bg-zinc-950/30 p-1.5 gap-1.5'>
				<button
					className={`flex-1 flex items-center justify-center border py-2.5 gap-2 rounded-xl transition-all duration-300 ${
						mode === 'image'
							? 'bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-xl'
							: 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900/50'
					}`}
					onClick={() => setMode('image')}
				>
					<ImageIcon size={16} />
					<span className='text-xs font-black  tracking-wider'>Image</span>
				</button>
				<button
					className={`flex-1 flex items-center justify-center border py-2.5 gap-2 rounded-xl transition-all duration-300 ${
						mode === 'preset'
							? 'bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-xl'
							: 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900/50'
					}`}
					onClick={() => setMode('preset')}
				>
					<Shirt size={16} />
					<span className='text-xs font-black  tracking-wider'>Preset</span>
				</button>
			</div>

			<div className='flex-1 relative overflow-hidden bg-zinc-950'>
				{/* 스크롤 가능한 컨텐츠 영역 */}
				<div
					className={`absolute inset-0 flex items-center justify-center ${
						isCapturing ? 'overflow-hidden' : 'overflow-y-auto'
					} scrollbar-hide`}
				>
					{mode === 'image' ? (
						preview ? (
							<div
								className='relative w-full h-full flex items-center justify-center bg-zinc-950 group cursor-pointer overflow-hidden'
								onClick={() => fileInputRef.current?.click()}
							>
								<Image
									src={encodeURI(preview)}
									alt='게시글 미리보기'
									fill
									className='object-contain transition-transform duration-700 opacity-90 group-hover:opacity-100 bg-white'
									sizes='(max-width: 768px) 100vw, 60vw'
									priority
								/>
								<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
									<div className='px-6 py-2.5 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-2xl text-xs font-black  tracking-widest text-zinc-100 shadow-2xl'>
										{dict.changeImage}
									</div>
								</div>
							</div>
						) : (
							<div className='flex flex-col items-center justify-center p-12 text-center animate-scale-in'>
								<div className='w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden group'>
									<ImageIcon
										size={32}
										className='text-zinc-700 group-hover:text-emerald-500 transition-colors'
										strokeWidth={1.5}
									/>
									<div className='absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
								<p className='text-2xl text-zinc-100 font-black tracking-tight mb-3'>
									{dict.selectImage}
								</p>
								<p className='text-sm text-zinc-500 mb-10 w-auto leading-relaxed'>
									{dict.selectImageExplain}
								</p>
								<button
									onClick={() => fileInputRef.current?.click()}
									className='bg-zinc-900 hover:bg-emerald-500 hover:text-emerald-950 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 font-black py-4 px-10 rounded-2xl text-xs  tracking-[0.2em] transition-all shadow-xl hover:scale-105'
								>
									{dict.selectImage}
								</button>
							</div>
						)
					) : (
						<div className='w-full h-full p-8 bg-zinc-950'>
							<PresetSelectorList
								presets={presets}
								selectedPresetId={selectedPresetId}
								onSelect={onPresetSelect}
							/>
						</div>
					)}
				</div>

				{/* 캡처 중 오버레이 - 외부 컨테이너 기준 absolute inset-0이므로 항상 정중앙에 위치 */}
				{isCapturing && (
					<div className='absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-md animate-fade-in'>
						<div className='w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6' />
						<p className='text-xs font-black text-emerald-500  tracking-[0.2em]'>
							{dict.makingPresetImage}
						</p>
					</div>
				)}
			</div>

			<input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={onFileSelect} />
		</div>
	);
};

export default WriteContentImageArea;
