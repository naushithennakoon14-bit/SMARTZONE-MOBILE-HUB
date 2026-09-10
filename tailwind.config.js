/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          hover: '#F1F5F9',
        },
        border: {
          subtle: '#E2E8F0',
          highlight: '#CBD5E1',
        },
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          glow: 'rgba(79, 70, 229, 0.15)',
        },
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.15)',
        },
        danger: {
          DEFAULT: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.15)',
        },
        slate: {
          text: '#0F172A',
          muted: '#334155',
          dim: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 4px 14px 0 rgba(79, 70, 229, 0.25)',
        'glow-green': '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
        'glass': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
