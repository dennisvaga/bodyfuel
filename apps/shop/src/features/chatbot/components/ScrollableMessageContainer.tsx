"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ScrollableMessageContainerProps {
  children: React.ReactNode;
  className?: string;
  messageCount: number;
  productCount: number;
  isOpen: boolean;
  isLoading: boolean;
}

/**
 * A reusable scrollable container component that handles intelligent scrolling behavior
 * for chat-like interfaces. Provides auto-scroll for new messages while allowing users
 * to scroll up and read previous content without interruption.
 */
export function ScrollableMessageContainer({
  children,
  className = "",
  messageCount,
  productCount,
  isOpen,
  isLoading,
}: ScrollableMessageContainerProps) {
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);

  // Check if user is near the bottom of the chat
  const isNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Handle scroll events to detect user scrolling
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const nearBottom = isNearBottom();
    setIsUserScrolledUp(!nearBottom);
    setShowScrollToBottom(!nearBottom);
  }, [isNearBottom]);

  // Scroll to bottom function - using container scroll instead of scrollIntoView
  const scrollToBottom = useCallback(
    (force = false) => {
      const container = containerRef.current;
      if (!container) return;

      // Only scroll if user is near bottom or force is true
      if (force || !isUserScrolledUp) {
        container.scrollTop = container.scrollHeight;
        setIsUserScrolledUp(false);
        setShowScrollToBottom(false);
      }
    },
    [isUserScrolledUp]
  );

  // Smart scroll function for new messages
  const scrollToNewMessage = useCallback(
    (count: number) => {
      // Only auto-scroll if this is a new message (not an update to existing message)
      if (count > lastMessageCountRef.current) {
        lastMessageCountRef.current = count;
        scrollToBottom();
      }
    },
    [scrollToBottom]
  );

  // Force scroll to bottom (for manual scroll button)
  const forceScrollToBottom = useCallback(() => {
    scrollToBottom(true);
    setHasNewMessage(false);
  }, [scrollToBottom]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Smart scroll for new messages only
  useEffect(() => {
    if (isOpen && messageCount > lastMessageCountRef.current) {
      lastMessageCountRef.current = messageCount;
      if (isUserScrolledUp) {
        setHasNewMessage(true);
      } else {
        scrollToBottom(true);
      }
    }
  }, [messageCount, isOpen, scrollToBottom, isUserScrolledUp]);

  // Auto-scroll when content changes (including loading indicator)
  useEffect(() => {
    if (isOpen && !isUserScrolledUp) {
      // Use setTimeout to ensure DOM is fully updated with new content
      setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 10);
    }
  }, [isOpen, isUserScrolledUp, messageCount, isLoading, productCount]);

  // Mutation observer to watch for content changes during streaming
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOpen) return;

    const observer = new MutationObserver(() => {
      if (!isUserScrolledUp && isLoading) {
        // Scroll to bottom when content changes during streaming
        container.scrollTop = container.scrollHeight;
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [isOpen, isUserScrolledUp, isLoading]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      <div ref={messagesEndRef} className="h-4" /> {/* Add padding at bottom */}
    </div>
  );
}
