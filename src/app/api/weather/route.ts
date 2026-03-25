/**
 * @file route.ts
 * @description 날씨 API 라우트 핸들러 (Next.js Route Handler)
 * 클라이언트 IP 기반으로 위치를 추적하고, OpenWeatherMap API를 통해 해당 위치의 현재 날씨 데이터를 반환
 * IP 추적 실패 시 기본값으로 서울(37.5665, 126.978) 좌표를 사용
 */

import { NextResponse } from 'next/server';
import axios from 'axios';
import { WeatherData } from '@/types/weather';

/**
 * @description 날씨 데이터를 가져오는 GET 핸들러. IP 주소 기반 위치 추적 → OpenWeatherMap API 호출 → 날씨 데이터 반환
 * @param {Request} request - HTTP 요청 객체 (x-forwarded-for 헤더에서 IP 추출)
 * @return {Promise<NextResponse>} 날씨 데이터 JSON 응답 또는 에러 응답 (status 500)
 */
export async function GET(request: Request) {
	const apiKey = process.env.OPENWEATHER_API_KEY;

	let lat: number, lon: number;

	//요청 헤더에서 IP 가져오기
	let ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

	//로컬호스트(개발 환경) 처리
	if (ip === '::1' || ip === '127.0.0.1') {
		ip = ''; //빈 값으로 보내면 ip-api가 요청을 보낸 서버의 공인 IP를 자동으로 찾음
	}

	try {
		//IP로 위치 정보 가져오기 (ip-api.com 사용)
		const locationRes = await axios.get(`http://ip-api.com/json/${ip}`);
		const locationData = locationRes.data;

		if (locationData.status === 'fail') {
			throw new Error('위치 정보를 가져오지 못했습니다.');
		}

		lat = locationData.lat;
		lon = locationData.lon;

		console.log(`IP 추적 위치: ${locationData.city} (${lat}, ${lon})`);
	} catch (error) {
		//IP 추적 실패 시 기본값 (서울)
		console.error('위치 정보 찾기 실패, 서울로 설정합니다.', error);
		lat = 37.5665;
		lon = 126.978;
	}

	//OpenWeatherMap API 호출 URL 생성 (IP로 찾은 좌표 또는 기본 서울 좌표 사용)
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

	try {
		const weatherRes = await axios.get<WeatherData>(url);
		const weatherData = weatherRes.data;

		return NextResponse.json(weatherData);
	} catch (error) {
		console.error('날씨 데이터 fetch 실패', error);
		return NextResponse.json({ error: '날씨 데이터 fetch 실패' }, { status: 500 });
	}
}
