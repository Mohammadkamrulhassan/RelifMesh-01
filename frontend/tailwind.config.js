/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
        accent: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' },
        surface: { 1: 'var(--color-surface)', 2: 'var(--color-surface-2)', 3: 'var(--color-surface-3)' },
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-sm)',
        card: 'var(--shadow-md)',
        pop: 'var(--shadow-lg)',
        modal: 'var(--shadow-xl)',
      },
      spacing: {
        18: '72px',
      },
    },
  },
  plugins: [],
}
