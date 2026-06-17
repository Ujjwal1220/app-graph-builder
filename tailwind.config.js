/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f1117',
          secondary: '#1a1d27',
          card: '#1e2130',
          hover: '#252840',
        },
        accent: {
          green: '#22c55e',
          red: '#ef4444',
          orange: '#f97316',
          purple: '#a855f7',
          blue: '#3b82f6',
        },
        border: {
          subtle: '#2a2d3e',
          DEFAULT: '#353850',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
