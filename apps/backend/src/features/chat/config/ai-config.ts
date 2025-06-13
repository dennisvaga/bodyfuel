import { createDeepSeek } from "@ai-sdk/deepseek";

let deepseekInstance: ReturnType<typeof createDeepSeek> | null = null;

// Lazy initialization function for DeepSeek AI
export function getDeepSeek() {
  if (!deepseekInstance) {
    const DEEPSEEK_API = process.env.DEEPSEEK_API ?? "";

    if (!DEEPSEEK_API) {
      throw new Error("DEEPSEEK_API environment variable is required");
    }

    deepseekInstance = createDeepSeek({
      apiKey: DEEPSEEK_API,
      baseURL: "https://api.deepseek.com/v1",
    });
  }

  return deepseekInstance;
}

export const AI_CONFIG = {
  temperature: 0.7,
  maxTokensGeneral: 300,
  maxTokensProduct: 500,
} as const;
