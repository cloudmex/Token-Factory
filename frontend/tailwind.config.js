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
      'TextGray' : '#72727a',
      'InputBackgroundBlue' : 'rgb(240, 249, 255)',
      'InputBorderBlue' : 'rgb(143, 205, 255)'
    }),
    textColor: theme => ({
      ...theme('colors'),
      'BlueHeader': '#0056b4',
      'Error': '#e83e8c'
    })
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
