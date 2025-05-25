/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    function({ addComponents, theme }) {
      addComponents({
        '.radial-progress': {
          '--value': '0',
          '--size': '3rem',
          '--thickness': 'calc(var(--size) / 10)',
          'aspect-ratio': '1/1',
          'position': 'relative',
          'display': 'inline-grid',
          'place-content': 'center',
          'border-radius': '50%',
          'background': `conic-gradient(currentColor calc(var(--value) * 1%), ${theme('colors.gray.200')} 0)`,
          '&::before': {
            'content': '""',
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': 'calc(100% - var(--thickness))',
            'height': 'calc(100% - var(--thickness))',
            'background': theme('colors.white'),
            'border-radius': '50%'
          }
        }
      })
    }
  ],
}
