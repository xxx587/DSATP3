/**
 * @file route.ts
 * @description 프리셋 캡처 기능을 제공하는 API 라우트 핸들러
 * 특정 프리셋 구성을 이미지(PNG)로 변환하기 위해 서버 사이드 브라우징(Puppeteer)을 수행함
 */

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

/**
 * @description 프리셋 구성을 이미지로 캡처하는 API Route
 * Puppeteer를 사용하여 서버 사이드에서 컴포넌트를 렌더링하고 스크린샷을 찍음
 */
export async function GET(request: NextRequest) {
	// 요청 URL에서 presetId 추출
	const { searchParams } = new URL(request.url);
	const presetId = searchParams.get('presetId');

	// 프리셋 ID가 없으면 처리를 중단하고 400 에러 반환
	if (!presetId) {
		return NextResponse.json({ error: '프리셋 id 없음' }, { status: 400 });
	}

	// 쿠키(access_token)를 가져옴
	const accessToken = request.cookies.get('access_token')?.value;

	let browser;
	try {
		// 개발 환경인지 배포 환경인지 확인(Vercel 배포를 우리가 하려나...?)
		const isLocal = process.env.NODE_ENV === 'development';

		// @sparticuz/chromium 라이브러리의 인스턴스를 다루기 위한 타입 정의
		// 이 라이브러리는 서버리스 환경(Vercel 등)에서 실행 가능한 경량 크롬을 제공함
		interface Chromium {
			args: string[];
			executablePath(): Promise<string>;
			headless: boolean | 'shell' | undefined;
		}
		const chromiumInstance = chromium as unknown as Chromium;

		// Puppeteer 실행 옵션(Launch Options) 설정
		const launchOptions = {
			// args: 브라우저 실행 시 전달할 명령줄 인자들
			// 로컬에서는 보안 샌드박스를 끄고 불필요한 기능을 비활성화하여 속도 향상
			args: isLocal
				? ['--no-sandbox', '--disable-setuid-sandbox', '--no-first-run', '--disable-extensions']
				: chromiumInstance.args,
			// 스크린샷 결과물의 해상도와 관련 있는 뷰포트 크기 설정
			defaultViewport: { width: 1200, height: 1600 },
			// executablePath: 실제 크롬 실행 파일이 있는 경로
			// 로컬 환경은 MS Edge를 사용하고, 서버는 sparticuz/chromium이 추출한 경로 사용
			executablePath: isLocal
				? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
				: await chromiumInstance.executablePath(),
			// headless: 브라우저 창을 숨겨서 실행할지 여부 (false로 하면 로컬 환경에서 창이 나옴)
			headless: isLocal ? true : chromiumInstance.headless,
		};

		// 가상 브라우저 실행
		browser = await puppeteer.launch(launchOptions);
		const page = await browser.newPage();

		// 현재 서버의 호스트 주소를 동적으로 파악
		// Proxy 뒤에서 실행될 경우를 대비해 'x-forwarded-proto' 등을 참조함
		const protocol = request.headers.get('x-forwarded-proto') || 'http';
		const host = request.headers.get('host') || 'localhost:3000';
		const baseUrl = `${protocol}://${host}`;

		// 가상 브라우저에 유저의 세션 쿠키 주입
		if (accessToken) {
			const domain = new URL(baseUrl).hostname;
			await page.setCookie({
				name: 'access_token',
				value: accessToken,
				domain: domain,
				path: '/',
				httpOnly: false,
			});
			console.log('쿠키 주입 완료');
		}

		// 캡처 대상이 될 전용 페이지 URL 생성 및 이동
		const targetUrl = `${baseUrl}/capture/preset/${presetId}`;
		console.log('가상 브라우저 이동:', targetUrl);

		await page.goto(targetUrl, {
			waitUntil: 'networkidle0', // 네트워크 활동이 500ms 동안 없을 때까지 기다림
			timeout: 10000, // 최대 10초 대기
		});

		// 동적 이미지 로딩 대기
		// 캡처 페이지 내부의 이미지 로드가 끝났다고 판단하면
		// 특정 요소의 속성을 data-loaded="true"로 바꾸는데 Puppeteer는 true가 될 때까지 대기
		console.log('true 전환 대기');
		const element = await page.waitForSelector('#capture-target[data-loaded="true"]', { timeout: 10000 });
		if (!element) {
			throw new Error('캡처 대상 요소를 찾을 수 없습니다.');
		}

		// 스크린샷 실행
		const buffer = await element.screenshot({
			type: 'png',
			omitBackground: true, // 브라우저 배경을 투명하게 처리
		});

		// 브라우저 닫기
		await browser.close();

		// 성공 응답 반환 및 캐싱 방지 헤더 설정
		return new Response(buffer as unknown as BodyInit, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
				Pragma: 'no-cache',
				Expires: '0',
			},
		});
	} catch (error: unknown) {
		// 예외 발생 시 에러 로깅 및 브라우저 강제 종료
		console.error(error);
		if (browser) await browser.close();

		const errorMessage = error instanceof Error ? error.message : '캡쳐하는데 서버에서 에러 생김';
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
