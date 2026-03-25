/**
 * @file axios.ts
 * @description Axios 인스턴스 설정 및 인터셉터
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export interface ApiErrorResponse {
	status: number;
	code: string;
	message: string;
	timestamp: string;
	path: string;
}

/**
 * @description API 요청 설정 인터페이스에 메타데이터(시작 시간)를 추가하기 위한 확장 인터페이스
 */
interface CustomRequestConfig extends InternalAxiosRequestConfig {
	metadata?: {
		startTime: Date;
	};
}

/**
 * @description Axios 인스턴스 생성. 백엔드 API 기본 URL과 쿠키 전송 설정을 포함
 *              환경변수 NEXT_PUBLIC_API_URL이 없으면 로컬 개발 서버 URL을 사용
 * @return {AxiosInstance} 설정된 Axios 인스턴스
 */
export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/ottaku/api',
	withCredentials: true,
});

/**
 * @description 요청 인터셉터. 모든 API 요청 전에 실행되어
 *              js-cookie에서 access_token을 꺼내 Authorization 헤더에 Bearer 토큰으로 삽입
 *              토큰이 없으면 헤더를 추가하지 않고 요청을 그대로 전송
 * @param {InternalAxiosRequestConfig} config - Axios 요청 설정 객체
 * @return {InternalAxiosRequestConfig} 토큰이 삽입된 요청 설정 객체
 */
api.interceptors.request.use(
	(config) => {
		const request = config as CustomRequestConfig;
		const token = Cookies.get('access_token');
		if (token) {
			request.headers['Authorization'] = `Bearer ${token}`;
		}

		request.metadata = { startTime: new Date() };

		console.log('=== API REQUEST ===', {
			fullUrl: (request.baseURL || '') + (request.url || ''),
			method: request.method,
			headers: request.headers,
			data: request.data,
			params: request.params,
		});
		return request;
	},
	(error) => {
		return Promise.reject(error);
	},
);

/**
 * @description API 응답 인터셉터.
 * 성공한 응답은 그대로 반환하고, 에러 발생 시 컴포넌트에서
 * HTTP 상태 코드별로 직관적인 예외 처리를 할 수 있도록 에러 정보를 가공하여 전달
 * @param {AxiosResponse} response - 성공 응답 객체 (그대로 반환)
 * @param {AxiosError<ApiErrorResponse>} error - 에러 응답 객체
 * @return {Promise<{status: number, data: any}>} 호출부에서 status를 바로 추출할 수 있도록 객체 형태로 reject
 */
api.interceptors.response.use(
	(response) => {
		const config = response.config as CustomRequestConfig;
		const startTime = config.metadata?.startTime;
		const duration = startTime ? `${new Date().getTime() - startTime.getTime()}ms` : '모름';

		console.log('=== API RESPONSE ===', {
			data: response.data,
			status: response.status,
			headers: response.headers,
			duration,
		});
		return response;
	},
	(error: AxiosError<ApiErrorResponse>) => {
		const config = error.config as CustomRequestConfig | undefined;
		const startTime = config?.metadata?.startTime;
		const duration = startTime ? `${new Date().getTime() - startTime.getTime()}ms` : '모름';

		if (error.response) {
			console.log('=== API ERROR RESPONSE ===', {
				data: error.response.data,
				status: error.response.status,
				headers: error.response.headers,
				duration,
			});
		} else {
			console.log('=== API NETWORK ERROR ===', {
				message: error.message,
				duration,
				config: error.config,
			});
		}
		return Promise.reject(error);
	},
);
