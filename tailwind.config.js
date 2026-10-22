// Tailwind build config — the app's CSS is generated into css/tailwind.css (no CDN, so it works offline).
// Rebuild after adding new Tailwind classes:
//   npx --yes tailwindcss@3.4.17 -c tailwind.config.js -i css/tailwind.input.css -o css/tailwind.css --minify
module.exports = {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif']
      }
    }
  }
};
