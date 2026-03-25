/**
 * @file WriteContentHeader.tsx
 * @description 게시글 작성/수정 모달의 헤더 영역 컴포넌트
 */
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description WriteContentHeader 컴포넌트의 Props 인터페이스
 * @property {boolean} isSubmitting - 최종 업로드 작업이 진행 중인지 여부를 판별하기 위한 상태 값
 * @property {boolean} hasPreview - 업로드할 대상 이미지(또는 프리셋 캡처)가 준비되었는지 확인하기 위한 상태 값
 * @property {string} title - 사용자가 현재 입력한 게시글 제목 문자열
 * @property {string} caption - 사용자가 현재 입력한 게시글 본문 내용 문자열
 * @property {() => void} onClose - 작성 모달 창을 닫기 위한 이벤트 핸들러 함수
 * @property {() => void} onSubmit - 작성된 데이터를 서버로 최종 제출하기 위한 비동기 처리 함수
 * @property {boolean} isEdit - 신규 작성이 아닌 기존 게시글 수정을 위한 모드인지 여부를 판별하기 위한 상태 값
 */
interface WriteContentHeaderProps {
	isSubmitting: boolean;
	hasPreview: boolean;
	title: string;
	caption: string;
	onClose: () => void;
	onSubmit: () => void;
	isEdit?: boolean;
}

/**
 * @description 모달 상단 헤더. 취소 버튼, 제목, 전송 버튼을 포함
 *              전송 버튼은 제출 중이거나 필수 입력값이 누락되었을 때 비활성화
 * @param {WriteContentHeaderProps} props - 컴포넌트 Props
 * @return {TSX.Element} 작성 모달 헤더 UI
 */
const WriteContentHeader = ({
	isSubmitting,
	hasPreview,
	title,
	caption,
	onClose,
	onSubmit,
	isEdit = false,
}: WriteContentHeaderProps) => {
	const canSubmit = hasPreview && title.trim() !== '' && caption.trim() !== '' && !isSubmitting;
	/**
	 * useLanguage: 헤더 내 '취소', '업로드' 버튼의 레이블을 현재 언어 설정에 맞춰 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].writeContentHeaderComponent;

	return (
		<header className='h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-zinc-950 shrink-0 z-10'>
			<button
				onClick={onClose}
				className='text-zinc-500 font-bold hover:text-zinc-100 transition-all text-sm py-2 px-3 rounded-xl hover:bg-zinc-800/50'
			>
				{dict.cancel}
			</button>
			<p className='text-sm font-black text-zinc-100  tracking-[0.2em]'>{isEdit ? 'Edit Post' : 'New Post'}</p>
			<button
				onClick={onSubmit}
				disabled={!canSubmit}
				className={`text-sm font-black px-6 py-2 rounded-xl transition-all duration-300 ${
					canSubmit
						? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 active:scale-95'
						: 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
				}`}
			>
				{isSubmitting ? dict.submitting : dict.submit}
			</button>
		</header>
	);
};

export default WriteContentHeader;
