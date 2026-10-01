import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "chatify-primary": "#06b6d4",
        "chatify-primary-hover": "#0891b2",
        "chatify-violet": "#6366f1",
        "chatify-dark-bg": "#0b0f19",
        "chatify-dark-panel": "#111827",
        "chatify-dark-header": "#1f2937",
        "chatify-dark-hover": "#374151",
        "chatify-dark-border": "#1f2937",
        "chatify-dark-input": "#1f2937",
        "chatify-bubble-out": "#0891b2",
        "chatify-bubble-in": "#1f2937",
        "chatify-light-bg": "#f8fafc",
        "chatify-light-panel": "#ffffff",
        "chatify-light-header": "#f1f5f9",
        "chatify-light-hover": "#f1f5f9",
        "chatify-light-border": "#e2e8f0",
        "chatify-light-bubble-out": "#e0f2fe",
        "chatify-light-bubble-in": "#ffffff",
        "chatify-cyan-tick": "#22d3ee",
      },
      animation: {
        border: "border 4s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
    },
  },
  plugins: [daisyui],
}