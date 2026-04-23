import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'ap-dark': '#1A1A1A',
        'ap-mid': '#4A4A4A',
        'ap-light': '#888888',
        'ap-blue': '#185FA5',
        'ap-blue-light': '#E6F1FB',
        'ap-teal': '#0F6E56',
        'ap-teal-light': '#E1F5EE',
        'ap-purple': '#534AB7',
        'ap-surface': '#F7F7F5',
        'ap-border': '#E0E0E0',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
}

export default config
