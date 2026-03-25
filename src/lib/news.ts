/**
 * @file news.ts
 * @description 외부 패션 뉴스 RSS 피드를 가져와 파싱하는 기능을 처리하기 위한 유틸리티
 */

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface RawRssItem {
	title?: string;
	link?: string;
	description?: string;
	pubDate?: string;
	image?: string;
	[key: string]: unknown;
}

/**
 * @description 한국 패션 뉴스 RSS 피드 크롤링 함수
 *              koreafashionnews.com의 RSS를 파싱하여 최대 13개의 뉴스 항목을 반환
 *              각 항목의 description에서 img 태그를 정규식으로 추출하여 이미지 URL을 파싱
 * @return {Promise<Array<{title: string, link: string, pubDate: string, image: string, source: string}>>} 파싱된 뉴스 항목 배열 (에러 시 빈 배열)
 */
export async function getKrNews() {
	const RSS_URL = 'http://www.koreafashionnews.com/rss/rss_news.php';
	try {
		const response = await axios.get(RSS_URL);
		const parser = new XMLParser();
		const jsonObj = parser.parse(response.data);

		const items = jsonObj.rss?.channel?.item || [];
		const normalizedItems = Array.isArray(items) ? items : [items];

		return normalizedItems.slice(0, 12).map((item: RawRssItem) => {
			let extractedImage = '';
			if (item.description) {
				const imgMatch = String(item.description).match(/<img[^>]+src="([^">]+)"/);
				if (imgMatch && imgMatch[1]) {
					extractedImage = imgMatch[1];
				}
			}
			return {
				title: typeof item.title === 'string' ? item.title.trim() : '',
				link: item.link || '',
				pubDate: item.pubDate || '',
				image: extractedImage,
				source: 'koreafashionnews.com',
			};
		});
	} catch (error) {
		console.error('KR RSS 에러', error);
		return [];
	}
}

/**
 * @description 일본 패션 뉴스 RSS 피드 크롤링 함수.
 *              Yahoo Japan 패션 뉴스 RSS를 파싱하여 최대 13개의 뉴스 항목을 반환
 *              이미지는 RSS item의 image 필드에서 직접 가져옴
 * @return {Promise<Array<{title: string, link: string, pubDate: string, image: string, source: string}>>} 파싱된 뉴스 항목 배열 (에러 시 빈 배열)
 */
export async function getJpNews() {
	const RSS_URL = 'https://news.yahoo.co.jp/rss/media/fashions/all.xml';
	try {
		const response = await axios.get(RSS_URL);
		const parser = new XMLParser();
		const jsonObj = parser.parse(response.data);

		const items = jsonObj.rss?.channel?.item || [];
		const normalizedItems = Array.isArray(items) ? items : [items];

		return normalizedItems.slice(0, 12).map((item: RawRssItem) => {
			return {
				title: typeof item.title === 'string' ? item.title.trim() : '',
				link: item.link || '',
				pubDate: item.pubDate || '',
				image: item.image || '',
				source: 'news.yahoo.co.jp',
			};
		});
	} catch (error) {
		console.error('JP RSS 에러', error);
		return [];
	}
}
