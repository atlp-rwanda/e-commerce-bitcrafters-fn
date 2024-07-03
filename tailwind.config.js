/* eslint-disable */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["poppins"],
        body: ['"poppins"'],
      },
      colors: {
        black: "#262626",
        orange: "#FA8232",
        gray: "#F0EEED",
        gray_100: "#A8A8A8",
        on_black: "#FFFFFF",
        "main-black-color": "#262626",
        links: "#1976D2",
        "links-hover": "#0563c1",
        dashColor: "#F3F2F0",
        view_more: "#4D98E2",
        view_more_text: "#1976D2",
        back_next: "#BDBBBB",
        "custom-bg": "#F3F2F0",
        "custom-white": "#FFFFFF",
        chat_back: "#F5F5F5",
      },
      borderRadius: {
        sm: "5px",
        md: "8px",
        lg: "10px",
        xl: "16px",
        "2xl": "24px",
      },
      screens: {
        phone: "450px",
        bigphone: "650px",
        tablet: "860px",
        laptop: "1200px",
      },
      screens: {
        phone: "450px",
        bigphone: "650px",
        tablet: "860px",
        laptop: "1200px",
      },
      height: {
        "50vh": "50vh",
      },
      boxShadow: {
        "black-shadow":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      fontSize: {
        "custom-size": "0.60rem",
      },
    },
  },
  plugins: [],
};
