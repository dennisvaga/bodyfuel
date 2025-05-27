import { NextRequest } from "next/server";
import { handleChatRequest } from "./chat.controller";

export async function POST(request: NextRequest) {
  return await handleChatRequest(request);
}

// Optional: Add other HTTP methods if needed
export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Chat API is running",
      endpoints: {
        POST: "/api/chat - Send a chat message",
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
