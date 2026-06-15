import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: "#0B2A1E",
          700: "#1B3A2C",
          500: "#2C5F3F"
        },
        mint: {
          400: "#4FD1C5"
        },
        amber: {
          400: "#F5B544"
        },
        cream: {
          50: "#FAF7F2"
        }
      },
      boxShadow: {
        "rideflow-card": "0 12px 32px -12px rgba(11, 42, 30, 0.18)",
        "rideflow-card-hover": "0 24px 48px -16px rgba(11, 42, 30, 0.28)"
      },
      borderRadius: {
        "4xl": "32px"
      },
      keyframes: {
        "rideflow-card-lift": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        "rideflow-hero-rise": {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "rideflow-cover-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "rideflow-card-lift": "rideflow-card-lift 200ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        "rideflow-hero-rise": "rideflow-hero-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rideflow-cover-fade": "rideflow-cover-fade 400ms cubic-bezier(0.22, 0.61, 0.36, 1) both"
      }
    }
  },
  plugins: []
};

export default config;
