/**
 * @file BoardEtc.tsx
 * @description 게시글 기타 메뉴(더보기) 컴포넌트
 * 게시글에서 '더보기' 버튼 클릭 시 표시되는 옵션 메뉴
 * 신고, 수정, 삭제, 취소 버튼을 제공하며, 각 액션에 대한 콜백을 props로 전달받음
 * isOwner가 true일 때만 수정/삭제 버튼을 표시
 */

'use client';

import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description BoardEtc 컴포넌트의 Props 인터페이스
 * @property {() => void} onClose - 더보기 메뉴 창을 닫기 위해 호출될 이벤트 핸들러 함수
 * @property {() => void} [onEdit] - 게시글 수정을 위한 모달이나 기능을 호출하기 위한 콜백 함수 (선택적)
 * @property {() => void} [onDelete] - 게시글 삭제 비즈니스 로직을 실행하기 위한 콜백 함수 (선택적)
 * @property {() => void} [onReport] - 부적절한 게시글에 대한 신고 접수 처리를 수행하기 위한 콜백 함수 (선택적)
 * @property {boolean} [isOwner] - 현재 로그인 유저가 해당 게시글의 작성자인지 확인하여 특정 메뉴(수정/삭제) 노출 여부를 결정하기 위한 상태 값
 */
interface BoardEtcProps {
	onClose: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	onReport?: () => void;
	isOwner?: boolean;
}

/**
 * @description 게시글 기타 메뉴(더보기) 컴포넌트. 신고, (내 글일 때만)수정/삭제, 취소 버튼
 *              isOwner가 false이면 수정/삭제 버튼을 숨김
 * @param {BoardEtcProps} props - 컴포넌트 Props
 * @return {TSX.Element} 더보기 메뉴 UI
 */
const BoardEtc = ({ onClose, onEdit, onDelete, onReport, isOwner = false }: BoardEtcProps) => {
	/**
	 * useLanguage: 게시글 메뉴(신고, 수정, 삭제, 취소)의 텍스트를 현재 언어 설정에 맞게 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].boardEtcComponent;

	return (
		<div className='bg-zinc-900 border border-zinc-800 shadow-lg rounded-md overflow-hidden w-40'>
			<ul className='flex flex-col'>
				<li
					className='px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-purple-400 text-center'
					onClick={() => {
						if (onReport) onReport();
						onClose();
					}}
				>
					{dict.report}
				</li>
				{isOwner && (
					<>
						<li
							className='px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-blue-400 text-center'
							onClick={() => {
								if (onEdit) onEdit();
								onClose();
							}}
						>
							{dict.fix}
						</li>
						<li
							className='px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-red-500 text-center border-t border-zinc-800'
							onClick={() => {
								if (onDelete) onDelete();
								onClose();
							}}
						>
							{dict.delete}
						</li>
					</>
				)}
				<li
					className='px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-zinc-300 text-center'
					onClick={onClose}
				>
					{dict.cancel}
				</li>
			</ul>
		</div>
	);
};

export default BoardEtc;
