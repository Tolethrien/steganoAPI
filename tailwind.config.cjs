/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-color": "#A27374",
        "main-text": "#FF9FA0",
        "sub-text": "#FFD8D8",
        "inputs-bg": "#584243",
      },
      boxShadow: {
        "tile-shadow": "inset 0px 0px 8px 0px rgba(200, 200, 200, 1)",
        "input-shadow": "inset 5px 5px 4px 0px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
