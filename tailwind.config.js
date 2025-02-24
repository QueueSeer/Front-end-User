/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8677A7",
        secondary: "#65558F",
        secondary2: "#420F75",
        background: "#b2aac7",
        cancel: "#800020",
        bordercancel: "#990033",
      },
      fontFamily: {
        sans: ['Noto Sans Thai', 'sans-serif'],
      },
      screens: {
        'xxl': '1800px',
      },
      width: {
        screen: "100vw", // ทำให้ w-screen ใช้ได้จริง
      },
      height: {
        screen: "100vh", // ทำให้ h-screen ใช้ได้จริง
      },
    },
  },
  plugins: [require("daisyui")],
};
