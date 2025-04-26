import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(220, 14%, 96%)",        // ✅ Now Tailwind understands border-border
        background: "hsl(0, 0%, 100%)",       // Matches your bg-background if needed
        foreground: "hsl(220, 9%, 20%)",      // Matches your text-foreground if needed
      },
    },
  },
  plugins: [],
};

export default config;
