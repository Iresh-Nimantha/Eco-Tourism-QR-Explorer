/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          200: "#93C5FD",
        },
        indigo: {
          200: "#C7D2FE",
        },
        green: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        emerald: {
          200: "#A7F3D0",
        },
        slate: {
          50: "#F8FAFC",
          300: "#CBD5E1",
          400: "#94A3B8",
          800: "#1E293B",
        },
      },
    },
  },
  plugins: [],
};
