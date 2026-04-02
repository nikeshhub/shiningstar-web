/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: true, // To override MUI styles when needed
  theme: {
    extend: {
      colors: {
        // Primary Blue
        'blue': {
          DEFAULT: '#1B4FD8',
          hover: '#1644C0',
          light: '#EEF3FF',
          mid: '#C7D6FC',
        },
        // Dark & Neutrals
        'ink': '#0A0F1E',
        'body': '#3D4460',
        'muted': '#8A91AA',
        'border': '#E8EAF0',
        // Backgrounds
        'bg': '#F7F8FC',
        'surface': '#FFFFFF',
        // Semantic Colors
        'success': {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
        },
        'warning': {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
        'danger': {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        'info': {
          DEFAULT: '#7C3AED',
          light: '#EDE9FE',
        },
      },
      fontFamily: {
        'display': ['Fraunces', 'serif'],
        'sans': ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.4', letterSpacing: '0.06em' }],
        'sm': ['12px', { lineHeight: '1.5' }],
        'base': ['13px', { lineHeight: '1.5' }],
        'md': ['14px', { lineHeight: '1.5' }],
        'lg': ['16px', { lineHeight: '1.5' }],
        'xl': ['20px', { lineHeight: '1.3' }],
        '2xl': ['24px', { lineHeight: '1.2' }],
        '3xl': ['32px', { lineHeight: '1.1' }],
        '4xl': ['48px', { lineHeight: '1' }],
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '14px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0, 0, 0, 0.07)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.10)',
      },
      transitionDuration: {
        'DEFAULT': '150ms',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's reset to avoid conflicts with MUI
  },
}
