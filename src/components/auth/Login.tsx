/**
 * @file Login.tsx
 * @description 로그인 페이지 컴포넌트
 * 사용자 아이디와 비밀번호를 입력받아 로그인을 처리
 * 로그인 성공 시 JWT 토큰을 쿠키에 저장하고 메인 페이지로 리다이렉트
 * 회원가입 페이지로의 네비게이션 링크 포함
 */

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/types/login';
import { loginFormRequest } from '@/app/api/user';
import Cookies from 'js-cookie';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 로그인 페이지 컴포넌트. 아이디/비밀번호 입력 폼과 로그인 처리 로직을 포함
 * @return {TSX.Element} 로그인 폼 UI
 */
const Login = () => {
	/**
	 * useRouter: Next.js의 라우팅 기능을 제어하여 로그인 성공 후 페이지 이동을 처리하기 위한 훅
	 */
	const router = useRouter();

	/**
	 * useLanguage: 현재 설정된 언어를 가져와 다국어 텍스트를 렌더링하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].loginComponent;

	/**
	 * useState: 컴포넌트 내에서 변경되는 유저의 입력 폼 데이터를 상태로 관리하기 위한 훅
	 * username과 password 필드를 초기값 빈 문자열로 설정하여 관리함
	 */
	const [formData, setFormData] = useState<LoginForm>({
		username: '',
		password: '',
	});

	/**
	 * @description 입력 필드(아이디, 비밀번호)의 값이 변경될 때마다 호출되어 상태를 동기화하기 위한 핸들러 함수
	 * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 변경 이벤트 객체
	 * useCallback: 불필요한 함수 재생성을 방지하여 렌더링 성능을 최적화하기 위한 훅
	 */
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }) as LoginForm);
	}, []);

	/**
	 * @description 폼 제출 시 서버에 로그인 요청을 보내고 인증 토큰을 처리하기 위한 비동기 핸들러 함수
	 * @param {React.FormEvent} e - 폼 제출 이벤트 객체
	 * useCallback: 폼 데이터와 라우터 의존성을 바탕으로 제출 로직을 메모이제이션하기 위한 훅
	 */
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			//폼 제출 후 새로고침 막기
			e.preventDefault();

			try {
				//로그인 API 호출 로직 추가
				const response: string = await loginFormRequest(formData);
				Cookies.set('access_token', response, { expires: 1 / 24 });
				toast.success(dict.successLoginToast);
				router.refresh();
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					const status = error.response.status;

					if (status === 401) {
						console.error(error.response);
						toast.error(dict.diffIdPasswordToast);
					} else {
						console.error(error.response);
						toast.error(dict.loginErrorToast);
					}
				}
			}
		},
		[formData, router, dict],
	);

	return (
		<section className='fixed inset-0 flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 px-4 overflow-hidden'>
			<div className='relative w-full max-w-md space-y-8 rounded-3xl bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800/50 p-10 shadow-2xl shadow-emerald-500/5'>
				{/* 상단 설명 */}
				<div className='text-center space-y-2'>
					<p className='text-4xl font-black text-zinc-100 tracking-tight'>{dict.loginText}</p>
					<p className='text-sm text-zinc-400 font-medium'>{dict.explainLoginText}</p>
				</div>

				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='space-y-4'>
						{/* 아이디 */}
						<div className='space-y-1.5'>
							<label
								htmlFor='username'
								className='block text-sm font-bold text-zinc-500  tracking-widest ml-1'
							>
								{dict.idText}
							</label>
							<div className='relative group'>
								<input
									id='username'
									name='username'
									type='text'
									required
									value={formData.username}
									onChange={handleChange}
									className='block w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300'
									placeholder={dict.idPlaceholder}
								/>
							</div>
						</div>

						{/* 비밀번호 */}
						<div className='space-y-1.5'>
							<label
								htmlFor='password'
								className='block text-sm font-bold text-zinc-500  tracking-widest ml-1'
							>
								{dict.passwordText}
							</label>
							<div className='relative group'>
								<input
									id='password'
									name='password'
									type='password'
									required
									value={formData.password}
									onChange={handleChange}
									className='block w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300'
									placeholder={dict.passwordPlaceholder}
								/>
							</div>
						</div>
					</div>

					{/* 로그인 버튼 */}
					<div className='pt-2'>
						<button
							type='submit'
							className='group relative flex w-full justify-center rounded-xl bg-emerald-500 px-4 py-4 text-sm font-bold text-emerald-950 hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 active:scale-[0.98]'
						>
							{dict.loginText}
						</button>
					</div>
				</form>

				<div className='text-center'>
					<p className='text-sm text-zinc-500 font-medium'>
						{dict.haveNotAccount}{' '}
						<Link
							href='/register'
							className='text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4 decoration-2 decoration-emerald-500/30 hover:decoration-emerald-500/60 transition-all'
						>
							{dict.registerText}
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default Login;
