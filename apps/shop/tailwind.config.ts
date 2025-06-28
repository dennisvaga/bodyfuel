import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}",
  ],
  presets: [sharedConfig],
};

export default config;
