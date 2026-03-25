/**
 * @file translate.ts
 * @description Google Translate (GTX) API를 이용하여 텍스트를 무료로 번역하는 기능을 처리하기 위한 유틸리티
 * 한국어(ko)와 일본어(ja)를 주요 대상으로 하며 언어 자동 감지 기능을 활용
 */

import axios from 'axios';
import { toast } from 'sonner';

/**
 * @description 텍스트를 지정된 언어로 번역
 * @param {string} text - 번역할 원본 텍스트
 * @param {string} targetLang - 대상 언어 코드 (ko, ja, en 등)
 * @returns {Promise<string>} 번역된 텍스트
 */
export const translateText = async (
	text: string,
	targetLang: string = 'ko',
): Promise<string> => {
	if (!text.trim()) return '';

	try {
		const encodedText = encodeURIComponent(text);
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodedText}`;
		const response = await axios.get(url);
		const data = response.data;

		if (data && data[0]) {
			const translatedLines = data[0]
				.map((line: string[]) => line[0])
				.join('');
			return translatedLines;
		}

		return text;
	} catch (error) {
		console.error('Translation error:', error);
		toast.error('번역에 실패했습니다.');
		return text;
	}
};
