/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        128: "32rem", // Example of extending spacing (e.g., padding, margin)
      },
      colors: {
        customGreen: "#00FF00", // Example of extending color palette
      },
      screens: {
        sm: "480px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra-large screens
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
