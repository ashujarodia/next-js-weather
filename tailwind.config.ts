import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				green10: '#E3FEF7',
				green20: '#77B0AA',
				green30: '#135D66',
				green40: '#003C43',
			},
			fontFamily: {
				nunito: 'Nunito',
			},
		},
	},
	plugins: [],
};
export default config;
