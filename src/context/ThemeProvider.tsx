/**
 * @file ThemeProvider.tsx
 * @description 전역 테마(Dark/Light) 관리를 위한 Provider 컴포넌트
 */
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
