"use client";

import React, { useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useProductChat } from "../hooks/useProductChat";
import { useChatWidget } from "../hooks/useChatWidget";
import { ChatMessage } from "./ChatMessage";
import { ChatProductList } from "./ChatProductList";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatError } from "./ChatError";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import SearchTips from "./SearchTips";

export default function ChatWidget() {
  const {
    isOpen,
    setIsOpen,
    isWidgetInitialized,
    isMobile,
    inputRef,
    messagesEndRef,
    scrollToBottom,
  } = useChatWidget();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    isLoading,
    extractProductData,
    streamedProducts,
    productStatus,
  } = useProductChat();

  // Scroll to bottom whenever messages or products change
  useEffect(() => {
    if (isOpen && (messages.length > 0 || streamedProducts.length > 0)) {
      scrollToBottom();
    }
  }, [messages, streamedProducts, isOpen, scrollToBottom]);

  // Don't render anything until we've checked localStorage
  if (!isWidgetInitialized) {
    return null;
  }

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

  // Different styling for mobile vs desktop
  const cardClassName = isMobile
    ? "fixed inset-0 w-full h-full flex flex-col z-50 bg-card border-none rounded-none"
    : "fixed bottom-4 right-4 w-[400px] h-[min(500px,70vh)] max-w-full flex flex-col shadow-xl z-50 bg-card border-border";

  return (
    <Card className={cardClassName}>
      <ChatHeader isMobile={isMobile} onClose={() => setIsOpen(false)} />

      <CardContent className="flex-1 overflow-auto p-3 pb-0 bg-background">
        <SearchTips className="mb-4" />

        {error && <ChatError error={error} onRetry={reload} />}

        <div className="space-y-4">
          {messages.map((message) => {
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

          {streamedProducts.length > 0 && (
            <div className="mb-4">
              <ChatProductList products={streamedProducts} />
            </div>
          )}

          {isLoading && (
            <ChatLoadingIndicator
              productStatus={productStatus}
              productCount={streamedProducts.length}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <ChatInput
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Card>
  );
}
