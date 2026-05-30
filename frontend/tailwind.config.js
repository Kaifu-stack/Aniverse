/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050507',
        deep: '#0a0a12',
        surface: '#10101e',
        panel: '#14142a',
        border: '#1e1e3a',
        neon: '#7c3aed',
        neonBright: '#a855f7',
        neonGlow: '#c084fc',
        cyan: '#06b6d4',
        cyanBright: '#22d3ee',
        rose: '#f43f5e',
        gold: '#eab308',
        text: '#e2e8f0',
        muted: '#94a3b8',
        subtle: '#475569',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124,58,237,0.4), transparent)',
        'card-glow': 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.95) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 1.8s infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(124,58,237,0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(124,58,237,0.9), 0 0 60px rgba(124,58,237,0.4)' },
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateX(-10px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
