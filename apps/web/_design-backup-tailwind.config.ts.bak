import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f3f5eb',
          100: '#e3e8d1',
          200: '#c9d4a6',
          300: '#a9bb72',
          400: '#8aa049',
          500: '#5c6d28',   /* primary — rgb(92,109,40) */
          600: '#4e5d22',
          700: '#3d481b',
          800: '#2e3615',
          900: '#232910',
          950: '#141807',
        },
        /* Map Tailwind emerald → brand so emerald-* classes auto-use brand color */
        emerald: {
          50:  '#f3f5eb',
          100: '#e3e8d1',
          200: '#c9d4a6',
          300: '#a9bb72',
          400: '#8aa049',
          500: '#5c6d28',
          600: '#4e5d22',
          700: '#3d481b',
          800: '#2e3615',
          900: '#232910',
          950: '#141807',
        },
        navy: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        auction: {
          live: '#22c55e',
          ending: '#f59e0b',
          scheduled: '#3b82f6',
          ended: '#6b7280',
        },
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)',
        'gradient-brand': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
        'gradient-hero': 'linear-gradient(180deg, #0f0e1a 0%, #1a1830 50%, #0f0e1a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      keyframes: {
        'bid-flash': {
          '0%': { backgroundColor: 'rgb(34 197 94 / 0.3)', transform: 'scale(1.02)' },
          '50%': { backgroundColor: 'rgb(34 197 94 / 0.15)' },
          '100%': { backgroundColor: 'transparent', transform: 'scale(1)' },
        },
        'bid-slide-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'bid-flash': 'bid-flash 1.5s ease-out, bid-slide-in 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      boxShadow: {
        'glow-sm':  '0 0 20px rgba(99,102,241,0.15)',
        'glow-md':  '0 0 40px rgba(99,102,241,0.2)',
        'glow-lg':  '0 0 80px rgba(99,102,241,0.25)',
        'glass':    '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        'premium':  '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
