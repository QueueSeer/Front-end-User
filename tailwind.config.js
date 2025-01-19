module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8677A7", // ตั้งค่า primary color
        secondary: "#65558F",
        secondary2: "#420F75",
        background: "#b2aac7",
      },
      fontFamily: {
        notosans: ['Noto Sans Thai', 'sans-serif'], // ฟอนต์ที่กำหนดเอง
      },
    },
  },
  plugins: [require("daisyui")],
};
