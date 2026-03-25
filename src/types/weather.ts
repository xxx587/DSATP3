/**
 * @file weather.ts
 * @description 날씨 정보 API 응답 데이터 구조를 정의하기 위한 파일
 */

/** @description 날씨 API 응답 데이터 */
export interface WeatherData {
	name: string;
	main: {
		temp: number;
		humidity: number;
	};
	weather: {
		description: string;
		icon: string;
		main: string;
	}[];
	wind: {
		speed: number;
	};
}
