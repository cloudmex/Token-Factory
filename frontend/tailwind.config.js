module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'NearDarkGray': '#3F4246',
      'NearLightGray': '#A7A7A7',
      'NearBlack': '#262626',
      'NearNavBar': '#fcfcfc',
      'NewGray': '#f4f4f4'
    })
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
