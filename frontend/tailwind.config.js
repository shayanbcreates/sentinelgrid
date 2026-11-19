/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0d1117",
          elevated: "#161b22",
          overlay: "#1c2128",
        },
        accent: {
          DEFAULT: "#58a6ff",
          dim: "#1f6feb",
          glow: "rgba(88,166,255,0.15)",
        },
        threat: {
          critical: "#f85149",
          high: "#ff7b72",
          medium: "#e3b341",
          low: "#3fb950",
          info: "#58a6ff",
        },
        border: {
          subtle: "#30363d",
          muted: "#21262d",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "ui-monospace", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "threat-ping": "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
