const config = {
	content: ['./src/**/*.{tsx}'],
	theme: {
		extend: {
			fontfamily: {
				sans: ['var(--font-noto-kr)', 'var(--font-noto-jp)', 'sans-serif'],
			},
		},
	},
	plugins: {
		'@tailwindcss/postcss': {},
	},
};

export default config;
