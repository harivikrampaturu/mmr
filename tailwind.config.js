/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      screens: {
        xs: '300px',
        '3xl': '1900px',
        '4xl': '2500px',
        '6xl': '3200px',
        '10xl': '4500px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      backgroundColor: {
        'gray-ed': '#EDEDED',
        'gray-f6': '#F6F6F6',
        blue: '#3659FA'
      },
      colors: {
        't-gray': '#5C5C5C',
        't-gray-8d': '#8D8D8D',
        't-black-70': '#18191F',
        'f-blue': '#010029',
        black: '#000',
        white: '#fff',
        random: 'rgba(123,56,23)',
        'border-color': '#EDEDED',
        'gray-f5': '#F5F5F5'
      },
      boxShadow: {
        signature: '0px 3px 11px 0px rgba(0, 0, 0, 0.07)',
        'heaven-gradient': '2px -30px 37px -3px  rgba(255,255,255,1)',
        'heaven-gradient-down': 'inset -11px 30px 40px 5px rgba(255,255,255,1)',
        'heaven-gradient-up': 'inset -11px -32px 40px 5px rgba(255,255,255,1)',
        'standard-inner': '0px 0px 20px 5px #FFF inset'
      },
      fontSize: {
        'clamp-heading-sm': 'clamp(1.3rem, 5vw, 32px)',
        'clamp-heading-md': 'clamp(2.2rem, 5vw, 48px)',
        'clamp-heading': 'clamp(2.25rem, 5vw, 53px)',
        'clamp-heading-lg': 'clamp(2.25rem, 5vw, 57px)',
        'clamp-heading-xl': 'clamp(3rem, 5vw, 66px)'
      }
    }
  },
  plugins: []
};
