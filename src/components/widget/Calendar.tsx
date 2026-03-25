'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import { useLanguage } from '@/context/LanguageContext';
import './Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

/**
 * @description 커스텀 캘린더 컴포넌트. react-calendar 라이브러리를 사용하여
 *              달력을 표시하며, dayjs를 사용하여 날짜 포맷(YYYY, YYYY/MM, D)을
 *              커스터마이징. 일요일 시작(gregory) 캘린더를 사용
 *              전역 언어 상태(LanguageContext)에 따라 한국어/일본어 로케일을 적용
 * @return {TSX.Element} 캘린더 위젯 UI
 */
const CustomCalendar = () => {
	/**
	 * useLanguage: 전역 언어 상태(LanguageContext)에 따라 한국어/일본어 로케일을 달력에 적용하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();

	/**
	 * useState: 사용자가 달력에서 선택한 날짜 정보를 상태로 관리하기 위한 훅
	 */
	const [value, onChange] = useState<Value>(new Date());

	dayjs.locale(currentLang);

	return (
		<div className='flex flex-col items-center justify-center mt-6 w-full'>
			<div className='bg-zinc-950/50 backdrop-blur-xl p-4 rounded-[40px] w-full max-w-md border border-zinc-800/50 hover:border-emerald-500/20 transition-all duration-700 relative overflow-hidden group shadow-2xl'>
				<div className='absolute -right-20 -top-20 w-40 h-40 bg-emerald-500/5 blur-[80px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-700' />
				<Calendar
					locale={currentLang}
					// 일요일부터 시작하는 달력 설정
					calendarType='gregory'
					onChange={onChange}
					value={value}
					// 날짜 포맷 커스터마이징 (기본 포맷 제거 및 '일' 단위 숫자만 표시)
					formatYear={(locale, date) => dayjs(date).format('YYYY')}
					formatMonthYear={(locale, date) => dayjs(date).format('YYYY.MM')}
					formatDay={(locale, date) => dayjs(date).format('D')}
					className='w-full border-none'
				/>
			</div>
		</div>
	);
};

export default CustomCalendar;
