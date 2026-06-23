/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#8B1A1A',
          light: '#A52A2A',
          dark: '#6B1010',
          foreground: '#FFFFFF',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#8B1A1A',
          600: '#7f1d1d',
          700: '#6B1010',
          800: '#5c0e0e',
          900: '#450a0a',
        },
        secondary: {
          DEFAULT: '#C5954C',
          light: '#D4A95A',
          dark: '#A67B3E',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#C5954C',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        surface: '#FFFFFF',
        cip: {
          red: '#8B1A1A',
          gold: '#C5954C',
          dark: '#2C1810',
        },
      },
      fontFamily: {
        sans: ['Public Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
