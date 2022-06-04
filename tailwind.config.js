module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extends: {
      // screens: {
      //   xs: "470px",
      // },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["lofi"],
  },
};
