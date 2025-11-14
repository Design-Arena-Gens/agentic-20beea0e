import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bull: '#16a34a',
        bear: '#dc2626',
        neutral: '#64748b'
      }
    }
  },
  plugins: []
} satisfies Config
