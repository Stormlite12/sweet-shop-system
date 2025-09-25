// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        sweetshop: {
          "primary": "#f97316",        // Orange 
          "secondary": "#06b6d4",      // Cyan  
          "accent": "#10b981",         // Green
          "neutral": "#374151",        // Gray
          "base-100": "#ffffff",       // White
          "info": "#3b82f6",          // Blue
          "success": "#10b981",        // Green
          "warning": "#f59e0b",        // Yellow
          "error": "#ef4444",          // Red
        },
      },
      "cupcake", "dark", "retro"
    ],
  },
}