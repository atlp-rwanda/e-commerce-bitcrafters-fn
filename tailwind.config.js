/* eslint-disable */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['poppins'],
        'body': ['"poppins"'],
      },
      colors:{
        black:"#262626",
        orange:"#FA8232",
        gray:"#F0EEED",
        gray_100:"#A8A8A8",
        on_black:"#FFFFFF"
      },
      borderRadius:{
        'sm': '5px',
        'md': '8px',
        'lg': '10px',
        'xl': '16px',
        '2xl': '24px'
      },
      screens:{
        phone:"450px",
        bigphone:"650px",
        tablet:"860px",
        laptop:"1200px",
      }
    },
  },
  plugins: [],
};
