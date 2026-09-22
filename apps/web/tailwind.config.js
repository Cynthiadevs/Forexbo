/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070A13',
        card: '#0D1424',
        'card-hover': '#131D33',
        border: '#1E2B45',
        primary: {
          DEFAULT: '#00E676',
          dark: '#00B359',
          light: '#66FFA6',
        },
        accent: {
          DEFAULT: '#00B0FF',
          purple: '#7C4DFF',
          amber: '#FFAB00',
          red: '#FF3D71',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8F9BB3',
          muted: '#52617D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};
