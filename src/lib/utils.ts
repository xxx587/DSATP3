/**
 * @file utils.ts
 * @description Tailwind CSS 클래스 병합 유틸리티
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description 여러 개의 클래스명을 입력받아 중복을 제거하고 조건부 클래스를 처리하며,
 *              Tailwind CSS의 우선순위에 따라 클래스를 안전하게 병합하는 함수
 * @param {ClassValue[]} inputs - 병합할 클래스명 또는 조건부 클래스 객체 배열
 * @returns {string} 최후로 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
