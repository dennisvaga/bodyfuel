"use client";

import React, { memo } from "react";
import { cn } from "@repo/ui/lib/cn";
import { ChatProductList } from "./ChatProductList";
import ReactMarkdown from "react-markdown";
import { ErrorBoundary } from "react-error-boundary";
import {
  cleanHtmlContent,
  getMessageStyles,
  type ExtractedProductData,
} from "../utils/chatUtils";

interface ChatMessageProps {
  id: string;
  role: string;
  content: string;
  parts?: Array<{ type: string; text: string }>;
  extractProductData: (text: string) => ExtractedProductData;
  onProductClick?: () => void;
}

/**
 * Fallback component for markdown rendering errors
 */
function MarkdownFallback({ content }: { content: string }) {
  return (
    <div className="text-red-500">
      Error rendering message: {content.substring(0, 50)}...
    </div>
  );
}

/**
 * Memoized message content component to prevent unnecessary re-renders
 * Handles both product data display and regular markdown text
 */
const MessageContent = memo(function MessageContent({
  content,
  extractProductData,
  role,
  onProductClick,
}: {
  content: string;
  extractProductData: (text: string) => ExtractedProductData;
  role: string;
  onProductClick?: () => void;
}) {
  // Extract product data if present
  const { hasProductData, productData, beforeData, afterData } =
    extractProductData(content);

  // Get styles based on message role
  const { textColor } = getMessageStyles(role);

  if (hasProductData && productData) {
    return (
      <>
        {beforeData && (
          <div
            className={
              role === "user" ? "mb-2 text-white" : "mb-2 text-foreground"
            }
            aria-label={`${role} message introduction`}
          >
            <div className="whitespace-pre-wrap break-words">
              <ErrorBoundary
                fallback={<MarkdownFallback content={beforeData} />}
              >
                <ReactMarkdown>{beforeData}</ReactMarkdown>
              </ErrorBoundary>
            </div>
          </div>
        )}
        <ChatProductList
          products={productData}
          className="my-3"
          onProductClick={onProductClick}
        />
        {afterData && (
          <div
            className={
              role === "user" ? "mt-2 text-white" : "mt-2 text-foreground"
            }
            aria-label={`${role} message conclusion`}
          >
            <div className="whitespace-pre-wrap break-words">
              <ErrorBoundary
                fallback={<MarkdownFallback content={afterData} />}
              >
                <ReactMarkdown>{afterData}</ReactMarkdown>
              </ErrorBoundary>
            </div>
          </div>
        )}
      </>
    );
  }

  // For regular text messages, clean content and render markdown
  const cleanedContent = cleanHtmlContent(content);

  return (
    <div className={textColor} aria-label={`${role} message`}>
      <div className="whitespace-pre-wrap break-words">
        <ErrorBoundary fallback={<MarkdownFallback content={cleanedContent} />}>
          <ReactMarkdown>{cleanedContent}</ReactMarkdown>
        </ErrorBoundary>
      </div>
    </div>
  );
});

/**
 * Chat message component for displaying user and AI messages in conversation
 *
 * Renders different message types with appropriate styling based on the role.
 * Handles complex message structures including embedded product listings and
 * supports both single content strings and multi-part messages.
 */
export function ChatMessage({
  id,
  role,
  content,
  parts,
  extractProductData,
  onProductClick,
}: ChatMessageProps) {
  const { bgColor, textColor, margin } = getMessageStyles(role);

  return (
    <div
      className={cn(
        "p-2 rounded-lg",
        bgColor, // Use the extracted bgColor
        textColor, // Use the extracted textColor
        margin // Use the extracted margin
      )}
      role="listitem"
      aria-label={`${role} message`}
    >
      {parts && parts.length > 0 ? (
        parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <MessageContent
                key={`${id}-part-${index}`}
                content={part.text}
                extractProductData={extractProductData}
                role={role}
                onProductClick={onProductClick}
              />
            );
          }
          return null;
        })
      ) : (
        <MessageContent
          content={content}
          extractProductData={extractProductData}
          role={role}
          onProductClick={onProductClick}
        />
      )}
    </div>
  );
}
