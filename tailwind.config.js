export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./app/**/*.{js,jsx}",
		"./src/**/*.{js,jsx}",
	],
	prefix: "",
	theme: {
		screens: {
			'xs': '480px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				premium: {
					light: '#F0F3FF',
					DEFAULT: '#3E63DD',
					dark: '#1D39A4',
				},
				note: {
					yellow: '#FFF8E6',
					green: '#F0FFF4',
					blue: '#EBF8FF',
					purple: '#FAF5FF',
					pink: '#FFF5F7',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' },
				},
				'bounce-x': {
					'0%, 100%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(5px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'bounce-x': 'bounce-x 1.5s infinite ease-in-out',
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
				'blur-sm': 'blur(4px)',
				'blur-md': 'blur(12px)',
				'blur-lg': 'blur(16px)',
				'blur-xl': 'blur(24px)',
				'blur-2xl': 'blur(40px)',
				'blur-3xl': 'blur(64px)',
			},
			boxShadow: {
				'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
				'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.25)',
				'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
				'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addBase, addComponents, theme }) {
			addBase({
				'.dark': {
					'--shadow-color': '0deg 0% 0%',
					'--shadow-elevation-low': 
						'0px 0.5px 0.6px hsl(var(--shadow-color) / 0.34), 0px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34), 0px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34)',
					'--shadow-elevation-medium': 
						'0px 0.5px 0.6px hsl(var(--shadow-color) / 0.36), 0px 1.8px 2.3px -0.8px hsl(var(--shadow-color) / 0.36), 0px 4.5px 5.6px -1.7px hsl(var(--shadow-color) / 0.36), 0px 11px 13.7px -2.5px hsl(var(--shadow-color) / 0.36)',
					'--shadow-elevation-high': 
						'0px 0.5px 0.6px hsl(var(--shadow-color) / 0.34), 0px 3.3px 4.1px -0.4px hsl(var(--shadow-color) / 0.34), 0px 6.2px 7.7px -0.7px hsl(var(--shadow-color) / 0.34), 0px 10.1px 12.6px -1.1px hsl(var(--shadow-color) / 0.34), 0px 16.3px 20.3px -1.4px hsl(var(--shadow-color) / 0.34), 0px 25.6px 31.9px -1.8px hsl(var(--shadow-color) / 0.34), 0px 38.6px 48.1px -2.1px hsl(var(--shadow-color) / 0.34), 0px 56.3px 70.2px -2.5px hsl(var(--shadow-color) / 0.34)',
				}
			});
			
			addComponents({
				'.shadow-dark-elevation-low': {
					boxShadow: 'var(--shadow-elevation-low)',
				},
				'.shadow-dark-elevation-medium': {
					boxShadow: 'var(--shadow-elevation-medium)',
				},
				'.shadow-dark-elevation-high': {
					boxShadow: 'var(--shadow-elevation-high)',
				},
			});
		}
	],
}
