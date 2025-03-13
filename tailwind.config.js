/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: "#7c3cdd",
        primary: "#050404",
        light: "#f7f4f5",
        secondary: "#d1d5db",
      },
      fontFamily: {
        sans: ["Poppins-Regular"], // Becomes default font
        "sans-bold": ["Poppins-Bold"],
        "sans-medium": ["Poppins-Medium"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        Text: {
          fontFamily: "Poppins-Regular",
        },
      });
    },
  ],
};
