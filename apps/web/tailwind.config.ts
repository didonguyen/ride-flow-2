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
          900: "#003527",
          800: "#064E3B",
          700: "#1B3A2C",
          500: "#2B6954"
        },
        mint: {
          400: "#4FD1C5"
        },
        sage: {
          100: "#E7F2EC",
          200: "#C3ECD7",
          300: "#A8CFBC",
          400: "#80BEA6"
        },
        terracotta: {
          100: "#FBE9E0",
          200: "#F2CFBF",
          500: "#B65A3A"
        },
        amber: {
          100: "#FFEDC2",
          400: "#F5B544",
          500: "#E89A2C"
        },
        ink: {
          950: "#191C1B",
          700: "#404944",
          500: "#707974"
        },
        paper: {
          50: "#F8FAF6",
          100: "#F2F4F1",
          200: "#ECEEEB"
        },
        cream: {
          50: "#FAF7F2"
        }
      },
      fontFamily: {
        montserrat: [
          "Montserrat",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        inter: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      borderRadius: {
        "4xl": "32px",
        "rideflow-sm": "0.5rem",
        "rideflow-md": "0.75rem",
        "rideflow-lg": "1rem",
        "rideflow-xl": "1.5rem",
        "rideflow-2xl": "2rem"
      },
      boxShadow: {
        "rideflow-card": "0 12px 32px -12px rgba(11, 42, 30, 0.18)",
        "rideflow-card-hover": "0 24px 48px -16px rgba(11, 42, 30, 0.28)",
        "rideflow-editorial-card": "0 12px 32px -12px rgba(0, 53, 39, 0.18)",
        "rideflow-editorial-card-hover":
          "0 24px 48px -16px rgba(0, 53, 39, 0.28)",
        "rideflow-chip": "0 4px 14px -6px rgba(0, 53, 39, 0.18)"
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
        },
        "rideflow-dialog-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "rideflow-dialog-fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        },
        "rideflow-dialog-pop-in": {
          "0%": { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -50%) scale(1)"
          }
        },
        "rideflow-dialog-pop-out": {
          "0%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
          "100%": {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)"
          }
        },
        "rideflow-dialog-sheet-in": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" }
        },
        "rideflow-dialog-sheet-out": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" }
        }
      },
      animation: {
        "rideflow-card-lift": "rideflow-card-lift 200ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        "rideflow-hero-rise": "rideflow-hero-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rideflow-cover-fade": "rideflow-cover-fade 400ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "rideflow-dialog-fade-in": "rideflow-dialog-fade-in 180ms ease-out both",
        "rideflow-dialog-fade-out": "rideflow-dialog-fade-out 160ms ease-in both",
        "rideflow-dialog-pop-in":
          "rideflow-dialog-pop-in 200ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rideflow-dialog-pop-out":
          "rideflow-dialog-pop-out 180ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rideflow-dialog-sheet-in":
          "rideflow-dialog-sheet-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rideflow-dialog-sheet-out":
          "rideflow-dialog-sheet-out 220ms cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};

export default config;
