"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { useProductChat } from "../hooks/useProductChat";
import { useChatWidget } from "../hooks/useChatWidget";
import { ChatMessage } from "./ChatMessage";
import { ChatProductList } from "./ChatProductList";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatError } from "./ChatError";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import { ScrollableMessageContainer } from "./ScrollableMessageContainer";
import { AnimatedRobotIcon } from "./AnimatedRobotIcon";
import SearchTips from "./SearchTips";

export default function ChatWidget() {
  const { isOpen, setIsOpen, isWidgetInitialized, isMobile, inputRef } =
    useChatWidget();

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

  // Don't render anything until we've checked localStorage
  if (!isWidgetInitialized) {
    return null;
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg z-50 hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
        aria-label="Open chat"
      >
        <AnimatedRobotIcon
          className="text-white"
          size={24}
          enableGreeting={true}
          showCircle={false}
        />
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

      <CardContent className="flex-1 overflow-hidden p-3 pb-0 bg-background">
        <ScrollableMessageContainer
          messageCount={messages.length}
          productCount={streamedProducts.length}
          isOpen={isOpen}
          isLoading={isLoading}
          className="h-full overflow-auto"
        >
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
                    onProductClick={() => setIsOpen(false)}
                  />
                );
              }
              return null;
            })}

            {/* Show streamed products if available */}
            {streamedProducts.length > 0 && (
              <div className="mb-4">
                <ChatProductList
                  products={streamedProducts}
                  onProductClick={() => setIsOpen(false)}
                />
              </div>
            )}

            {/* Show loading indicator only if the last message is from the assistant and is still loading */}
            {isLoading &&
              !messages.some(
                (m) =>
                  m.role === "assistant" &&
                  m.id === messages[messages.length - 1]?.id &&
                  m.content?.trim() !== ""
              ) &&
              streamedProducts.length === 0 && (
                <ChatLoadingIndicator productStatus={null} productCount={0} />
              )}
          </div>
        </ScrollableMessageContainer>
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
