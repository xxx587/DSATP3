/**
 * @file MyPage.tsx
 * @description 회원정보 수정 컴포넌트
 * 사용자로부터 현재 비밀번호, 새 비밀번호를 입력받아 비밀번호 변경을 처리
 * 아이디, 닉네임, 국적, 이메일은 읽기 전용으로 표시
 * 회원탈퇴 및 취소 버튼도 포함
 */

'use client';

import { useMyPageForm } from '@/hooks/useMyPageForm';
import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';
import Skeleton from '@/components/common/Skeleton';

/**
 * @description 회원정보 수정 컴포넌트. useMyPageForm 훅을 사용하여 폼 상태 관리 및 유효성 검사를 수행
 * @return {TSX.Element} 회원정보 수정 폼 UI (수정하기, 회원탈퇴, 취소하기 버튼 포함)
 */
const MyPage = () => {
	/**
	 * useMyPageForm: 마이페이지(회원정보 수정)와 관련된 입력 상태 관리 및 제출 로직을 처리하기 위한 커스텀 훅
	 */
	const {
		userInfo,
		formData,
		errors,
		isPasswordMatch,
		isConfirmEmpty,
		back,
		del,
		handleChange,
		handleSubmit,
	} = useMyPageForm();

	/**
	 * useLanguage: 현재 설정된 언어에 맞춰 다국어 텍스트 데이터를 가져오기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].myPageComponent;

	return (
		<section className='fixed inset-0 flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 px-4 overflow-hidden'>
			{/* 배경 장식 요소 */}
			<div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full' />
			<div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full' />

			<div className='relative w-full max-w-4xl space-y-8 rounded-[40px] bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800/50 p-10 shadow-2xl shadow-emerald-500/5 overflow-y-auto max-h-[90vh] scrollbar-hide'>
				<div className='text-center space-y-2'>
					<p className='text-4xl font-black text-zinc-100 tracking-tight'>{dict.fixUserInfoText}</p>
					<p className='text-s text-zinc-400 font-medium whitespace-pre-wrap'>
						{dict.explainFixUserInfoText}
					</p>
				</div>

				<form className='mt-8 space-y-8' onSubmit={handleSubmit}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
						{/* [왼쪽] 기본 정보 영역 - 읽기 전용 */}
						<div className='space-y-6 bg-zinc-950/20 p-6 rounded-4xl border border-zinc-800/30'>
							<div className='flex items-center gap-3 mb-2 px-1'>
								<div className='w-1.5 h-6 bg-emerald-500 rounded-full' />
								<p className='text-sm font-black text-zinc-100  tracking-[0.2em]'>
									{dict.idText} & {dict.nicknameText}
								</p>
							</div>

							{/* 아이디 */}
							<div className='space-y-2'>
								<label className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'>
									{dict.idText}
								</label>
								<div className='block w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-zinc-400 font-bold'>
									{userInfo.username || <Skeleton className='h-5 w-32' />}
								</div>
							</div>

							{/* 닉네임 */}
							<div className='space-y-2'>
								<label className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'>
									{dict.nicknameText}
								</label>
								<div className='block w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-zinc-400 font-bold'>
									{userInfo.nickname || <Skeleton className='h-5 w-24' />}
								</div>
							</div>

							{/* 국적 및 이메일 */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
								<div className='space-y-2'>
									<label className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'>
										{dict.countryCodeText}
									</label>
									<div className='block w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-zinc-400 font-bold text-sm'>
										{userInfo.countryCode === 1 ? dict.countryCodeKR : dict.countryCodeJP}
									</div>
								</div>
								<div className='space-y-2'>
									<label className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'>
										{dict.emailText}
									</label>
									<div className='block w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-zinc-400 font-bold text-sm truncate'>
										{userInfo.email || <Skeleton className='h-4 w-full' />}
									</div>
								</div>
							</div>
						</div>

						{/* [오른쪽] 비밀번호 변경 영역 */}
						<div className='space-y-6 bg-zinc-950/20 p-6 rounded-[32px] border border-zinc-800/30'>
							<div className='flex items-center gap-3 mb-2 px-1'>
								<div className='w-1.5 h-6 bg-blue-500 rounded-full' />
								<p className='text-sm font-black text-zinc-100  tracking-[0.2em]'>
									{dict.newPasswordText}
								</p>
							</div>

							{/* 기존 비밀번호 */}
							<div className='space-y-2'>
								<label
									htmlFor='currentPassword'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.currentPasswordText}
								</label>
								<input
									id='currentPassword'
									name='currentPassword'
									type='password'
									required
									value={formData.currentPassword}
									onChange={handleChange}
									className='block w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-zinc-100 placeholder-zinc-700 focus:border-blue-500/50 focus:outline-none focus:ring-8 focus:ring-blue-500/5 transition-all duration-300 font-bold'
									placeholder={dict.passwordRegexPlaceholder}
								/>
							</div>

							{/* 새 비밀번호 */}
							<div className='space-y-2'>
								<label
									htmlFor='newPassword'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.newPasswordText}
								</label>
								<input
									id='newPassword'
									name='newPassword'
									type='password'
									required
									value={formData.newPassword}
									onChange={handleChange}
									className={`block w-full rounded-2xl border bg-zinc-950/50 px-5 py-4 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-8 transition-all duration-300 font-bold
                                        ${errors.newPassword ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5' : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/5'}`}
									placeholder={dict.passwordRegexPlaceholder}
								/>
								{errors.newPassword && (
									<p className='mt-1 text-xs font-bold text-red-400 ml-1'>{errors.newPassword}</p>
								)}
							</div>

							{/* 새 비밀번호 확인 */}
							<div className='space-y-2'>
								<label
									htmlFor='passwordConfirm'
									className='block text-sm font-black text-zinc-500  tracking-[0.2em] ml-1'
								>
									{dict.newPasswordConfirmText}
								</label>
								<input
									id='passwordConfirm'
									name='passwordConfirm'
									type='password'
									required
									value={formData.passwordConfirm}
									onChange={handleChange}
									className={`block w-full rounded-2xl border bg-zinc-950/50 px-5 py-4 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-8 transition-all duration-300 font-bold
                                        ${
											(!isConfirmEmpty && !isPasswordMatch) || errors.passwordConfirm
												? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5'
												: 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/5'
										}`}
									placeholder={dict.newPasswordConfirmPlaceholder}
								/>
								{!isConfirmEmpty && (
									<p
										className={`mt-1 text-xs font-bold ml-1 ${isPasswordMatch ? 'text-emerald-400' : 'text-red-400'}`}
									>
										{isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
									</p>
								)}
								{errors.passwordConfirm && !(!isConfirmEmpty && !isPasswordMatch) && (
									<p className='mt-1 text-xs font-bold text-red-400 ml-1'>
										{errors.passwordConfirm}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* 버튼 영역 */}
					<div className='flex flex-col md:flex-row gap-4 pt-6 border-t border-zinc-800/50'>
						<button
							type='submit'
							className='flex-1 rounded-2xl bg-emerald-500 py-5 text-base font-black text-emerald-950 hover:bg-emerald-400 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20'
						>
							{dict.confirmFix}
						</button>
						<div className='flex gap-4 md:w-2/5'>
							<button
								type='button'
								onClick={back}
								className='flex-1 rounded-2xl bg-zinc-800 py-5 text-sm font-black text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-all active:scale-[0.98]'
							>
								{dict.cancel}
							</button>
							<button
								type='button'
								onClick={del}
								className='flex-1 rounded-2xl bg-red-500/10 py-5 text-sm font-black text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-[0.98]'
							>
								{dict.deleteAccount}
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};

export default MyPage;
