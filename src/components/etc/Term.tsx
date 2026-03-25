/**
 * @file Term.tsx
 * @description 이용약관 컴포넌트
 * 게시물, 이미지, DM, 개인정보에 관한 약관 내용이 담겨 있음
 */

'use client';

import { useLanguage } from '@/context/LanguageContext';
import { dictionaries } from '@/types/languague';

/**
 * @description 이용약관 컴포넌트. 게시물, 이미지, DM, 개인정보에 관한 약관 내용이 담겨 있음
 * @return {TSX.Element} 이용약관 UI
 */
export default function Term() {
	/**
	 * useLanguage: 현재 사용자의 사용 언어에 따라 이용약관 본문 텍스트를 스위칭하기 위한 컨텍스트 훅
	 */
	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].termComponent;

	return (
		<div className='max-w-3xl mx-auto p-6 text-zinc-50 mt-5 flex flex-col justify-center'>
			<div className='mb-8 border-b pb-4'>
				<p className='text-3xl font-bold text-center mb-4 text-zinc-50'>{dict.termsTitle}</p>
			</div>
			<div>
				<ol className='list-decimal list-outside ml-6 space-y-8'>
					<li className='font-semibold text-lg text-zinc-50'>
						{dict.termsSec1Title}
						<ul className='list-disc list-outside ml-6 mt-3 space-y-2 font-normal text-base text-zinc-400'>
							<li>
								<strong>{dict.termsSec1Item1Title}</strong> {dict.termsSec1Item1Desc}
							</li>
							<li>
								<strong>{dict.termsSec1Item2Title}</strong> {dict.termsSec1Item2Desc}
							</li>
							<li>
								<strong>{dict.termsSec1Item3Title}</strong> {dict.termsSec1Item3Desc}
							</li>
						</ul>
					</li>
					<li className='font-semibold text-lg text-zinc-50'>
						{dict.termsSec2Title}
						<ul className='list-disc list-outside ml-6 mt-3 space-y-2 font-normal text-base text-zinc-400'>
							<li>
								<strong>{dict.termsSec2Item1Title}</strong> {dict.termsSec2Item1Desc}
							</li>
							<li>
								<strong>{dict.termsSec2Item2Title}</strong> {dict.termsSec2Item2Desc}
							</li>
							<li>
								<strong>{dict.termsSec2Item3Title}</strong> {dict.termsSec2Item3Desc}
							</li>
						</ul>
					</li>
					<li className='font-semibold text-lg text-zinc-50'>
						{dict.termsSec3Title}
						<p className='mt-3 font-normal text-base text-zinc-400'>{dict.termsSec3Intro}</p>
						<ul className='list-disc list-outside ml-6 mt-3 space-y-4 font-normal text-base text-zinc-50'>
							<li>
								<strong>{dict.termsSec3Item1Title}</strong>
								<ul className='list-circle list-outside ml-6 mt-2 space-y-1 text-zinc-400'>
									<li>{dict.termsSec3Item1Bullet1}</li>
									<li>{dict.termsSec3Item1Bullet2}</li>
								</ul>
							</li>
							<li>
								<strong>{dict.termsSec3Item2Title}</strong>
								<ul className='list-circle list-outside ml-6 mt-2 space-y-1 text-zinc-400'>
									<li>{dict.termsSec3Item2Bullet1}</li>
									<li>{dict.termsSec3Item2Bullet2}</li>
								</ul>
							</li>
						</ul>
					</li>
					<li className='font-semibold text-lg text-zinc-50'>
						{dict.termsSec4Title}
						<ul className='list-disc list-outside ml-6 mt-3 space-y-2 font-normal text-base text-zinc-400'>
							<li>{dict.termsSec4Desc}</li>
						</ul>
					</li>
				</ol>
			</div>
		</div>
	);
}
