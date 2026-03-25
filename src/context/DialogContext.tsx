'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from './LanguageContext';
import { dictionaries } from '@/types/languague';

interface DialogContextType {
	confirm: (message: string, title?: string) => Promise<boolean>;
	prompt: (message: string, title?: string, defaultValue?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error('useDialog must be used within a DialogProvider');
	}
	return context;
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
	/**
	 * useState: 확인창(confirm)의 노출 여부 및 메시지, 콜백 함수(resolve)를 상태로 관리하기 위한 훅
	 */
	const [confirmState, setConfirmState] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		resolve: (value: boolean) => void;
	} | null>(null);

	/**
	 * useState: 입력창(prompt)의 노출 여부 및 메시지, 콜백 함수를 상태로 관리하기 위한 훅
	 */
	const [promptState, setPromptState] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		defaultValue: string;
		resolve: (value: string | null) => void;
	} | null>(null);

	/**
	 * useState: 입력창(prompt)에 입력 중인 텍스트를 실시간으로 관리하기 위한 훅
	 */
	const [promptValue, setPromptValue] = useState('');

	/**
	 * useCallback: 확인창을 띄우는 함수로, 불필요한 리렌더링 시 함수 재생성을 방지하기 위한 훅
	 */
	const confirm = useCallback((message: string, title?: string) => {
		return new Promise<boolean>((resolve) => {
			setConfirmState({
				isOpen: true,
				title: title || '',
				message,
				resolve,
			});
		});
	}, []);

	const prompt = useCallback((message: string, title?: string, defaultValue: string = '') => {
		setPromptValue(defaultValue);
		return new Promise<string | null>((resolve) => {
			setPromptState({
				isOpen: true,
				title: title || '',
				message,
				defaultValue,
				resolve,
			});
		});
	}, []);

	const handleConfirmClose = (value: boolean) => {
		if (confirmState) {
			confirmState.resolve(value);
			setConfirmState(null);
		}
	};

	const handlePromptClose = (value: string | null) => {
		if (promptState) {
			promptState.resolve(value);
			setPromptState(null);
		}
	};

	const { currentLang } = useLanguage();
	const dict = dictionaries[currentLang].shadcnDialog;

	return (
		<DialogContext.Provider value={{ confirm, prompt }}>
			{children}
			{confirmState && (
				<AlertDialog open={confirmState.isOpen} onOpenChange={(open) => !open && handleConfirmClose(false)}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{confirmState.title || dict.confirm}</AlertDialogTitle>
							<AlertDialogDescription>{confirmState.message}</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => handleConfirmClose(false)}>
								{dict.cancel}
							</AlertDialogCancel>
							<AlertDialogAction onClick={() => handleConfirmClose(true)}>
								{dict.confirm}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}

			{promptState && (
				<Dialog open={promptState.isOpen} onOpenChange={(open) => !open && handlePromptClose(null)}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{promptState.title || dict.confirm}</DialogTitle>
							<DialogDescription>{promptState.message}</DialogDescription>
						</DialogHeader>
						<div className='py-1'>
							<Input
								value={promptValue}
								onChange={(e) => setPromptValue(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handlePromptClose(promptValue);
									}
								}}
								autoFocus
							/>
						</div>
						<DialogFooter>
							<Button variant='outline' onClick={() => handlePromptClose(null)}>
								{dict.cancel}
							</Button>
							<Button onClick={() => handlePromptClose(promptValue)}>{dict.confirm}</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</DialogContext.Provider>
	);
};
