/**
 * @file WriteContentFormArea.tsx
 * @description 게시글 작성/수정 모달의 텍스트 입력 영역 컴포넌트
 */
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description WriteContentFormArea 컴포넌트의 Props 인터페이스
 * @property {string} title - 사용자가 입력 중인 게시글의 제목 텍스트 값
 * @property {(val: string) => void} setTitle - 제목 입력 필드 변경 시 상태를 갱신하기 위한 핸들러 함수
 * @property {string} caption - 사용자가 입력 중인 게시글의 전체 본문 내용
 * @property {(val: string) => void} setCaption - 본문 텍스트 피리어드 변경 시 상태를 동기화하기 위한 핸들러 함수
 * @property {boolean} isSubmitting - 서버에 데이터를 전송 중인 상태인지 여부를 판별하여 입력 필드를 비활성화하기 위한 플래그
 * @property {number} maxTitle - 제목 입력 필드에서 허용하는 최대 글자 수 제한
 */
interface WriteContentFormAreaProps {
	title: string;
	setTitle: (val: string) => void;
	caption: string;
	setCaption: (val: string) => void;
	isSubmitting: boolean;
	maxTitle: number;
}

/**
 * @description 우측 폼 영역. 제목 입력, 본문 입력을 함
 * @param {WriteContentFormAreaProps} props - 컴포넌트 Props
 * @return {TSX.Element} 텍스트 입력 폼 영역 UI
 */
const WriteContentFormArea = ({
	title,
	setTitle,
	caption,
	setCaption,
	isSubmitting,
	maxTitle,
}: WriteContentFormAreaProps) => {
	/**
	 * useLanguage: 글쓰기 폼의 제목/본문 입력창의 placeholder 텍스트를 다국어 처리하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].writeContentFormAreaComponent;

	return (
		<div className='w-2/5 flex flex-col bg-zinc-900 border-l border-zinc-800/50'>
			<div className='flex items-center justify-between p-6 border-b border-zinc-800/50 shrink-0 bg-zinc-950/20'>
				<div className='flex items-center gap-3 flex-1'>
					<div className='w-1 h-6 bg-emerald-500 rounded-full' />
					<input
						maxLength={maxTitle}
						className='w-full text-base font-black text-zinc-100 outline-none bg-transparent placeholder-zinc-700'
						placeholder={dict.titlePlaceholder}
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						disabled={isSubmitting}
					/>
				</div>
				<span
					className={`text-[10px] font-black px-2 py-1 rounded-md transition-all duration-300 tracking-tighter ${
						title.length === maxTitle ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'
					}`}
				>
					{title.length} / {maxTitle}
				</span>
			</div>

			<div className='flex-1 flex flex-col bg-zinc-900/50'>
				<textarea
					className='flex-1 w-full p-6 resize-none outline-none text-[15px] leading-relaxed text-zinc-300 placeholder-zinc-700 font-medium'
					placeholder={dict.contentPlaceholder}
					value={caption}
					onChange={(event) => setCaption(event.target.value)}
					spellCheck={false}
					disabled={isSubmitting}
				/>
			</div>
		</div>
	);
};

export default WriteContentFormArea;
