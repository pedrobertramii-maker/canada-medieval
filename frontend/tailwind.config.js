/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cores medievais
        parchment: {
          50: '#FBF6E9',
          100: '#F5EBD3',
          200: '#E9D5A1',
          300: '#D4B97A',
        },
        wood: {
          50: '#F4ECDF',
          100: '#E0CBA3',
          200: '#A87B4F',
          300: '#8B5A2B',
          400: '#6F4423',
          500: '#5C371B',
          600: '#3F2613',
          700: '#2A1A0D',
          800: '#1B1108',
          900: '#0F0905',
        },
        iron: {
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
        gold: {
          300: '#F5D77B',
          400: '#E6B84F',
          500: '#C99A2E',
          600: '#A87B1F',
          700: '#7A5616',
        },
        maple: {
          400: '#D9534F',
          500: '#B3392C',
          600: '#8C2A1F',
        },
        torch: {
          400: '#FFA94D',
          500: '#FF7B00',
          600: '#E8590C',
        },
        stone: {
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
        },
        forest: {
          400: '#65A30D',
          500: '#4D7C0F',
          600: '#365314',
          700: '#1A2E05',
        },
        background: '#0F0905',
        surface: '#1B1108',
        elevated: '#2A1A0D',
        border: '#3F2613',
      },
      fontFamily: {
        medieval: ['"Cinzel"', '"Playfair Display"', 'serif'],
        body: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'parchment-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0 0.1 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E\")",
        'stone-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%233F2613'/%3E%3Crect x='0' y='0' width='20' height='20' fill='%232A1A0D'/%3E%3Crect x='20' y='0' width='20' height='20' fill='%231B1108'/%3E%3Crect x='40' y='0' width='20' height='20' fill='%232A1A0D'/%3E%3Crect x='10' y='20' width='20' height='20' fill='%231B1108'/%3E%3Crect x='30' y='20' width='20' height='20' fill='%232A1A0D'/%3E%3Crect x='0' y='40' width='20' height='20' fill='%232A1A0D'/%3E%3Crect x='20' y='40' width='20' height='20' fill='%231B1108'/%3E%3Crect x='40' y='40' width='20' height='20' fill='%232A1A0D'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(230, 184, 79, 0.4), 0 0 40px rgba(230, 184, 79, 0.2)',
        'torch-glow': '0 0 30px rgba(255, 123, 0, 0.5), 0 0 60px rgba(255, 123, 0, 0.3)',
        'medieval': '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'inset-stone': 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'torch-flicker': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.97)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'torch-flicker': 'torch-flicker 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fade-up': 'fade-up 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
