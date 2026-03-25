/**
 * @file Weather.tsx
 * @description 현재 날씨 위젯 컴포넌트
 * OpenWeatherMap API를 통해 현재 위치의 날씨 정보를 가져와 카드 형태로 표시
 * 도시명, 날씨 아이콘, 온도, 습도, 풍속 정보를 포함
 * 로딩/에러/정상 상태에 따른 UI를 조건부 렌더링
 */

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { WeatherData } from '@/types/weather';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 현재 날씨 위젯 컴포넌트. OpenWeatherMap API를 통해
 *              현재 위치의 날씨 정보(도시명, 아이콘, 온도, 습도, 풍속)를
 *              가져와 카드 형태로 표시. 로딩/에러/정상 상태에 따른
 *              UI를 조건부로 렌더링.
 * @return {TSX.Element} 날씨 정보 카드 UI
 */
export default function CurrentWeather() {
	/**
	 * useState: 현재 위치의 날씨 정보(도시명, 온도 등)를 상태로 관리하기 위한 훅
	 */
	const [weather, setWeather] = useState<WeatherData | null>(null);

	/**
	 * useState: 날씨 정보를 서버에서 불러오는 중임을 나타내는 로딩 상태를 관리하기 위한 훅
	 */
	const [loading, setLoading] = useState(true);

	/**
	 * useState: 날씨 정보를 불러오는 과정에서 발생한 에러 여부를 관리하기 위한 훅
	 */
	const [error, setError] = useState<boolean>(false);

	/**
	 * useLanguage: 날씨 위젯 내의 지역명이나 상태 설명 등을 다국어로 표시하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].weatherComponent;

	// 컴포넌트 마운트 시 날씨 데이터 Fetch
	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get('/api/weather');
				if (res.data.error) {
					console.error('Weather Error:', res.data.error);
					setError(true);
				} else {
					setWeather(res.data);
				}
			} catch (error) {
				console.error('Network Error:', error);
				setError(true);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// 카드 스타일 정의
	const cardClass =
		'bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 shadow-2xl rounded-3xl p-5 transition-all hover:border-emerald-500/30 hover:bg-zinc-900/60 duration-500 w-full min-h-[300px] flex flex-col justify-between group';

	// 로딩 상태 UI
	if (loading) {
		return (
			<div className='flex items-start mt-2 w-full'>
				<div className={`${cardClass} animate-pulse`}>
					<div className='flex items-center justify-between mb-4'>
						<div className='h-6 w-24 bg-zinc-800/50 rounded-lg'></div>
						<div className='h-5 w-10 bg-zinc-800/30 rounded-full'></div>
					</div>

					<div className='flex items-center gap-4 mb-6 flex-1'>
						<div className='w-20 h-20 bg-zinc-800/50 rounded-full'></div>
						<div className='h-12 w-20 bg-zinc-800/50 rounded-2xl'></div>
					</div>

					<div className='grid! grid-cols-2 gap-4 border-t border-zinc-800/50 pt-4 w-full'>
						<div className='flex flex-col items-center'>
							<div className='h-3 w-8 bg-zinc-800/30 rounded-full mb-1'></div>
							<div className='h-5 w-12 bg-zinc-800/50 rounded-lg'></div>
						</div>
						<div className='flex flex-col items-center'>
							<div className='h-3 w-8 bg-zinc-800/30 rounded-full mb-1'></div>
							<div className='h-5 w-12 bg-zinc-800/50 rounded-lg'></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// 에러 또는 데이터 없음 UI
	if (error || !weather) {
		return (
			<div className='flex items-start mt-2'>
				<div className={cardClass}>
					<div className='flex flex-col items-center justify-center h-full text-center space-y-3'>
						<span className='text-4xl'>⚠️</span>
						<div>
							<p className='text-zinc-100 font-bold text-lg'>{dict.noInfo}</p>
							<p className='text-zinc-400 text-sm mt-1 whitespace-pre-wrap'>{dict.noInfoExplain}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// 정상 데이터 렌더링
	return (
		<div className='flex items-start w-full'>
			<div className={cardClass}>
				<div className='flex items-center justify-between mb-4'>
					<p className='text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors'>
						{weather.name}
					</p>
					<div className='text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full'>
						Live
					</div>
				</div>

				<div className='flex items-center gap-4 mb-6 flex-1'>
					<div className='relative w-20 h-20 -ml-2 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]'>
						<Image
							src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
							alt={weather.weather[0].description}
							fill
							sizes='80px'
							className='object-contain transition-transform group-hover:scale-110 duration-500'
						/>
					</div>
					<div className='text-5xl font-black text-zinc-100 tracking-tighter'>
						{Math.round(weather.main.temp)}°
					</div>
				</div>

				<div className='grid grid-cols-2 gap-2 border-t border-zinc-800/50 pt-4 w-full'>
					<div className='flex flex-col'>
						<span className='text-zinc-500 text-xs  font-bold tracking-wider'>{dict.humidity}</span>
						<span className='text-sm font-semibold text-zinc-300 flex items-center gap-1.5'>
							<span className='w-1.5 h-1.5 rounded-full bg-blue-500'></span>
							{weather.main.humidity}%
						</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-zinc-500 text-xs  font-bold tracking-wider'>{dict.wind}</span>
						<span className='text-sm font-semibold text-zinc-300 flex items-center gap-1.5'>
							<span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
							{weather.wind?.speed} m/s
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
