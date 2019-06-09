const tailwindcss = require('tailwindcss');
const cssImport = require('postcss-easy-import');
const autoPrefixer = require('autoprefixer');

module.exports = {
  plugins: [cssImport, tailwindcss('./tailwind.config.js'), autoPrefixer],
};
