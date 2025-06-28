import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "presets" | "theme"> = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}",
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontSize: {
        sm: "0.777rem",
        base: "0.875rem",
        xl: "0.984rem",
        "2xl": "1.107rem",
        "3xl": "1.245rem",
        "4xl": "1.401rem",
        "5xl": "1.576rem",
        "6xl": "1.773rem",
      },
    },
  },
};

export default config;
