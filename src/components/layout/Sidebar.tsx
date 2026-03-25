/**
 * @file Sidebar.tsx
 * @description 사이드바 컴포넌트
 * 화면 좌측에 위치하며 날씨(CurrentWeather) 위젯과 캘린더(CustomCalendar) 위젯을 포함
 * md 이상의 화면 크기에서만 표시됨 (layout.tsx에서 hidden md:block으로 제어)
 */

import CurrentWeather from '../widget/Weather';
import CustomCalendar from '../widget/Calendar';

/**
 * @description 사이드바 컴포넌트. 날씨와 캘린더 위젯을 세로로 배치
 * @return {TSX.Element} 사이드바 UI
 */
export default function Sidebar() {
	return (
		<div className='flex flex-col gap-6 p-4 h-full bg-transparent'>
			<div className='space-y-1'>
				<div className='space-y-4'>
					<CurrentWeather />
					<CustomCalendar />
				</div>
			</div>
		</div>
	);
}
