/**
 * @file Register.tsx
 * @description 회원가입 컴포넌트
 * 사용자로부터 아이디, 비밀번호, 닉네임, 국적, 이메일을 입력받고
 * 각 필드에 대한 유효성 검사(정규식) 및 중복 확인(서버 API)을 수행
 * 모든 유효성 검사 통과 시 회원가입 요청을 서버에 전송
 */

'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
import { useRegisterForm } from '@/hooks/useRegisterForm';

import { ChevronDown, Check } from 'lucide-react';

/**
 * @description 회원가입 컴포넌트. useRegisterForm 훅을 사용하여 폼 상태 관리, 유효성 검사, 중복 확인을 수행
 * @return {TSX.Element} 회원가입 폼 UI (아이디/비밀번호/닉네임/국적/이메일 입력 필드, 중복확인 버튼, 가입 버튼 포함)
 */
const Register = () => {
	/**
	 * useRegisterForm: 회원가입 폼의 입력 데이터, 중복 확인 상태, 제출 로직을 통합적으로 관리하기 위한 커스텀 훅
	 */
	const {
		formData,
		errors,
		isPasswordMatch,
		isConfirmEmpty,
		handleChange,
		handleCheckUsername,
		handleCheckNickname,
		handleCheckEmail,
		handleSubmit,
	} = useRegisterForm();

	/**
	 * useLanguage: 현재 선택된 언어에 대응하는 사전(Dictionary) 데이터를 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].registerComponent;

	return (
		<section className='fixed inset-0 flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 px-4 overflow-hidden'>
			{/* 배경 장식 요소 */}
			<div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full' />
			<div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full' />

			<div className='relative w-full max-w-5xl space-y-8 rounded-[40px] bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800/50 p-10 shadow-2xl shadow-emerald-500/5 overflow-y-auto max-h-[90vh] scrollbar-hide'>
				{/* 상단 설명 */}
				<div className='text-center space-y-2'>
					<p className='text-4xl font-black text-zinc-100 tracking-tight'>{dict.registerText}</p>
					<div className='text-sm text-zinc-400 font-medium'>
						<p>
							{dict.explainRegisterText1} {dict.explainRegisterText2}
						</p>
					</div>
				</div>

				<form className='mt-8' onSubmit={handleSubmit}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
						{/* [왼쪽] 계정 정보 영역 */}
						<div className='space-y-6 bg-zinc-950/20 p-6 rounded-[32px] border border-zinc-800/30'>
							{/* 아이디 필드 */}
							<div className='space-y-2'>
								<label
									htmlFor='username'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.idText}
								</label>
								<div className='flex gap-2'>
									<input
										id='username'
										name='username'
										type='text'
										required
										value={formData.username}
										onChange={handleChange}
										className={`block w-full rounded-2xl border bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-8 transition-all duration-300 font-bold
                                        ${errors.username ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5' : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/5'}`}
										placeholder={dict.idPlaceholder}
									/>
									<button
										type='button'
										onClick={handleCheckUsername}
										className='whitespace-nowrap rounded-2xl bg-zinc-800 px-6 text-xs font-black text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-all active:scale-95 shadow-lg'
									>
										{dict.duplicateButton}
									</button>
								</div>
								{/* {errors.username && (
									<p className='mt-1 text-sm font-bold text-red-400 ml-1'>{errors.username}</p>
								)} */}
								{/* {!errors.username && successMsg.username && (
									<p className='mt-1 text-sm font-bold text-emerald-400 ml-1'>
										{successMsg.username}
									</p>
								)} */}
							</div>

							{/* 닉네임 필드 */}
							<div className='space-y-2'>
								<label
									htmlFor='nickname'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.nicknameText}
								</label>
								<div className='flex gap-2'>
									<input
										id='nickname'
										name='nickname'
										type='text'
										required
										value={formData.nickname}
										onChange={handleChange}
										className={`block w-full rounded-2xl border bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-8 transition-all duration-300 font-bold
                                        ${errors.nickname ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5' : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/5'}`}
										placeholder={dict.nicknamePlaceholder}
									/>
									<button
										type='button'
										onClick={handleCheckNickname}
										className='whitespace-nowrap rounded-2xl bg-zinc-800 px-6 text-xs font-black text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-all active:scale-95 shadow-lg'
									>
										{dict.duplicateButton}
									</button>
								</div>
								{/* {errors.nickname && (
									<p className='mt-1 text-sm font-bold text-red-400 ml-1'>{errors.nickname}</p>
								)}
								{!errors.nickname && successMsg.nickname && (
									<p className='mt-1 text-sm font-bold text-emerald-400 ml-1'>
										{successMsg.nickname}
									</p>
								)} */}
							</div>

							{/* 이메일 필드 */}
							<div className='space-y-2'>
								<label
									htmlFor='email'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.emailText}
								</label>
								<div className='flex gap-2'>
									<input
										id='email'
										name='email'
										type='email'
										required
										value={formData.email}
										onChange={handleChange}
										className={`block w-full rounded-2xl border bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-8 transition-all duration-300 font-bold
                                        ${errors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5' : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/5'}`}
										placeholder={dict.emailPlaceholder}
									/>
									<button
										type='button'
										onClick={handleCheckEmail}
										className='whitespace-nowrap rounded-2xl bg-zinc-800 px-6 text-xs font-black text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-all active:scale-95 shadow-lg'
									>
										{dict.duplicateButton}
									</button>
								</div>
								{/* {errors.email && (
									<p className='mt-1 text-sm font-bold text-red-400 ml-1'>{errors.email}</p>
								)}
								{!errors.email && successMsg.email && (
									<p className='mt-1 text-sm font-bold text-emerald-400 ml-1'>{successMsg.email}</p>
								)} */}
							</div>
						</div>

						{/* [오른쪽] 보안 및 설정 영역 */}
						<div className='space-y-6 bg-zinc-950/20 p-6 rounded-[32px] border border-zinc-800/30'>
							{/* 비밀번호 필드 */}
							<div className='space-y-2'>
								<label
									htmlFor='password'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.passwordText}
								</label>
								<input
									id='password'
									name='password'
									type='password'
									required
									value={formData.password}
									onChange={handleChange}
									className={`block w-full rounded-2xl border bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-8 transition-all duration-300 font-bold
                                        ${errors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5' : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/5'}`}
									placeholder={dict.passwordRegexPlaceholder}
								/>
								{/* {errors.password && (
									<p className='mt-1 text-sm font-bold text-red-400 ml-1'>{errors.password}</p>
								)} */}
							</div>

							{/* 비밀번호 확인 필드 */}
							<div className='space-y-2'>
								<label
									htmlFor='passwordConfirm'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.passwordConfirmText}
								</label>
								<input
									id='passwordConfirm'
									name='passwordConfirm'
									type='password'
									required
									value={formData.passwordConfirm}
									onChange={handleChange}
									className={`block w-full rounded-2xl border bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-8 transition-all duration-300 font-bold
                                        ${
											(!isConfirmEmpty && !isPasswordMatch) || errors.passwordConfirm
												? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5'
												: 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/5'
										}`}
									placeholder={dict.passwordConfirmPlaceholder}
								/>
								{!isConfirmEmpty && (
									<p
										className={`mt-1 text-sm font-bold ml-1 ${isPasswordMatch ? 'text-emerald-400' : 'text-red-400'}`}
									>
										{isPasswordMatch ? dict.matchPassword : dict.isNotMatchPassword}
									</p>
								)}
								{/* {errors.passwordConfirm && !(!isConfirmEmpty && !isPasswordMatch) && (
									<p className='mt-1 text-sm font-bold text-red-400 ml-1'>{errors.passwordConfirm}</p>
								)} */}
							</div>

							{/* 국적 필드 */}
							<div className='space-y-2'>
								<label
									htmlFor='countryCode'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.countryCodeText}
								</label>
								<div className='relative'>
									<select
										id='countryCode'
										name='countryCode'
										value={formData.countryCode}
										onChange={handleChange}
										className='block w-full appearance-none rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-3.5 text-zinc-100 focus:border-emerald-500/50 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all duration-300 font-bold'
									>
										<option value={1}>{dict.countryCodeKR}</option>
										<option value={2}>{dict.countryCodeJP}</option>
									</select>
									<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500'>
										<ChevronDown className='h-4 w-4' />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 하단 동의 및 가입 버튼 영역 */}
					<div className='mt-10 space-y-6 border-t border-zinc-800/50 pt-8'>
						<div className='flex items-center justify-center gap-6'>
							<Link
								href={'/term'}
								target='blank'
								rel='noopener noreferrer'
								className='text-xs font-black text-emerald-500 hover:text-emerald-400 transition-colors  tracking-widest'
							>
								{dict.termText}
							</Link>
							<label htmlFor='term' className='flex items-center gap-3 cursor-pointer group'>
								<div className='relative'>
									<input required type='checkbox' id='term' className='peer sr-only' />
									<div className='h-5 w-5 rounded-md border-2 border-zinc-700 bg-zinc-950 transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-500' />
									<Check
										className='absolute left-1 top-1 h-3 w-3 text-emerald-950 opacity-0 transition-opacity peer-checked:opacity-100'
										strokeWidth={4}
									/>
								</div>
								{/* <span className='text-xs font-black text-zinc-500 group-hover:text-zinc-300 transition-colors'>
									{dict.termAgree}
								</span> */}
							</label>
						</div>

						<div className='flex flex-col items-center gap-6'>
							<button
								type='submit'
								id='registerButton'
								className='w-full max-w-sm rounded-[24px] bg-emerald-500 py-5 text-base font-black text-emerald-950 hover:bg-emerald-400 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] shadow-2xl shadow-emerald-500/20'
							>
								{dict.registerText}
							</button>

							<p className='text-xs font-black text-zinc-500  tracking-widest'>
								{dict.isHaveAccount}{' '}
								<Link
									href='/login'
									className='text-emerald-500 hover:text-emerald-400 transition-all ml-1'
								>
									{dict.goLogin}
								</Link>
							</p>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};

export default Register;
