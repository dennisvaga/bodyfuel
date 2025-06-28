# BodyFuel Chatbot Implementation Guide

## Overview

The BodyFuel chatbot implements real-time product streaming to enhance user experience by showing products as they're discovered rather than waiting for all results. This document outlines the key implementation details, techniques, and resources used.

## Key Technologies & Documentation

1. **Vercel AI SDK**

   - Documentation: https://ai-sdk.dev/docs/introduction
   - Used for streaming text and custom data between backend and frontend
   - Key references:
     - [Streaming Custom Data](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data)
     - [Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)
     - [useChat Hook](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)
     - [createDataStream](https://ai-sdk.dev/docs/reference/ai-sdk-ui/create-data-stream)
     - [streamText](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text)

2. **Server-Sent Events (SSE)**

   - Used for real-time streaming from server to client
   - Implemented through Express.js and AI SDK's data streaming protocol

3. **DeepSeek AI**
   - Used as the LLM provider for generating chat responses
   - Integrated through the AI SDK

## Architecture

The chatbot follows the feature-based architecture pattern as documented in [architecture-patterns.md](./architecture-patterns.md), organizing code by business feature rather than technical layer:

```
features/
  chat/
    controllers/    (handle HTTP requests/responses)
    services/       (implement business logic)
    repositories/   (handle database operations)
    types/          (define TypeScript types)
    utils/          (utility functions)
    router.ts       (define and export routes)
```

### Backend Components

1. **Controllers** (`apps/backend/src/features/chatbot/controllers/chatController.ts`)

   - Handles HTTP requests for chat functionality
   - Implements SSE streaming for real-time updates
   - Uses `createDataStreamResponse` for streaming

2. **Services** (`apps/backend/src/features/chatbot/services/chatService.ts`)

   - Contains business logic for chat processing
   - Implements product search and query extraction
   - Creates system messages for AI

3. **Repositories** (`apps/backend/src/features/chatbot/repositories/chatRepository.ts`)
   - Implements database queries with Prisma
   - Provides both regular and streaming product search functions
   - Uses AsyncGenerator pattern for streaming products
4. **Router** (`apps/backend/src/features/chatbot/router.ts`)
   - Defines and exports routes for the chat feature
   - Configures middleware for chat endpoints

### Frontend Components

1. **Chat Widget** (`apps/shop/src/features/chatbot/components/ChatWidget.tsx`)

   - Main container component for the chat interface
   - Displays search guidance and loading indicators

2. **Product Chat Hook** (`apps/shop/src/features/chatbot/hooks/useProductChat.ts`)

   - Custom hook for chat state management
   - Processes streaming data from backend

3. **Product List** (`apps/shop/src/features/chatbot/components/ChatProductList.tsx`)
   - Displays streamed products in a list
   - Shows "See more products" link when appropriate

## Key Implementation Techniques

### 1. Real-time Product Streaming

- **AsyncGenerator Pattern**: Used in the repository to yield products one by one
- **Data Stream Protocol**: Used to send structured data alongside text responses
- **Custom Data Types**: Defined specific data types for products, status updates, etc.

### 2. Data Flow

1. User sends a message asking about products
2. Backend detects product query using pattern matching
3. Backend initiates streaming response with `createDataStreamResponse`
4. Products are found one by one and streamed to the frontend
5. Frontend displays products in real-time as they arrive
6. AI response is generated after all products are found

### 3. AI Integration

- **Dynamic System Messages**: Constructed based on available product data
- **Streaming AI Responses**: Using `streamText` and `mergeIntoDataStream`
- **Conversation Persistence**: Saving messages to database for context

### 4. UX Enhancements

- **Search Guidance**: Showing search tips when appropriate
- **Loading Indicators**: Displaying status updates during search
- **"See More Products" Link**: Indicating when more products are available
- **Consistent Product Count**: Ensuring the message about found products matches what's displayed

## Implementation Notes

1. **Product Limit**: Products are limited to 5 in both the repository and UI
2. **Streaming Delay**: Small delays (100-500ms) are added between products to ensure frontend can process them
3. **Error Handling**: Comprehensive error handling for network issues, parsing errors, etc.
4. **Conversation Context**: Messages are saved to database for persistent conversations

## Future Improvements

1. **Pagination**: Add pagination for product results beyond the initial 5
2. **Filtering UI**: Add UI controls for filtering products by price, category, etc.
3. **Voice Input**: Add speech-to-text for voice queries
4. **Product Recommendations**: Enhance AI to provide personalized product recommendations

## Troubleshooting

- **Duplicate Products**: Check for duplicate product handling in the frontend
- **Streaming Issues**: Verify SSE headers and connection handling
- **AI Response Quality**: Adjust system message instructions for better responses
