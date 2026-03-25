/**
 * @file CommentList.tsx
 * @description 댓글 목록을 렌더링하는 컴포넌트
 * 계층 구조를 가진 댓글 데이터를 평탄화하여 리스트 형태로 표시
 */

import { useMemo } from 'react';
import { CommentListItemDto } from '@/types/comment';
import CommentItem from './CommentItem';
import { RefObject } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
import { MessageCircle } from 'lucide-react';

/**
 * @description CommentList 컴포넌트의 Props 인터페이스
 */
/**
 * @description CommentList 컴포넌트의 Props 인터페이스
 * @property {CommentListItemDto[]} comments - 화면에 목록으로 표시할 전체 댓글 객체 배열
 * @property {number | null} editingCommentId - 현재 인라인 편집 모드가 활성화된 특정 댓글의 고유 ID 식별값
 * @property {boolean} isLoggedIn - 사용자의 로그인 유무를 판별하여 답글 작성 기능 등의 노출 여부를 제어하기 위한 상태 값
 * @property {string | null} currentNickname - 현재 접속 중인 사용자의 닉네임을 확인하여 작성자 본인 여부를 판단하기 위한 데이터
 * @property {string} editInput - 댓글 수정 시 입력 중인 수정 텍스트를 저장하기 위한 상태 데이터
 * @property {RefObject<HTMLInputElement | null>} editInputRef - 특정 댓글 수정 시 입력 필드에 자동으로 포커스를 이동하기 위한 DOM 참조 객체
 * @property {(val: string) => void} setEditInput - 수정 텍스트 입력창의 변경 발생 시 해당 상태 값을 동기화하기 위한 핸들러 함수
 * @property {(id: number, nickname: string) => void} onReplyStart - 특정 댓글에 대해 답글 작성을 시작할 때 호출되기 위한 핸들러 함수
 * @property {(id: number, content: string) => void} onEditStart - 특정 댓글의 수정 모드를 활성화하고 초기 본문을 세팅하기 위한 핸들러 함수
 * @property {(id: number) => void} onEditSubmit - 수정된 댓글 본문을 서버로 전송하여 최종적으로 반영하기 위한 서버 통신 함수
 * @property {() => void} onEditCancel - 진행 중인 댓글 수정 작업을 중단하고 원래 뷰로 되돌리기 위한 핸들러 함수
 * @property {(id: number) => void} onDelete - 특정 댓글을 목록 및 데이터베이스에서 완전히 제거하기 위한 함수
 * @property {(id: number) => void} onReport - 부적절한 댓글 내용에 대해 신고 접수 절차를 수행하기 위한 함수
 */
interface CommentListProps {
	comments: CommentListItemDto[];
	editingCommentId: number | null;
	isLoggedIn: boolean;
	currentNickname: string | null;
	editInput: string;
	editInputRef: RefObject<HTMLInputElement | null>;
	setEditInput: (val: string) => void;
	onReplyStart: (id: number, nickname: string) => void;
	onEditStart: (id: number, content: string) => void;
	onEditSubmit: (id: number) => void;
	onEditCancel: () => void;
	onDelete: (id: number) => void;
	onReport: (id: number) => void;
}

/**
 * @description 댓글 목록 컴포넌트. 평탄화된 댓글 목록을 순회하며 CommentItem을 렌더링
 * @param {CommentListProps} props - 컴포넌트 Props
 * @return {TSX.Element} 댓글 목록 UI
 */
const CommentList = ({
	comments,
	editingCommentId,
	isLoggedIn,
	currentNickname,
	editInput,
	editInputRef,
	setEditInput,
	onReplyStart,
	onEditStart,
	onEditSubmit,
	onEditCancel,
	onDelete,
	onReport,
}: CommentListProps) => {
	/**
	 * useLanguage: 댓글 목록이 비어있을 때의 안내 문구를 다국어로 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].commentListComponent;

	/**
	 * useMemo: 평면적인 댓글 배열을 계층형(부모-자식) 구조로 변환하고 효율적으로 렌더링하기 위해 계산 결과를 메모이제이션하는 훅
	 */
	const organizedComments = useMemo(() => {
		type CommentNode = CommentListItemDto & {
			level: number;
			replies: CommentNode[];
			parentNickname?: string;
		};
		const map = new Map<number, CommentNode>();
		const roots: CommentNode[] = [];

		comments.forEach((comment) => {
			map.set(comment.commentId, { ...comment, replies: [], level: 0 });
		});

		comments.forEach((comment) => {
			if (comment.parentCommentId && map.has(comment.parentCommentId)) {
				const parent = map.get(comment.parentCommentId);
				const node = map.get(comment.commentId);
				if (parent && node) {
					node.level = parent.level + 1;
					node.parentNickname = parent.nickname;
					parent.replies.push(node);
				}
			} else {
				const node = map.get(comment.commentId);
				if (node) roots.push(node);
			}
		});

		const flattened: CommentNode[] = [];
		const flatten = (nodes: CommentNode[]) => {
			nodes.forEach((node) => {
				flattened.push(node);
				flatten(node.replies);
			});
		};

		flatten(roots);
		return flattened;
	}, [comments]);

	if (organizedComments.length === 0) {
		return (
			<div className='h-full flex flex-col items-center justify-center text-zinc-700 gap-4 animate-scale-in'>
				<MessageCircle size={48} strokeWidth={1} className='opacity-20' />
				<p className='text-xs font-black  tracking-[0.2em] opacity-50'>{dict.firstComment}</p>
			</div>
		);
	}

	return (
		<ul className='space-y-4'>
			{organizedComments.map((comment) => {
				const cDate = new Date(comment.createdAt);
				const cFormattedDate = `${cDate.getFullYear()}.${String(cDate.getMonth() + 1).padStart(2, '0')}.${String(cDate.getDate()).padStart(2, '0')} ${String(cDate.getHours()).padStart(2, '0')}:${String(cDate.getMinutes()).padStart(2, '0')}`;

				return (
					<CommentItem
						key={comment.commentId}
						comment={comment}
						isEditing={editingCommentId === comment.commentId}
						isCommentOwner={isLoggedIn && currentNickname === comment.nickname}
						isLoggedIn={isLoggedIn}
						editInput={editInput}
						editInputRef={editInputRef}
						setEditInput={setEditInput}
						formattedDate={cFormattedDate}
						onReplyStart={onReplyStart}
						onEditStart={onEditStart}
						onEditSubmit={onEditSubmit}
						onEditCancel={onEditCancel}
						onDelete={onDelete}
						onReport={onReport}
					/>
				);
			})}
		</ul>
	);
};

export default CommentList;
