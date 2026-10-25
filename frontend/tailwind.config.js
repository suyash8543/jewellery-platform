/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          950: '#1F060B',
          900: '#330A10',
          800: '#4A0E17',
          700: '#671420',
          600: '#841B2B',
        },
        gold: {
          50: '#FAF6ED',
          100: '#F5EDDB',
          200: '#EBDBB8',
          300: '#E0C994',
          400: '#D4AF37', // Classic Rich Gold
          500: '#C5A059', // Antique Gold
          600: '#A6823C',
          700: '#826325',
          800: '#5E4617',
        },
        ivory: {
          DEFAULT: '#FDFBF7',
          warm: '#F7F3EC',
          border: '#EAE4D9',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(74, 14, 23, 0.15)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
