module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'NearDarkGray': '#3F4246',
      'NearLightGray': '#A7A7A7',
      'NearBlack': '#262626',
      'NewGray': '#f4f4f4',
      'NearNavBar': '#f0f0f1',
      'TextGray' : '#72727a'
    })
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
