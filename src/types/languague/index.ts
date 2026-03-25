/**
 * @file index.ts
 * @description 다국어 사전(Dictionaries)을 통합하여 관리하고 내보내기 위한 파일
 */
import { ko } from './ko';
import { ja } from './ja';
import { Dictionary } from './lang';

export interface Dictionaries {
	ko: Dictionary;
	ja: Dictionary;
}

export const dictionaries: Dictionaries = {
	ko,
	ja,
};
