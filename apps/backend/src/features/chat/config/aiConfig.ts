import { createDeepSeek } from "@ai-sdk/deepseek";

// Initialize DeepSeek AI
const DEEPSEEK_API = process.env.DEEPSEEK_API ?? "";

if (!DEEPSEEK_API) {
  throw new Error("DEEPSEEK_API environment variable is required");
}

export const deepseek = createDeepSeek({
  apiKey: DEEPSEEK_API,
  baseURL: "https://api.deepseek.com/v1",
});

export const AI_CONFIG = {
  temperature: 0.7,
  maxTokensGeneral: 300,
  maxTokensProduct: 500,
} as const;
