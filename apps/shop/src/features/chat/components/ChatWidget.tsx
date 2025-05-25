"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { useProductChat } from "../hooks/useProductChat";
import { ChatMessage } from "./ChatMessage";
import { ChatProductList } from "./ChatProductList";
import SearchTips from "./SearchTips";
import { cn } from "@/lib/utils";
import {
  loadFormDataFromLocalStorage,
  saveFormDataToLocalStorage,
} from "@repo/shared";
import { useKeyboardHeight } from "../hooks/useKeyboardHeight";

const CHAT_WIDGET_KEY = "chatWidgetOpen";

export default function ChatWidget() {
  // Initialize with false (closed) instead of true
  const [isOpen, setIsOpen] = useState(false);
  const [isWidgetInitialized, setIsWidgetInitialized] = useState(false);
  // Track input focus state to adjust position when mobile keyboard appears
  const [isInputFocused, setIsInputFocused] = useState(false);
  // Use keyboard height detection hook
  const { isKeyboardVisible, keyboardPercentage } = useKeyboardHeight();

  useEffect(() => {
    const savedState = loadFormDataFromLocalStorage<boolean>(CHAT_WIDGET_KEY);
    setIsOpen(savedState === true);
    setIsWidgetInitialized(true);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    isLoading,
    processingMessages,
    extractProductData,
    streamedProducts,
    productStatus,
  } = useProductChat();

  // Save widget state using storage utilities when it changes
  useEffect(() => {
    if (isWidgetInitialized) {
      saveFormDataToLocalStorage(CHAT_WIDGET_KEY, isOpen);
    }
  }, [isOpen, isWidgetInitialized]);

  // Scroll to bottom whenever messages or products change
  useEffect(() => {
    if (isOpen && (messages.length > 0 || streamedProducts.length > 0)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamedProducts, isOpen]);

  // Don't render anything until we've checked localStorage
  if (!isWidgetInitialized) {
    return null;
  }

  // Calculate dynamic positioning class based on input focus for mobile keyboards
  const widgetPositionClass = cn(
    "fixed right-4",
    isInputFocused &&
      isKeyboardVisible &&
      typeof window !== "undefined" &&
      window.innerWidth < 768
      ? `md:bottom-4 bottom-[${keyboardPercentage + 5}vh]` // Position above keyboard with 5% extra space
      : "md:bottom-4 bottom-0" // Normal position
  );

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg z-50"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        widgetPositionClass,
        "w-[calc(100%-2rem)] h-[min(500px,80vh)] md:w-[400px] md:h-[min(500px,70vh)] max-w-full flex flex-col shadow-xl z-50 bg-card border-border"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">
          BodyFuel Assistant
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-3 pb-0 bg-background min-h-0">
        {/* Always show search tips at the top */}
        <SearchTips className="mb-4" />

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
            <p>{error.message || "An error occurred"}</p>
            <Button
              onClick={() => reload()}
              variant="destructive"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}
        <div className="space-y-4">
          {messages.map((message) => {
            // Always show user messages
            // For assistant messages, show them unless they're empty and still loading
            const shouldHideMessage =
              message.role === "assistant" &&
              message.id === messages[messages.length - 1].id &&
              isLoading &&
              (!message.content || message.content.trim() === "");

            if (!shouldHideMessage) {
              return (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  role={message.role}
                  content={message.content}
                  parts={message.parts
                    ?.filter((part) => part.type === "text")
                    .map((part) => ({
                      type: part.type,
                      text: "text" in part ? part.text : "",
                    }))}
                  extractProductData={extractProductData}
                />
              );
            }
            return null;
          })}

          {/* Display streamed products if available */}
          {streamedProducts.length > 0 && (
            <div className="mb-4">
              <ChatProductList products={streamedProducts} />
            </div>
          )}

          {/* Show product status or loading indicator */}
          {isLoading && (
            <div className="bg-muted p-3 rounded-lg mr-8 border border-border">
              <div className="flex space-x-3 items-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {productStatus || "Processing your request"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {streamedProducts.length > 0
                      ? `Found ${streamedProducts.length} products so far...`
                      : "This may take a moment..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search tips are now always shown at the top of the chat */}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border flex gap-2 bg-card items-center"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about our products..."
          className={cn(
            "flex-1 p-2 border rounded-md bg-background text-foreground",
            "border-input focus:border-primary focus:ring-1 focus:ring-primary"
          )}
          disabled={isLoading}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
